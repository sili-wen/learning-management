import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    },
  })(args, api, extraOptions);

  // if (result.error) {
  //   const errorMessage =
  //     (result.error as any)?.data?.message ||
  //     `Request failed: ${result.error.status || "Unknown error"}`;

  //   toast.error(errorMessage);
  // }

  const isMutationRequest =
    (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

  if (
    isMutationRequest &&
    !args.url?.includes("payment-intents") &&
    !args.url?.includes("transactions")
  ) {
    toast.success("Settings updated successfully!");
  }
  return result;
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users", "Transactions"],
  endpoints: (build) => ({
    updateUser: build.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...updatedUser }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Courses", id }],
    }),

    createPaymentIntent: build.mutation<
      { clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: "payment-intents",
        method: "POST",
        body: { amount },
      }),
    }),

    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),

    getTransactions: build.query<Transaction[], string>({
      query: (userId) => ({
        url: "transactions",
        params: { userId },
      }),
      transformResponse: (response: { transactions: Transaction[] }) =>
        response.transactions,
      providesTags: ["Transactions"],
    }),

    updateCourse: build.mutation<Course, Partial<Course> & { id: string }>({
      query: ({ id, ...updatedCourse }) => ({
        url: `courses/${id}`,
        method: "PUT",
        body: updatedCourse,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Add placeholder for upload video URL
    getUploadVideoUrl: build.mutation<
      { uploadUrl: string },
      { fileName: string }
    >({
      query: ({ fileName }) => ({
        url: "upload/video-url",
        method: "POST",
        body: { fileName },
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreatePaymentIntentMutation,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useUpdateCourseMutation,
  useGetUploadVideoUrlMutation,
} = api;
