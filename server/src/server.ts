import dotenv from "dotenv";

import serverless from "serverless-http";
import { app } from "./app";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

const port = Number(process.env.PORT);

if (!isProduction) {
  app(port).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

// AWS production environment
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
  return serverlessApp(event, context);
};
