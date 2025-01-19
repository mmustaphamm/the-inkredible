import app, { PORT } from "./config/app";
import http from "http";
import { Express } from "express";

http
  .createServer(app)
  .listen(PORT, () => console.log(`⚡️ server listening on: http://localhost:${PORT} ⚡️`));
