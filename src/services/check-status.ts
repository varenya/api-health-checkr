import { ApiConfig, endpointConfigSchema } from "@/config/endpointSchema";
import endpointConfig from "@/config/endpoints.yaml";

type ApiStatus = "loading" | "ok" | "error";
type ApiStatusConfig = { name: string; status: ApiStatus };

const endpoints = endpointConfigSchema.parse(endpointConfig);

async function checkEndpoint({ url, path, name }: ApiConfig) {
  const apiUrl = `${url}${path}`;
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error("Network Failue");
  }
  const apiResponse = await res.json()
  return apiResponse
}

async function checkAllApiStatus() {
  return Promise.allSettled(
    endpoints.api.map((apiConfig) => checkEndpoint(apiConfig))
  );
}

export { checkEndpoint, checkAllApiStatus };

export type { ApiStatus, ApiStatusConfig };
