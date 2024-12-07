"use client";

import React, { useActionState } from "react";

import { logoutAsync } from "@/actions/account";

import { SubmitButton } from "./ui/SubmitButton";

export default function LogoutForm() {
  const [, formAction] = useActionState(logoutAsync, undefined);

  return (
    <form action={formAction}>
      <SubmitButton className="btn-light">Logout</SubmitButton>
    </form>
  );
}
