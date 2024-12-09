"use server";

import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { string, z } from "zod";

import { verifySessionAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { createWithdrawalAsync } from "@/services/transaction";

const transactionSchema = z.object({ amount: string().regex(/^\d+(\.\d+)?$/) });

type FormState =
  | { errors?: { amount?: string[] }; message?: string }
  | undefined;

export async function depositAsync(_state: FormState, payload: FormData) {
  const parsed = transactionSchema.safeParse({ amount: payload.get("amount") });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const session = await verifySessionAsync();

    if (!session) {
      return {
        error: "No account found",
        success: false,
      };
    }

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: session.id.toString() },
    });

    await prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: parsed.data.amount,
        type: TransactionType.UserMoneyIn,
      },
    });

    revalidatePath("/dashboard", "page");

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

export async function withdrawAsync(_state: FormState, payload: FormData) {
  const parsed = transactionSchema.safeParse({ amount: payload.get("amount") });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const session = await verifySessionAsync();

    if (!session) {
      return {
        error: "No account found",
        success: false,
      };
    }

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: session.id.toString() },
    });

    const result = await createWithdrawalAsync({
      accountId: account.id,
      amount: parsed.data.amount,
    });

    if (!result) {
      return {
        error:
          "Your current balance is insufficient to complete this transaction.",
        success: false,
      };
    }

    revalidatePath("/dashboard", "page");

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
