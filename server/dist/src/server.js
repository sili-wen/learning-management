import dotenv from "dotenv";
import Fastify from "fastify";
import logger from "./logger";
import requestId from "./requestId";
dotenv.config();
const startServer = async (port) => {
    const app = Fastify({ logger: logger, genReqId: requestId });
    await app.register(import("@fastify/helmet"));
    await app.register(import("@fastify/cors"), {
        origin: true,
    });
    app.get("/", async (request, reply) => {
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
