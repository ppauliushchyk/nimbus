"use client";

import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";

import { registerAsync } from "@/actions/account";

import { SubmitButton } from "./ui/SubmitButton";

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(registerAsync, undefined);

  useEffect(() => {
    if (state?.success) {
      router.replace("/dashboard");
    }
  }, [router, state?.success]);

  return (
    <form action={formAction}>
      <h2 className="fs-5 fw-bold mb-3">Or register a new account</h2>

      {state?.error && (
        <div className="alert alert-danger mb-4 text-break" role="alert">
          {state.error}
        </div>
      )}

      <SubmitButton className="btn-outline-secondary w-100 rounded-3">
        Register
      </SubmitButton>
    </form>
  );
}
