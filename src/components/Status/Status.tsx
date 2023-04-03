
import { ApiConfig, apiConfig } from "@/config/endpointSchema";

import {
  checkEndpoint,
} from "@/services/check-status";
import { useQuery } from "@tanstack/react-query";

function StatusList() {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {apiConfig.map((apiConfig) => (
          <Status key={apiConfig.name} {...apiConfig} />
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ status }: { status: "success" | "error" | "loading" }) {
  switch (status) {
    case "success":
      return (
        <p className="inline-flex rounded-md bg-green-100 text-lg font-semibold leading-5 text-green-800 px-4 py-2">
          OK
        </p>
      );
    case "error":
      return (
        <p className="inline-flex rounded-md bg-red-100 text-lg font-semibold leading-5 text-red-800 px-4 py-2">
          Failing
        </p>
      );
    case "loading":
      return (
        <p className="inline-flex rounded-md bg-indigo-100 text-lg font-semibold leading-5 text-indigo-800 px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 mr-2 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Loading
        </p>
      );
    default:
      const _unknown: never = status;
      return _unknown;
  }
}

function Status({ name, url, path }: ApiConfig) {
  const { status } = useQuery({
    queryFn: () => checkEndpoint({ name, url, path }),
    queryKey: [name],
  });
  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="truncate text-lg font-medium text-indigo-600">{name}</p>
          <div className="ml-2 flex flex-shrink-0">
            <StatusBadge status={status}></StatusBadge>
          </div>
        </div>
      </div>
    </li>
  );
}

export { StatusList, Status };
