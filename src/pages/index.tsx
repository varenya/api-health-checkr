import { QueryClient, dehydrate } from "@tanstack/react-query";

import endpointConfig from "@/config/endpoints.yaml";

import { ApiConfig, endpointConfigSchema } from "@/config/endpointSchema";
import { useQuery } from "@tanstack/react-query";

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

type ApiStatus = "loading" | "ok" | "error";

type ApiStatusConfig = { name: string; status: ApiStatus };

function updateStatus(
  checkStatusResponse: PromiseSettledResult<ApiStatusConfig>[]
) {
  return checkStatusResponse.map((statusResponse) => {
    return statusResponse.status === "fulfilled"
      ? statusResponse.value
      : { status: "error", name: "api" };
  });
}

export default function Home() {
  const { data: currentApiStatus, status } = useQuery({
    queryKey: ["currentApiStatus"],
    queryFn: () => checkAllApiStatus(),
  });

  switch (status) {
    case "loading":
      return <h1>Loading...</h1>;
    case "success":
      const updatedStatus = updateStatus(currentApiStatus);
      return (
        <>
          <header className="w-full">
            <h1 className="text-3xl mx-auto w-1/2">Logo</h1>
          </header>
          <main>
            <ol className="p-4">
              {updatedStatus.map((apiStatus) => (
                <li key={apiStatus.name}>
                  {apiStatus.name} : {apiStatus.status}
                </li>
              ))}
            </ol>
          </main>
        </>
      );
    case "error":
      return <h1>Error loading..</h1>;
    default:
      const _unknown: never = status;
      return _unknown;
  }
}

async function checkAllApiStatus() {
  return Promise.allSettled(
    endpoints.api.map((apiConfig) => checkEndpoint(apiConfig))
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["currentApiStatus"],
    queryFn: () => checkAllApiStatus(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
