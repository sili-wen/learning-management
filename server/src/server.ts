import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const port = Number(process.env.PORT);

app(port).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
