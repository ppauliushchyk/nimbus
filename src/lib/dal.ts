"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/session";

export const verifySession = cache(async () => {
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

export const readAccount = cache(async () => {
  try {
    const session = await verifySession();

    if (!session) {
      return null;
    }

    return prisma.account.findFirstOrThrow({ where: { id: session.id } });
  } catch {
    return null;
  }
});
