"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Trigger({ path, max }: { path: string; max: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !loading && pathname === path) {
      setLoading(true);

      const params = new URLSearchParams(searchParams);

      const raw = searchParams.get("limit");
      const current = parseInt(raw ?? "0", 10);
      const next = Math.min(current + 10, max);

      params.delete("limit");
      params.append("limit", next.toString());

      router.push(`?${params.toString()}`, { scroll: false });

      setLoading(false);
    }
  }, [inView, loading, max, path, pathname, router, searchParams]);

  return (
    <div>
      {loading && (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      <div ref={ref} />
    </div>
  );
}
