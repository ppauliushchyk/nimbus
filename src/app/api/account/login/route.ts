import { string, z } from "zod";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

const loginSchema = z.object({ id: string().min(24) });

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = await loginSchema.parseAsync(data);

    const account = await prisma.account.findUniqueOrThrow({
      where: { id: parsed.id },
    });

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
