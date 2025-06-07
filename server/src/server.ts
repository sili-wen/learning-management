import { clerkPlugin } from "@clerk/fastify";
import Cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import apiReference from "@scalar/fastify-api-reference";
import Fastify from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";
import logger from "./middleware/logger";
import requestId from "./middleware/requestId";
import { courseRoutes } from "./routes/courses";
import { userRoutes } from "./routes/users";
import { paymentIntentRoutes } from "./routes/paymentIntents";
import { transactionsRoutes } from "./routes/transactions";

export const app = async (port: number) => {
  const app = Fastify({
    logger: logger,
    genReqId: requestId,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(fastifyZodOpenApiPlugin);
  await app.register(Cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });
  await app.register(clerkPlugin, {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  app.register(swagger, {
    openapi: {
      info: {
        title: "Learning Management API Documentation",
        description: "REST API for Learning Management application",
        version: "1.0.0",
      },
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  });

  app.register(apiReference, {
    routePrefix: "/reference",
    configuration: {
      pageTitle: "Learning Management",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "fetch",
      },
      theme: "deepSpace",
    },
  });

  app.register(courseRoutes);
  app.register(userRoutes);
  app.register(paymentIntentRoutes);
  app.register(transactionsRoutes);

  app.listen({ port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};
