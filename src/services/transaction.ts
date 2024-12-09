import { TransactionType } from "@prisma/client";
import { MongoClient, ObjectId } from "mongodb";

export async function createWithdrawalAsync(params: {
  accountId: string;
  amount: string;
}) {
  const client = new MongoClient(process.env.DATABASE_CLIENT_URL!);

  await client.connect();

  const db = client.db(process.env.DATABASE_CLIENT_DATABASE!);

  const session = client.startSession();

  let response;

  try {
    response = await session.withTransaction(
      async () => {
        await db
          .collection("Account")
          .updateOne(
            { _id: new ObjectId(params.accountId) },
            { $inc: { v: 1 } },
            { session },
          );

        const result = await db
          .collection("Transaction")
          .aggregate(
            [
              {
                $match: {
                  $expr: {
                    $eq: ["$accountId", { $toObjectId: params.accountId }],
                  },
                },
              },
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
                      { $toDecimal: params.amount },
                      { $subtract: ["$deposits", "$withdrawals"] },
                    ],
                  },
                },
              },
            ],
            { session },
          )
          .toArray();

        const insufficient = result[0]?.insufficient ?? true;

        if (insufficient) {
          return null;
        }

        const now = new Date();

        return db.collection("Transaction").insertOne(
          {
            accountId: new ObjectId(params.accountId),
            amount: params.amount,
            createdAt: now,
            type: TransactionType.UserMoneyOut,
            updatedAt: now,
          },
          { session },
        );
      },
      {
        readConcern: { level: "local" },
        readPreference: "primary",
        writeConcern: { w: "majority" },
      },
    );
  } finally {
    await session.endSession();
    await client.close();
  }

  return response;
}
