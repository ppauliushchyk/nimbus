"use server";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch {
    return null;
  }
}

export async function createSession(id: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt({
    expiresAt: expires,
    id,
  });

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
