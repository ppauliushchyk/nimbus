"use server";

import { redirect } from "next/navigation";
import { string, z } from "zod";

import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

const loginSchema = z.object({
  id: string().min(24),
});

type FormState = { errors?: { id?: string[] }; message?: string } | undefined;

export async function loginAsync(_state: FormState, payload: FormData) {
  const parsed = loginSchema.safeParse({ id: payload.get("id") });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const account = await prisma.account.findFirstOrThrow({
      where: { id: parsed.data.id },
    });

    await createSession(account.id);

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
        success: false,
      };
    }

    return { success: false };
  }
}

export async function logoutAsync() {
  await deleteSession();
  redirect("/");
}

export async function registerAsync() {
  try {
    const account = await prisma.account.create({});

    await createSession(account.id);

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
        success: false,
      };
    }

    return { success: false };
  }
}
