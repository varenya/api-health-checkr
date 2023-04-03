import { QueryClient, dehydrate, } from "@tanstack/react-query";
import Head from "next/head";

import {  StatusList } from "@/components/Status/Status";
import { Header } from "@/components/Header/Header";
import {   checkEndpoint } from "@/services/check-status";
import { apiConfig } from "@/config/endpointSchema";


export default function Home() {
  return (
    <>
      <Head>
        <title>API Status</title>
      </Head>
      <div className="min-h-screen flex-col flex">
        <Header />
        <main className="bg-gray-200 flex-1">
          <div className="container mx-auto mt-16">
            <StatusList />
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  for (const { name , url, path} of apiConfig) {
    await queryClient.prefetchQuery({
      queryKey: [name],
      queryFn: () => checkEndpoint({ url, path, name}),
    });
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
