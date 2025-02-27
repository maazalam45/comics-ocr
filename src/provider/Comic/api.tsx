import service from "@/services";
import { Comic } from "./types";
import { ENDPOINTS } from "@/others/endpoints";

export async function listing(
  props?: Comic.ListingAPIPayload
): Promise<Comic.ListingResponse> {
  return service({
    method: "GET",
    url: ENDPOINTS.COMICS + (props?.id ? `/${props.id}` : ""),
  });
}
export async function downloadCsv(
  props?: Comic.ListingAPIPayload
): Promise<Comic.ListingResponse> {
  return service({
    parseJSON: false,
    method: "GET",
    url: ENDPOINTS.EXAMPLE_DICTIONARY,
  });
}
export async function createComic(
  payload: Comic.CreateAPIMutationPayload
): Promise<Comic.CreateResponse> {
  return service({
    formData: true,
    url: ENDPOINTS.COMICS,
    method: "POST",
    body: payload.data,
  });
}
export async function deleteComic(
  payload: Comic.CreateAPIMutationPayload
): Promise<Comic.CreateResponse> {
  return service({
    parseJSON: false,
    url: ENDPOINTS.COMIC_DELETE+ `/${payload.data.id}`,
    method: "DELETE",
  });
}
export async function processComic(
  payload: Comic.CreateAPIMutationPayload
): Promise<Comic.CreateResponse> {
  return service({
    // formData: true,
    url: ENDPOINTS.PROCESS_COMIC + `/${payload.data.id}`,
    method: "POST",
    body: payload.data,
  });
}

export async function uploadComic(
  payload: Comic.CreateAPIMutationPayload
): Promise<Comic.CreateResponse> {
  return service({
    formData: true,
    url: ENDPOINTS.UPLOAD_MEDIA + `/${payload.data.id}`,
    method: "POST",
    body: payload.data,
  });
}
