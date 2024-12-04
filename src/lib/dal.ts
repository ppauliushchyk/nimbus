"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/session";

export const verifySessionAsync = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.id) {
    redirect("/");
  }

  return {
    authenticated: true,
    id: session.id,
  };
});

export const readAccountAsync = cache(async () => {
  const session = await verifySessionAsync();

  if (!session) {
    return null;
  }

  try {
    return prisma.account.findUniqueOrThrow({
      where: { id: session.id.toString() },
    });
  } catch {
    return null;
  }
});
