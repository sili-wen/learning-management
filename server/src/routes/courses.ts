import { FastifyInstance, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { courses } from "./constants";

const Course = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  price: z.number(),
  isPublished: z.boolean().default(false),
  category: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const IdRequest = z.object({ id: z.string().nonempty() });

const ListCourseRequest = z.object({
  category: z.string().optional(),
});

const listCourses = async (req: FastifyRequest) => {
  const { category } = req.query as z.infer<typeof ListCourseRequest>;
  if (!category) {
    return courses;
  }
  return courses.filter((course) => course.category === category);
};

const getCourse = async (req: FastifyRequest) => {
  const { id } = req.params as z.infer<typeof IdRequest>;
  const course = courses.filter((course) => course.id === id);

  if (!course) {
    throw createError(StatusCodes.NOT_FOUND, "Course not found");
  }
  return course;
};

export const courseRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/course/:id",
    {
      schema: { params: IdRequest },
    },
    getCourse
  );
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/course",
    {
      schema: { querystring: ListCourseRequest },
    },
    listCourses
  );
};
