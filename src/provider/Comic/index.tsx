import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, STORAGE_KEYS } from "@/others/constants";
import { useRouter } from "next/navigation";
import {
  createComic,
  deleteComic,
  downloadCsv,
  listing,
  processComic,
  uploadComic,
} from "./api";
import { Comic } from "./types";

const KEY = "COMIC";
export function getKeyFromProps(
  props: any,
  type: "LISTING" | "GETCSV"
): string[] {
  const key = [KEY, type];
  key.push(props);
  return key;
}

export const useComicDetails = (props: any) => {
  return useQuery<Comic.ListingResponse>({
    queryKey: [STORAGE_KEYS.USER, getKeyFromProps(props, "LISTING")],
    queryFn: () => listing(props),
    retry: false,
  });
};
export const useSampleCsv = (props: any) => {
  return useMutation({
    mutationFn: (payload: any) => downloadCsv(payload),
  });
};
export const useCreateComic = (props: any) => {
  return useMutation({
    mutationFn: (payload: any) => createComic(payload),
    onSettled: () => {
      queryClient.invalidateQueries([STORAGE_KEYS.USER, KEY] as any);
    },
  });
};
export const useProcessComic = (props: any) => {
  return useMutation({
    mutationFn: (payload: any) => processComic(payload),
  });
};
export const useUploadComic = (props: any) => {
  return useMutation({
    mutationFn: (payload: any) => uploadComic(payload),
  });
};
export const useDeleteComic = (props: any) => {
  return useMutation({
    mutationFn: (payload: any) => deleteComic(payload),
    onSettled: () => {
      queryClient.invalidateQueries([STORAGE_KEYS.USER, KEY] as any);
    },
  });
};
