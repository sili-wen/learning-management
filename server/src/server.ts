import dotenv from "dotenv";
import fastify from "fastify";

dotenv.config();

const server = fastify();

await server.register(import("@fastify/helmet"));
await server.register(import("@fastify/cors"), {
  origin: true,
});

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
