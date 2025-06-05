import { z } from "zod";

export const IdRequest = z.object({ id: z.string().nonempty() });
