import service from "@/services";
import { Comic } from "./types";
import { ENDPOINTS } from "@/others/endpoints";

export async function listing(
  props?: Comic.ListingAPIPayload
): Promise<Comic.ListingResponse> {
  return service({
    method: "GET",
    headers: { host: "44.204.193.108:8000" },
    url: ENDPOINTS.COMICS,
    queryParams: { key: props?.id },
  });
}
// export async function get(
//   payload: Cart.CreateAPIPayload,
// ): Promise<Cart.CreateResponse> {
//   return service({
//     url: ENDPOINTS.CART,
//     method: "POST",
//     body: payload.data,
//   });
// }

// export async function Delete(
//   payload: Cart.DeleteAPIPayload,
// ): Promise<Cart.DeleteResponse> {
//   return service({
//     url: `${ENDPOINTS.CART}/${payload.data.id}`,
//     method: "DELETE",
//   });
// }
