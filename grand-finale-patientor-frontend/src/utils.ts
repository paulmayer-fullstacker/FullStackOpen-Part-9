import axios from "axios";
import { z } from "zod";

export const parseErrorMessage = (e: unknown): string => {
  // Handle Frontend Zod Validation Errors.
  // These happen BEFORE the request is sent, during EntryWithoutIdSchema.parse(values)
  if (e instanceof z.ZodError) {
    return e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" | ");
  }

  // Handle Axios/Backend Errors. When the backend sends an error, Axios "catches" it. Thus, we check axios.isAxiosError(e)
  if (axios.isAxiosError(e)) {
    // If returned error is an axios error, generated from a failed request.
    const errorData = e.response?.data?.error;
    // Get the error information from the response (axios package).

    if (Array.isArray(errorData)) {
      // If Zod has returned an issue array
      return errorData
        .map((issue: z.ZodIssue) => {
          // Map through the z.ZodIssue array
          const path = issue.path?.join(".") || "Field";
          // path represents where the error occured (e.g.: description field), message describes what the error is (e.g.: field missing).
          return `${path}: ${issue.message}`;
        })
        .join(" | ");
    }

    // Handle case where backend sends a simple string instead of a Zod array
    return typeof errorData === "string" ? errorData : e.message;
  }

  // Handle general JavaScript Errors
  if (e instanceof Error) {
    return e.message;
  }

  return "An unexpected error occurred";
};
