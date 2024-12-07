import { TransactionType } from "@prisma/client";

import { verifySessionAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await verifySessionAsync();

    if (!session) {
      return Response.json({ success: false }, { status: 401 });
    }

    const result = (await prisma.transaction.aggregateRaw({
      pipeline: [
        { $match: { accountId: { $oid: session.id } } },
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
            balance: {
              $toString: { $subtract: ["$deposits", "$withdrawals"] },
            },
          },
        },
      ],
    })) as unknown as [{ balance: string }];

    const balance = result[0]?.balance ?? "0";

    return Response.json({
      data: { balance },
      success: true,
    });
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
