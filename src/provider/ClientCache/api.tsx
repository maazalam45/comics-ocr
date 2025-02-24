import service from "@/services";
import { ClinetCache } from "./types";
import { ENDPOINTS } from "../constant/endpoints";

export async function Create(
  payload: ClinetCache.CreateAPIPayload,
): Promise<ClinetCache.CreateResponse> {
  return service({
    url: ENDPOINTS.CACHE,
    method: "POST",
    body: payload.data,
  });
}

export async function listing(
  props?: ClinetCache.ListingAPIPayload,
): Promise<ClinetCache.ListingResponse> {
  return service({
    method: "GET",
    url: ENDPOINTS.CACHE,
    queryParams: { key: props?.key },
  });
}
export async function DeleteCache(
  props?: ClinetCache.DeleteCacheProps,
): Promise<ClinetCache.ListingResponse> {
  return service({
    method: "DELETE",
    url: ENDPOINTS.CACHE + "/" + props?.id,
  });
}
