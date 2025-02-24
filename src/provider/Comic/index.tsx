import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, STORAGE_KEYS } from "@/others/constants";
import { useRouter } from "next/navigation";
import { listing } from "./api";
import { Comic } from "./types";

const KEY = "COMIC";
export function getKeyFromProps(props: any, type: "LISTING"): string[] {
  const key = [KEY, type];
  key.push(props);
  return key;
}

const useComicDetails = (props: any) => {
  const getComic = useQuery<Comic.CreateAPIMutationPayload>({
    queryKey: [STORAGE_KEYS.USER, getKeyFromProps(props, "LISTING")],
    queryFn: (e: any) => listing(e),
    enabled: true,
    retry: false,
  });
  // const { mutate: logout, isPending } = useMutation({
  //   mutationFn: () => logoutAction(),
  //   onSuccess: () => {
  //     queryClient.clear();
  //     replace("/");
  //   },
  // });

  // const isLoading = isUserLoading || isPending;

  return getComic;
};

export default useComicDetails;
