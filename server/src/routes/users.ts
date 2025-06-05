import { FastifyInstance, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { clerkClient } from "../lib/clerk";
import { IdRequest } from "./resources";

const tags = ["users"];

const User = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

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
  const { id } = req.params as z.infer<typeof IdRequest>;
  const userData = req.body as z.infer<typeof UserData>;

  console.log("Updating user", { id, userData });

  const user = await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
      userData: userData.publicMetadata.userType,
      settings: userData.publicMetadata.settings,
    },
  });

  console.log("Updated user", { id });
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
