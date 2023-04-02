import { z } from "zod";

const apiConfig = z.object({
  url: z.string().url(),
  name: z.string(),
  path: z.array(z.string().startsWith("/")),
});

const endpointConfigSchema = z.object({
  api: z.array(apiConfig),
});

type ApiConfig = z.infer<typeof apiConfig>;

type EndpointConfig = z.infer<typeof endpointConfigSchema>;

export { endpointConfigSchema };

export type { ApiConfig, EndpointConfig };
