import { z } from "zod";

export const IdRequest = z.object({ id: z.string().nonempty() });

export const UserIdRequest = z.object({ userId: z.string().nonempty() });
