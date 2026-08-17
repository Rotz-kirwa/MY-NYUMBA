import type { UserRole } from "@/server/permissions";
import { createServerFn } from "@tanstack/react-start";

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
  try {
    const json = JSON.stringify(user);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(json).toString("base64");
    }
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    return "";
  }
}

export function decodeSessionToken(token: string): SessionUser | null {
  if (!token) return null;
  try {
    let str = "";
    const cleanToken = decodeURIComponent(token).trim();
    if (typeof Buffer !== "undefined") {
      str = Buffer.from(cleanToken, "base64").toString("utf-8");
    } else {
      str = decodeURIComponent(escape(atob(cleanToken)));
    }
    return JSON.parse(str);
  } catch (e) {
    try {
      const fallbackStr = atob(decodeURIComponent(token));
      return JSON.parse(fallbackStr);
    } catch (err) {
      return null;
    }
  }
}

export const checkAuthServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionContextServer } = await import("./auth.server");
  return await getSessionContextServer();
});

export async function getSessionContext(request?: Request): Promise<SessionUser | null> {
  let cookieHeader = request?.headers?.get("cookie");

  if (!cookieHeader && typeof document !== "undefined") {
    cookieHeader = document.cookie;
  }

  let sessionToken: string | null = null;

  if (cookieHeader) {
    const cookies = parseCookieHeader(cookieHeader);
    sessionToken = cookies["mn_session"] || null;
  }

  if (!sessionToken && typeof window !== "undefined") {
    try {
      sessionToken = localStorage.getItem("mn_session");
    } catch (e) {}
  }

  if (sessionToken) {
    const decoded = decodeSessionToken(sessionToken);
    if (decoded && decoded.email && decoded.role) {
      return decoded;
    }
  }

  try {
    return await checkAuthServerFn();
  } catch (e) {
    return null;
  }

}

export const authenticateUserServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; roleId?: string }) => data)
  .handler(async ({ data }) => {
    const { email, roleId } = data;
    const { DEFAULT_ORG_ID } = await import("@/db/seed");
    
    let userRole: UserRole = "OWNER";
    let name = "Property Admin";
    let userId = "usr_admin";

    if (roleId === "manager") {
      userRole = "PROPERTY_MANAGER";
      name = "Property Manager";
      userId = "usr_manager";
    } else if (roleId === "accountant") {
      userRole = "ACCOUNTANT";
      name = "Financial Accountant";
      userId = "usr_accounts";
    } else if (roleId === "tenant") {
      userRole = "TENANT";
      name = "Tenant Account";
      userId = "usr_tenant";
    }

    try {
      const { db } = await import("@/db");
      const { users } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      if (db) {
        const dbUsers = await db.select().from(users).where(eq(users.email, email));
        if (dbUsers.length > 0) {
          userId = dbUsers[0].id;
          name = dbUsers[0].name;
          userRole = dbUsers[0].role as UserRole;
        }
      }
    } catch (e) {}

    const sessionUser: SessionUser = {
      id: userId,
      organizationId: DEFAULT_ORG_ID,
      name,
      email,
      role: userRole,
    };

    const cookieValue = encodeSessionToken(sessionUser);
    return {
      success: true,
      user: sessionUser,
      cookieValue,
      cookieString: `mn_session=${cookieValue}; path=/; max-age=86400; SameSite=Lax`,
    };
  });
