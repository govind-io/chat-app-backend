import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __publicdir = path.join(__dirname, "../public");

export const app = express();
export const server = createServer(app);
export const io = new Server(server);
app.use(express.static(__publicdir));
