import { TransactionType } from "@prisma/client";
import { string, z } from "zod";

import { verifySessionAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";

const transactionSchema = z.object({ amount: string().regex(/^\d+(\.\d+)?$/) });

export async function POST(request: Request) {
  try {
    const session = await verifySessionAsync();

    if (!session) {
      return Response.json({ success: false }, { status: 401 });
    }

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: session.id.toString() },
    });

    const data = await request.json();
    const parsed = await transactionSchema.parseAsync(data);

    const transaction = await prisma.$transaction(async () => {
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
                  { $toDecimal: parsed.amount },
                  { $subtract: ["$deposits", "$withdrawals"] },
                ],
              },
            },
          },
        ],
      })) as unknown as [{ insufficient: boolean }];

      const insufficient = result[0]?.insufficient ?? true;

      if (insufficient) {
        return Response.json({ success: false }, { status: 402 });
      }

      return prisma.transaction.create({
        data: {
          accountId: account.id,
          amount: parsed.amount,
          type: TransactionType.UserMoneyOut,
        },
      });
    }, {});

    return Response.json(
      {
        data: { transaction },
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        {
          message: error.message,
          success: false,
        },
        { status: 400 },
      );
    }

    return Response.json({ success: false }, { status: 400 });
  }
}
