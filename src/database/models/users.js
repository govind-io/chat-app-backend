export const users = [];

export function addusers({ id, userName, roomName }) {
  if (!userName || !roomName) {
    return {
      error: "Username and roomname both are required",
    };
  }

  userName = userName.trim().toLowerCase();
  roomName = roomName.trim().toLowerCase();

  let existinguser = users.find((user) => {
    return userName === user.userName && user.roomName === roomName;
  });

  if (existinguser) {
    return {
      error: "A user with same credentials already exists",
    };
  }

  const user = { id, userName, roomName };

  users.push(user);
  return { user };
}

export function removeuser(id) {
  const userindex = users.findIndex((user) => {
    return user.id === id;
  });
  if (userindex === -1) {
    return {
      error: "no such user exists",
    };
  }
  const user = users[userindex];
  users.splice(userindex, 1);
  return { user };
}

export function getuser(id) {
  const user = users.find((user) => {
    return user.id === id;
  });

  if (!user) {
    return { error: "no such user exists" };
  }

  return {
    user,
  };
}

export function getUserInRoom(room) {
  const user = users.filter((user) => {
    return user.roomName === room;
  });

  if (!user) {
    return { error: "room does not exists" };
  }

  return {
    user,
  };
}
