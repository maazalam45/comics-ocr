import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import * as api from "./api";
import { ClinetCache } from "./types";

const KEY = "CACHE";

export function getKeyFromProps(props: any, type: "LISTING"): string[] {
  const key = [KEY, type];
  key.push(props);
  return key;
}

export function useCreateClientCache(
  props: ClinetCache.CreatePorps = {},
): UseMutationResult<
  ClinetCache.CreateResponse,
  {
    message?: string;
  },
  ClinetCache.CreateAPIMutationPayload
> {
  return useMutation((payload) => api.Create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}
export function useDeleteClientCache(
  props: ClinetCache.DeleteCacheProps = {},
): UseMutationResult<
  ClinetCache.DeleteResponse,
  {
    message?: string;
  },
  ClinetCache.DeleteAPIMutationPayload
> {
  const queryClient = useQueryClient();
  return useMutation((payload) => api.DeleteCache({ id: payload?.id }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries(["CACHE"]);
    },
  });
}

export function useClientCache(
  props?: ClinetCache.ListingProps,
): UseQueryResult<ClinetCache.ListingResponse> {
  return useQuery(getKeyFromProps(props, "LISTING"), () => api.listing(props), {
    refetchOnMount: "always",
    enabled: !!props,
  });
}
