import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";

import { ApiStatusConfig, checkAllApiStatus, checkEndpoint } from "@/services/check-status";


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
