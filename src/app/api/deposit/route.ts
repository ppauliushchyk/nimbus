import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
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

    const transaction = await prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: parsed.amount,
        type: TransactionType.UserMoneyIn,
      },
    });

    revalidatePath("/dashboard", "page");

    return Response.json(
      {
        data: { transaction },
        success: true,
      },
      { status: 200 }
    );
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }
}
