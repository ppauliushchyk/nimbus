"use client";

import { useRouter } from "next/navigation";
import React, { useActionState, useCallback, useEffect } from "react";
import { useSWRConfig } from "swr";

import { withdrawAsync } from "@/actions/transaction";

import Input from "./ui/Input";
import SubmitButton from "./ui/SubmitButton";

export default function WithdrawForm() {
  const { mutate } = useSWRConfig();

  const router = useRouter();
  const [state, formAction] = useActionState(withdrawAsync, undefined);

  useEffect(() => {
    if (state?.success) {
      router.back();
      mutate("/api/balance");
    }
  }, [mutate, router, state?.success]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <form action={formAction}>
      <h2 className="fw-bold mb-4">Withdraw funds</h2>

      <Input
        className="mb-3"
        errors={state?.errors?.amount}
        label="Amount"
        name="amount"
      />

      {state?.error && (
        <div className="alert alert-danger mb-4 text-break" role="alert">
          {state.error}
        </div>
      )}

      <div className="d-flex gap-3">
        <SubmitButton className="btn-primary btn-lg w-100 rounded-3">
          Withdraw
        </SubmitButton>

        <button
          className="btn btn-secondary btn-lg w-100 rounded-3"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
