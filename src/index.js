import { server, app, io } from "./app.js";
import {
  addusers,
  getuser,
  getUserInRoom,
  removeuser,
  users,
} from "./database/models/users.js";
import { UserRoute } from "./routes/user/user.js";
const PORT = process.env.PORT || 3001;

app.use("/users", UserRoute);

app.get("*", (req, res) => {
  res.status(404).send("Requested resource not found");
});

io.on("connection", (socket) => {
  socket.on("joinroom", ({ userName, roomName }, callback) => {
    socket.join(roomName);
    const { error, user } = addusers({ id: socket.id, userName, roomName });
    try {
      if (error) {
        return callback(error);
      }
      socket.broadcast.to(user.roomName).emit("message", {
        text: `${user.userName} has joined the chat`,
        timestamp: Date.now(),
        userName: user.userName,
      });
      callback();
      socket.emit("connected", {
        text: "Connected succesfully",
        timestamp: Date.now(),
        userName: user.userName,
      });
      io.to(user.roomName).emit("roomdata", {
        roomname: user.roomName,
        userlist: getUserInRoom(user.roomName).user,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("sendMessage", (msg, callback) => {
    const { error, user } = getuser(socket.id);

    try {
      if (error) {
        return callback(error, undefined);
      }
      io.to(user.roomName).emit("message", {
        text: msg,
        timestamp: Date.now(),
        userName: user.userName,
      });
      callback(undefined, "Got the message");
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("sendLocation", (position, callback) => {
    const { error, user } = getuser(socket.id);
    try {
      if (error) {
        return callback(error, undefined);
      }
      io.to(user.roomName).emit("location", {
        text: `https://www.google.com/maps?q=${position.latitude},${position.longitude}`,
        timestamp: Date.now(),
        userName: user.userName,
      });
      callback(undefined, "Got the location");
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    const { error, user } = removeuser(socket.id);
    if (user) {
      io.to(user.roomName).emit("message", {
        text: "A user has disconnected",
        timestamp: Date.now(),
        userName: user.userName,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`server started at PORT ${PORT}`);
});
