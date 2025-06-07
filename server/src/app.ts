import { clerkPlugin } from "@clerk/fastify";
import Cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import apiReference from "@scalar/fastify-api-reference";
import { FastifyInstance } from "fastify";
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";
import { courseRoutes } from "./routes/courses";
import { paymentIntentRoutes } from "./routes/paymentIntents";
import { transactionsRoutes } from "./routes/transactions";
import { userRoutes } from "./routes/users";

const app = async (fastify: FastifyInstance) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  await fastify.register(fastifyZodOpenApiPlugin);
  await fastify.register(Cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });
  await fastify.register(clerkPlugin, {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  fastify.register(swagger, {
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

  fastify.register(apiReference, {
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

  fastify.register(courseRoutes);
  fastify.register(userRoutes);
  fastify.register(paymentIntentRoutes);
  fastify.register(transactionsRoutes);
};

export default app;
