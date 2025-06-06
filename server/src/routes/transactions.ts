import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { courses } from "./constants";
import { ulid } from "zod/v4";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const tags = ["transactions"];
const CreateTransactionRequest = z.object({
  userId: z.string().nonempty(),
  courseId: z.string().nonempty(),
  transactionId: z.string().nonempty(),
  amount: z.number().nonnegative(),
  paymentProvider: z.string().nonempty(),
});

const createTransactionHandler = async (req: FastifyRequest) => {
  const { userId, courseId, transactionId, amount, paymentProvider } =
    req.body as z.infer<typeof CreateTransactionRequest>;

  const course = courses.find((course) => {
    course.id === courseId;
  });

  // TODO: add transaction in DB
  // TODO: add course progress
  // TODO: add course enrollment

  return {
    transactionId: `txn_${ulid()}`,
  };
};

export const transactionsRoutes = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/transactions",
    {
      schema: { body: CreateTransactionRequest, tags },
    },
    createTransactionHandler
  );
};
