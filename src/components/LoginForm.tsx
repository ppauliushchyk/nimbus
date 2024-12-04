"use client";

import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";

import { loginAsync } from "@/actions/account";

import Input from "./ui/Input";
import { SubmitButton } from "./ui/SubmitButton";

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAsync, undefined);

  useEffect(() => {
    if (state?.success) {
      router.replace("/dashboard");
    }
  }, [router, state?.success]);

  return (
    <form action={formAction}>
      <h1 className="fw-bold mb-4">Login</h1>

      <Input
        className="mb-4"
        errors={state?.errors?.id}
        label="Account ID"
        name="id"
      />

      {state?.error && (
        <div className="alert alert-danger mb-4 text-break" role="alert">
          {state.error}
        </div>
      )}

      <SubmitButton className="btn-primary btn-lg w-100 rounded-3">
        Login
      </SubmitButton>
    </form>
  );
}
