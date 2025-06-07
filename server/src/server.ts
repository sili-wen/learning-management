import { awsLambdaFastify } from "@fastify/aws-lambda";
import dotenv from "dotenv";
import Fastify from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import app from "./app";
import logger from "./middleware/logger";
import requestId from "./middleware/requestId";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3000);

const fastify = Fastify({
  logger: logger,
  genReqId: requestId,
}).withTypeProvider<ZodTypeProvider>();
fastify.register(app);

if (!isProduction) {
  fastify.listen({ port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

const proxy = awsLambdaFastify(fastify);
exports.handler = proxy;
