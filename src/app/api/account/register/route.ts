import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export async function POST() {
  try {
    const account = await prisma.account.create({ data: {} });

    await createSession(account.id);

    return Response.json({
      data: { account },
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
