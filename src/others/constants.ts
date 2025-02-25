"use client";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const STORAGE_KEYS = {
  USER: "user",
  RECIPIENTS: "recipients",
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      onError: (error) => {
        toast.error(error.message);
      },
    },
  },
});

export const statusColors: any = {
  Ready_to_upload: "success",
  Ready_to_process: "info",
  Processing: "warning",
  Processed: "primary",
  Failed: "error",
};
