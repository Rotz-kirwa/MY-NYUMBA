import { UserRole } from "@/server/permissions";

export interface TenantSession {
  userId: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export class TenantContext {
  public readonly userId: string;
  public readonly organizationId: string;
  public readonly email: string;
  public readonly name: string;
  public readonly role: UserRole;

  constructor(session: TenantSession) {
    if (!session.organizationId || session.organizationId.trim() === "") {
      throw new Error("SECURITY_VIOLATION: Organization ID context is missing.");
    }
    this.userId = session.userId;
    this.organizationId = session.organizationId;
    this.email = session.email;
    this.name = session.name;
    this.role = session.role;
  }
}
