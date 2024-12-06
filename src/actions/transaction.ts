"use server";

import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { string, z } from "zod";

import { verifySessionAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";

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

    const result = (await prisma.transaction.aggregateRaw({
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
                  then: { $toDecimal: "$amount" },
                },
              },
            },
            withdrawals: {
              $sum: {
                $cond: {
                  else: 0,
                  if: { $eq: ["$type", TransactionType.UserMoneyOut] },
                  then: { $toDecimal: "$amount" },
                },
              },
            },
          },
        },
        {
          $project: {
            insufficient: {
              $gt: [
                { $toDecimal: parsed.data.amount },
                { $subtract: ["$deposits", "$withdrawals"] },
              ],
            },
          },
        },
      ],
    })) as unknown as [{ insufficient: boolean }];

    const insufficient = result[0]?.insufficient ?? true;

    if (insufficient) {
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
