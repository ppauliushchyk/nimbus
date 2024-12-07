"use server";

import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { coerce, z } from "zod";

import { readAccountAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";

export async function readBalanceAsync() {
  const account = await readAccountAsync();

  if (!account) {
    return 0;
  }

  const [{ balance }] = (await prisma.transaction.aggregateRaw({
    pipeline: [
      { $match: { accountId: { $oid: account.id } } },
      {
        $group: {
          _id: null,
          deposits: {
            $sum: {
              $cond: {
                else: 0,
                if: { $eq: ["$type", TransactionType.UserMoneyIn] },
                then: "$amount",
              },
            },
          },
          withdrawals: {
            $sum: {
              $cond: {
                else: 0,
                if: { $eq: ["$type", TransactionType.UserMoneyOut] },
                then: "$amount",
              },
            },
          },
        },
      },
      { $project: { balance: { $subtract: ["$deposits", "$withdrawals"] } } },
    ],
  })) as unknown as [{ balance: number }];

  return balance;
}

const transactionSchema = z.object({ amount: coerce.number().gt(0) });

type FormState =
  | { errors?: { amount?: string[] }; message?: string }
  | undefined;

export async function depositAsync(_state: FormState, payload: FormData) {
  const parsed = transactionSchema.safeParse({ amount: payload.get("amount") });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const rawAccount = await readAccountAsync();

    if (!rawAccount) {
      return {
        error: "No account found",
        success: false,
      };
    }

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: rawAccount.id },
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
    const rawAccount = await readAccountAsync();

    if (!rawAccount) {
      return {
        error: "No account found",
        success: false,
      };
    }

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: rawAccount.id },
    });

    const balance = await readBalanceAsync();

    if (parsed.data.amount > balance) {
      return {
        error:
          "Your current balance is insufficient to complete this transaction.",
        success: false,
      };
    }

    await prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: parsed.data.amount,
        type: TransactionType.UserMoneyOut,
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
