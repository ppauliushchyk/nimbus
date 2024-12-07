"use client";

import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";

import { registerAsync } from "@/actions/account";

import SubmitButton from "./ui/SubmitButton";

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
      {state?.error && (
        <div className="alert alert-danger mb-4 text-break" role="alert">
          {state.error}
        </div>
      )}

      <SubmitButton className="btn-secondary btn-lg w-100 rounded-3">
        Register
      </SubmitButton>
    </form>
  );
}
