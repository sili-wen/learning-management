import fastifyCors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import logger from "./middleware/logger";
import requestId from "./middleware/requestId";
import { courseRoutes } from "./routes/courses";

dotenv.config();

export const app = async (port: number) => {
  const app = Fastify({
    logger: logger,
    genReqId: requestId,
  }).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(helmet);
  await app.register(fastifyCors, {
    origin: true,
  });

  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" };
  });

  app.register(courseRoutes);

  app.listen({ port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};
