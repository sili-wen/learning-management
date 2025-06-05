import { getAuth } from "@clerk/fastify";
import { FastifyInstance, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { clerkClient } from "../lib/clerk";
import { IdRequest } from "./resources";

const tags = ["users"];

const UserData = z.object({
  publicMetadata: z.object({
    userType: z.string(),
    settings: z
      .object({
        courseNotifications: z.boolean().optional(),
        emailAlerts: z.boolean().optional(),
        smsAlerts: z.boolean().optional(),
        notificationFrequency: z
          .enum(["immediate", "daily", "weekly"])
          .optional(),
        theme: z.enum(["light", "dark"]).optional(),
      })
      .optional(),
  }),
});

const updateUserHander = async (req: FastifyRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "User not authenticated.");
  }

  const userData = req.body as z.infer<typeof UserData>;

  console.log("Updating user", { userId, userData });

  const user = await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      userData: userData.publicMetadata.userType,
      settings: userData.publicMetadata.settings,
    },
  });

  console.log("Updated user", { userId });
  return user;
};

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/users/:id",
    {
      schema: { params: IdRequest, body: UserData, tags },
    },
    updateUserHander
  );
};
