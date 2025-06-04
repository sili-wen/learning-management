import dotenv from "dotenv";
import fastify from "fastify";

dotenv.config();

const app = fastify();

await app.register(import("@fastify/helmet"));
await app.register(import("@fastify/cors"), {
  origin: true,
});

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
