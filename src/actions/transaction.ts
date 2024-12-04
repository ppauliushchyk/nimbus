"use server";

import { TransactionType } from "@prisma/client";
import { coerce, nativeEnum, z } from "zod";

import { readAccountAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";

export async function readTransactions(skip: number) {
  const { id } = await readAccountAsync();

  return prisma.transaction.findMany({
    orderBy: { updatedAt: "desc" },
    skip,
    take: 50,
    where: { accountId: id },
  });
}

const createSchema = z.object({
  amount: coerce.number(),
  type: nativeEnum(TransactionType),
});

type FormState =
  | { errors?: { amount?: string[]; type?: string[] }; message?: string }
  | undefined;

export async function createTransactionAsync(
  _state: FormState,
  payload: FormData,
) {
  const parsed = createSchema.safeParse({
    amount: payload.get("amount"),
    type: payload.get("type"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { id } = await readAccountAsync();

    const account = await prisma.account.findUniqueOrThrow({ where: { id } });

    await prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: parsed.data.amount.toString(),
        type: parsed.data.type,
      },
    });

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
