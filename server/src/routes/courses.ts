import { FastifyInstance, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { courses } from "./constants";
import { IdRequest } from "./resources";

const tags = ["courses"];

const Course = z.object({
  id: z.string(),
  teacherId: z.string(),
  teacherName: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  image: z.string().optional(),
  price: z.number().optional(), //cents usd
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["Draft", "Published"]),
});

const ListCourseRequest = z.object({
  category: z.string().optional(),
});

const listCoursesHandler = async (req: FastifyRequest) => {
  const { category } = req.query as z.infer<typeof ListCourseRequest>;
  if (!category) {
    return courses;
  }
  return courses.filter((course) => course.category === category);
};

const getCourseHandler = async (req: FastifyRequest) => {
  const { id } = req.params as z.infer<typeof IdRequest>;
  const course = courses.find((course) => course.id === id);

  if (!course) {
    throw createError(StatusCodes.NOT_FOUND, "Course not found.");
  }
  return course;
};

export const courseRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/courses/:id",
    {
      schema: { params: IdRequest, tags },
    },
    getCourseHandler
  );
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/courses",
    {
      schema: { querystring: ListCourseRequest, tags },
    },
    listCoursesHandler
  );
};
