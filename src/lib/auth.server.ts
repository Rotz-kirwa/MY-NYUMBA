import type { UserRole } from "@/server/permissions";
import { getRequest } from "@tanstack/react-start-server";


export type SessionUser = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
};

export function parseCookieHeader(cookieHeader?: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((acc: Record<string, string>, curr) => {
    const [key, ...v] = curr.trim().split("=");
    if (key) acc[key] = decodeURIComponent(v.join("="));
    return acc;
  }, {});
}

export function encodeSessionToken(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export function decodeSessionToken(token: string): SessionUser | null {
  try {
    const str = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

export async function getSessionContextServer(request?: Request): Promise<SessionUser | null> {
  let cookieHeader = request?.headers?.get("cookie");

  if (!cookieHeader && typeof window === "undefined") {
    try {
      const req = getRequest();
      cookieHeader = req?.headers?.get("cookie");
    } catch (e) {
      // Web request unavailable
    }
  }

  const cookies = parseCookieHeader(cookieHeader);
  const sessionToken = cookies["mn_session"];

  if (sessionToken) {
    const decoded = decodeSessionToken(sessionToken);
    if (decoded && decoded.email && decoded.role) {
      return decoded;
    }
  }

  const authHeader = request?.headers?.get("Authorization");
  if (authHeader?.startsWith("Bearer tenant_")) {
    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      if (db) {
        const tenantUsers = await db.select().from(users).where(eq(users.role, "TENANT"));
        if (tenantUsers.length > 0) {
          return {
            id: tenantUsers[0].id,
            organizationId: tenantUsers[0].organizationId,
            name: tenantUsers[0].name,
            email: tenantUsers[0].email,
            role: "TENANT",
          };
        }
      }
    } catch (e) {}
  }

  return null;
}
