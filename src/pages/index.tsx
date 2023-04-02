import Head from "next/head";
import Image from "next/image";
import { QueryClient, dehydrate, useQueries } from "@tanstack/react-query";
import { Inter } from "next/font/google";

import { Logo } from "@/components/Logo";
import { z } from "zod";

import endpointConfig from "@/config/endpoints.yaml";
import { endpointConfigSchema } from "@/config/endpointSchema";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const endpoints = endpointConfigSchema.parse(endpointConfig);

type ApiConfig = z.infer<typeof endpointConfigSchema>;

async function checkEndpoint({ url, path, name }: ApiConfig["api"][0]) {
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

function initialState(): ApiStatus[] {
  return endpoints.api.map(({ url, path, name }) => ({
    name,
    status: "loading",
  }));
}

type PromiseStatus<T> =
  | { status: "fulfilled"; value: T }
  | { status: "rejected"; reason: string };

function updateStatus(checkStatusResponse: PromiseStatus<ApiStatusConfig>[]) {
  return checkStatusResponse.map((statusResponse) => {
    return statusResponse.status === "fulfilled"
      ? statusResponse.value
      : { status: "error", name: "api" };
  });
}

export default function Home() {
  const {
    data: currentApiStatus,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentApiStatus"],
    queryFn: () => checkAllApiStatus(),
  });
  if (isLoading) return <h1>Loading...</h1>;
  const updatedStatus = updateStatus(currentApiStatus)
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
