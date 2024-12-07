"use client";

import Script from "next/script";
import React, { useEffect } from "react";

import "@/styles/index.scss";

export default function GlobalError({
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </head>

      <body>
        <div className="container">
          <div className="row py-4 justify-content-center align-items-center vh-100">
            <div className="col-12 col-md-6 col-lg-4 mx-auto">
              <h1>Something went wrong!</h1>

              <p className="text-body-secondary mb-4">
                The page you're looking for might be broken.
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

        <Script src="/scripts/popper.min.js" />
        <Script src="/scripts/bootstrap.min.js" />
      </body>
    </html>
  );
}
