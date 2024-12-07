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
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }
}
