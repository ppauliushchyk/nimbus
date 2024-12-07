"use client";

import React from "react";
import useSWR from "swr";

// @ts-expect-error dynamic arguments
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Balance() {
  const { data, isLoading, error } = useSWR("/api/balance", fetcher, {
    refreshInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="d-inline-flex align-items-center">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <span className="text-danger">Something went wrong</span>;
  }

  return (
    <span data-cy="balance">
      {new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(data.data.balance)}
    </span>
  );
}
