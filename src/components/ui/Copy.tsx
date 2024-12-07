"use client";

import { FaCopy } from "@react-icons/all-files/fa/FaCopy";
import classNames from "classnames";
import React, { HTMLAttributes, useCallback } from "react";

export default function Copy({
  className,
  children,
  value,
}: HTMLAttributes<HTMLButtonElement> & { value?: string }) {
  const handleClick = useCallback(() => {
    const text = value || children?.toString();

    if (text) {
      navigator.clipboard.writeText(text);
    }
  }, [children, value]);

  return (
    <button
      className={classNames(
        "d-inline-flex align-items-center gap-1 cursor-pointer border-0 bg-transparent p-0 focus-ring focus-ring-light",
        className,
      )}
      onClick={handleClick}
      style={{ color: "inherit" }}
      type="button"
    >
      <span className="text-truncate">{children}</span>

      <FaCopy className="flex-shrink-0" />
    </button>
  );
}

Copy.defaultProps = {
  value: undefined,
};
