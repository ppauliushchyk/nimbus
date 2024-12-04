"use client";

import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";

import { createTransactionAsync } from "@/actions/transaction";

import Input from "./ui/Input";
import { SubmitButton } from "./ui/SubmitButton";

export default function CreateTransactionForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createTransactionAsync, undefined);

  useEffect(() => {
    if (state?.success) {
      // router.replace("/dashboard");
    }
  }, [router, state?.success]);

  return (
    <form action={formAction}>
      <h1 className="fw-bold mb-4">Create a transaction</h1>

      <Input
        className="mb-3"
        errors={state?.errors?.amount}
        label="Amount"
        name="amount"
      />

      <Input
        className="mb-4"
        errors={state?.errors?.type}
        label="Type"
        name="type"
      />

      {state?.error && (
        <div className="alert alert-danger mb-4 text-break" role="alert">
          {state.error}
        </div>
      )}

      <SubmitButton className="btn-primary btn-lg w-100 rounded-3">
        Create
      </SubmitButton>
    </form>
  );
}
