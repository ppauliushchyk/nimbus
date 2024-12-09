import { string, z } from "zod";

import { verifySessionAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { createWithdrawalAsync } from "@/services/transaction";

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

    const result = await createWithdrawalAsync({
      accountId: account.id,
      amount: parsed.amount,
    });

    if (!result) {
      return Response.json({ success: false }, { status: 402 });
    }

    const transaction = await prisma.transaction.findUniqueOrThrow({
      where: { id: result.insertedId.toString() },
    });

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
