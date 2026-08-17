import { describe, it, expect } from "vitest";
import { TenantContext } from "../src/server/auth/tenant-context";

describe("TenantContext Multi-Tenant Isolation Tests", () => {
  it("should throw a security error if organizationId is missing or empty", () => {
    expect(() => {
      new TenantContext({
        userId: "usr_1",
        organizationId: "",
        email: "test@example.com",
        name: "Test User",
        role: "PROPERTY_MANAGER",
        isAuthenticated: true,
      });
    }).toThrow("SECURITY_VIOLATION: Organization ID context is missing.");
  });

  it("should successfully construct valid tenant context for authorized org", () => {
    const ctx = new TenantContext({
      userId: "usr_1",
      organizationId: "org_nyumba_demo",
      email: "test@example.com",
      name: "Test User",
      role: "PROPERTY_MANAGER",
      isAuthenticated: true,
    });
    expect(ctx.organizationId).toBe("org_nyumba_demo");
  });
});
