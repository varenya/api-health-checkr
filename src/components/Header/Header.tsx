import React from "react";

function Header() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Check API status
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            One stop place to see all your API's status.
          </p>
        </div>
      </div>
    </div>
  );
}
export { Header };
