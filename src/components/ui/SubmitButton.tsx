import classNames from "classnames";
import React, { HTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className,
}: HTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button
      className={classNames("btn", className)}
      disabled={pending}
      type="submit"
    >
      {pending && (
        <div className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {children}
    </button>
  );
}
