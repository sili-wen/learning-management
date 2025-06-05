import dotenv from "dotenv";
dotenv.config();

import { createClerkClient } from "@clerk/backend";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY not found");
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
