import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import Head from "next/head";

import { Status } from "@/components/Status/Status";
import { Header } from "@/components/Header/Header";
import { ApiStatusConfig, checkAllApiStatus } from "@/services/check-status";

function updateStatus(
  checkStatusResponse: PromiseSettledResult<ApiStatusConfig>[]
): ApiStatusConfig[] {
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
          <Head>
            <title>API Status</title>
          </Head>
          <div className="min-h-screen flex-col flex">
            <Header />
            <main className="bg-gray-200 flex-1">
              <div className="container mx-auto mt-16">
                <ol className="p-4 rounded-lg bg-white">
                  {updatedStatus.map((apiStatus) => (
                    <Status key={apiStatus.name} name={apiStatus.name} status={apiStatus.status}/>
                  ))}
                </ol>
              </div>
            </main>
          </div>
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
