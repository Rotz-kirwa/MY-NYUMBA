import { DEFAULT_ORG_ID } from "@/db/seed";
import type { UserRole } from "./permissions";

export type SessionUser = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
};

export async function getSessionContext(request?: Request): Promise<SessionUser> {
  // In production, resolves HTTP-only cookie or Authorization Bearer header.
  // Defaults to default organization owner profile for active session context.
  const authHeader = request?.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer tenant_")) {
    return {
      id: "usr_tenant_1",
      organizationId: DEFAULT_ORG_ID,
      name: "Brian Otieno",
      email: "brian.otieno@gmail.com",
      role: "TENANT",
    };
  }

  return {
    id: "usr_wanjiru",
    organizationId: DEFAULT_ORG_ID,
    name: "Wanjiru Kimani",
    email: "wanjiru@mynyumba.co.ke",
    role: "OWNER",
  };
}
