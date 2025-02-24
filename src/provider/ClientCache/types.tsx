export namespace ClinetCache {
  //create
  export type CreatePorps = {};
  export type CreateResponse = {};
  export type DeleteResponse = {};
  export type CreateAPIMutationPayload = {
    key: string;
    data: { [X: string]: any };
    form_type: 1;
  };
  export type DeleteAPIMutationPayload = {
    id: string | null;
  };
  export interface CreateAPIPayload extends CreatePorps {
    data: CreateAPIMutationPayload;
  }

  //list
  export type ListingProps = {
    key?: string;
  };
  //list
  export type DeleteCacheProps = {
    id?: string | null;
  };
  export type ListingResponse = {};
  export interface ListingAPIPayload extends ListingProps {}
}
