import { ApiStatus, ApiStatusConfig } from "@/services/check-status";

function StatusList() {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200"></ul>
    </div>
  );
}

function StatusBadge({ status }: { status: ApiStatus }) {
  switch (status) {
    case "ok":
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
        <p className="inline-flex rounded-md bg-green-100 text-lg font-semibold leading-5 text-green-800 px-4 py-2">
          Loading
        </p>
      );
    default:
      const _unknown: never = status;
      return _unknown;
  }
}

function Status({ name, status }: ApiStatusConfig) {
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
