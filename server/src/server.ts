import dotenv from "dotenv";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import logger from "./middleware/logger";
import requestId from "./middleware/requestId";

dotenv.config();

const startServer = async (port: number) => {
  const app = Fastify({
    logger: logger,
    genReqId: requestId,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(import("@fastify/helmet"));
  await app.register(import("@fastify/cors"), {
    origin: true,
  });

  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" };
  });

  app.listen({ port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

const port = Number(process.env.PORT);
startServer(port).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
