import { FastifyRequest } from "fastify";

const listCourses = async (req: FastifyRequest) => {
  const { category } = req.query;
};
