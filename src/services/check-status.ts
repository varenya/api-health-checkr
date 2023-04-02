import { ApiConfig, endpointConfigSchema } from "@/config/endpointSchema";
import endpointConfig from "@/config/endpoints.yaml";

type ApiStatus = "loading" | "ok" | "error";
type ApiStatusConfig = { name: string; status: ApiStatus };

const endpoints = endpointConfigSchema.parse(endpointConfig);

async function checkEndpoint({
  url,
  path,
  name,
}: ApiConfig): Promise<ApiStatusConfig> {
  try {
    const apiUrl = `${url}${path}`;
    const res = await fetch(apiUrl);
    return res.ok ? { name, status: "ok" } : { name, status: "error" };
  } catch (e) {
    console.error(e);
    return { name, status: "error" };
  }
}

async function checkAllApiStatus() {
  return Promise.allSettled(
    endpoints.api.map((apiConfig) => checkEndpoint(apiConfig))
  );
}

export { checkEndpoint, checkAllApiStatus };

export type { ApiStatus, ApiStatusConfig };
