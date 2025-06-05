import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Clerk } from "@clerk/clerk-js";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    },
  }),
  reducerPath: "api",
  tagTypes: ["Courses", "Users"],
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
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
  }),
});

export const { useUpdateUserMutation, useGetCoursesQuery, useGetCourseQuery } =
  api;
