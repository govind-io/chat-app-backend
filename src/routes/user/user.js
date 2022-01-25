import { Router } from "express";

export const UserRoute = new Router();

UserRoute.get("/hello", (req, res) => {
  res.send("hello from user route");
});
