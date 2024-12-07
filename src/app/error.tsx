"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container">
      <div className="row py-4 justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <h1>Something went wrong!</h1>

          <p className="text-body-secondary mb-4">
            The page you`&apos;re looking for might be broken.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => reset()}
            type="button"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
