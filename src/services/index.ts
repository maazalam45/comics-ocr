import omit from "lodash/omit";
import qs from "query-string";
import { signOut } from "next-auth/react";
import { PUBLIC_API_URL } from "../../config";

const API_URL = PUBLIC_API_URL;

interface IDefaultHeadersProps {
  "Content-Type"?: string; // Content-Type is optional to allow FormData requests
  Authorization?: string;
  accept?: string;
}

const defaultHeaders: IDefaultHeadersProps = {
  accept: "application/json",
  "Content-Type": "application/json", // Default Content-Type for JSON requests
};

export function setAuthenticationHeader(token: string): void {
  localStorage.setItem("auth", "true");
  localStorage.setItem("token", `Token ${token}`);
  defaultHeaders.Authorization = `Token ${token}`;
}

export function getAuthenticationToken(): string | undefined {
  return defaultHeaders?.Authorization;
}

export function removeAuthenticationHeader(): void {
  delete defaultHeaders.Authorization;
}

interface IAPArgs {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: any;
  queryParams?: Record<string, any>;
  noAuth?: boolean;
  formData?: boolean;
  urlencoded?: boolean;
  baseDomain?: string;
  parseJSON?: boolean;
}

async function service(args: IAPArgs): Promise<any> {
  const {
    url,
    method = "GET",
    body = {},
    headers = {},
    queryParams = null,
    formData = false,
    urlencoded = false,
    baseDomain,
    parseJSON = true,
    ...extraProps
  } = args;
  if (!defaultHeaders?.Authorization) {
    defaultHeaders.Authorization = localStorage.getItem("token") as any;
  }
  const finalHeaders = { ...defaultHeaders, ...headers };

  let requestBody: any = null;

  // 🔹 Handle FormData requests
  if (formData) {
    requestBody = new FormData();
    Object.keys(body).forEach((key) => {
      requestBody.append(key, body[key]);
    });
    delete finalHeaders["Content-Type"]; // Let the browser set the correct Content-Type
  } else if (urlencoded) {
    requestBody = new URLSearchParams();
    Object.keys(body).forEach((key) => {
      requestBody.append(key, body[key]);
    });
    delete finalHeaders["Content-Type"]; // Let the browser set the correct Content-Type
  } else if (method !== "GET") {
    requestBody = JSON.stringify(body);
  }

  if (extraProps.noAuth) {
    delete finalHeaders.Authorization;
  }

  let fetchUrl = `${baseDomain || API_URL}${url}`;
  if (queryParams) {
    fetchUrl = `${fetchUrl}?${qs.stringify(queryParams, {
      arrayFormat: "bracket",
    })}`;
  }

  try {
    const response = await fetch(fetchUrl, {
      method,
      headers: finalHeaders,
      body: method !== "GET" ? requestBody : null,
      ...extraProps,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    // 🔹 Parse JSON response if applicable
    if (parseJSON) {
      return await response.json();
    }
    return response;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

export default service;
