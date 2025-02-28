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
  Processed: "success",
  Failed: "error",
};

export enum ComicStatus {
  Ready_to_upload = "Ready_to_upload",
  Ready_to_process = "Ready_to_process",
  Processing = "Processing",
  Processed = "Processed",
}

export const ComicCardButtonText = (_comicStatus: ComicStatus) => {
  if (_comicStatus == ComicStatus.Ready_to_process){
    return "Process Comic"
  } else if (_comicStatus == ComicStatus.Processing){
    return "View Process"
  } else if (_comicStatus == ComicStatus.Processed){
    return "Download Comic"
  } else {
    return "Upload Comic"
  }
}