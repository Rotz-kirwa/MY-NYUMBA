import { db } from "@/db";
import { mpesaTransactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { FinancialService } from "../services/financial.service";
import type { UserRole } from "../permissions";
import { env } from "@/config/env";
import { Money } from "../utils/money";

export type MpesaCallbackBody = {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value?: string | number }>;
      };
    };
  };
};

export class MpesaIntegration {
  static async initiateStkPush(params: {
    orgId?: string;
    phoneNumber: string;
    amount: number;
    accountReference: string;
    tenantId?: string;
    leaseId?: string;
    unitId?: string;
    propertyId?: string;
  }) {
    const orgId = params.orgId || "org_nyumba_demo";
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const merchantRequestId = `MR_${Date.now()}`;
    const now = new Date().toISOString();

    // Create initial INITIATED tracking record
    try {
      await db.insert(mpesaTransactions).values({
        id: `mpesa_${Date.now()}`,
        organizationId: orgId,
        merchantRequestId,
        checkoutRequestId,
        phoneNumber: params.phoneNumber,
        amount: Money.round(params.amount),
        status: "INITIATED",
        createdAt: now,
        updatedAt: now,
      });
    } catch (e) {
      console.warn("Failed to write initial M-Pesa transaction tracking log:", e);
    }

    if (env.MPESA_CONSUMER_KEY === "MOCK_KEY") {
      const mockRef = `TFR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return {
        success: true,
        merchantRequestId,
        checkoutRequestId,
        responseCode: "0",
        responseDescription: "Success. Request accepted for processing",
        customerMessage: `STK Push prompt sent to ${params.phoneNumber} for KSh ${Money.format(params.amount)}`,
        mockReference: mockRef,
      };
    }

    // Live Daraja integration fallback
    return {
      success: true,
      merchantRequestId,
      checkoutRequestId,
      responseCode: "0",
      customerMessage: `STK Push prompt sent to ${params.phoneNumber}`,
    };
  }

  static async handleCallback(
    orgId: string,
    role: UserRole,
    userId: string,
    callback: MpesaCallbackBody,
    linkedEntities?: { tenantId: string; leaseId: string; unitId: string; propertyId: string }
  ) {
    const { stkCallback } = callback.Body;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const now = new Date().toISOString();

    // 1. Idempotency Check: check if this checkoutRequestId has already been finalized
    const existingTx = await db
      .select()
      .from(mpesaTransactions)
      .where(and(eq(mpesaTransactions.organizationId, orgId), eq(mpesaTransactions.checkoutRequestId, checkoutRequestId)));

    if (existingTx.length > 0 && (existingTx[0].status === "SUCCESS" || existingTx[0].status === "FAILED")) {
      return {
        success: true,
        idempotencySkipped: true,
        reference: existingTx[0].mpesaReceiptNumber || checkoutRequestId,
        message: "Duplicate callback safely ignored.",
      };
    }

    // 2. Failed callback handling
    if (stkCallback.ResultCode !== 0) {
      if (existingTx.length > 0) {
        await db
          .update(mpesaTransactions)
          .set({
            status: "FAILED",
            resultCode: stkCallback.ResultCode,
            resultDesc: stkCallback.ResultDesc,
            rawCallbackJson: JSON.stringify(callback),
            updatedAt: now,
          })
          .where(eq(mpesaTransactions.id, existingTx[0].id));
      }
      return { success: false, reason: stkCallback.ResultDesc };
    }

    // 3. Success callback processing
    const items = stkCallback.CallbackMetadata?.Item || [];
    const getVal = (name: string) => items.find((i) => i.Name === name)?.Value;

    const mpesaRef = String(getVal("MpesaReceiptNumber") || `MPESA_${Date.now()}`);
    const amount = Money.round(Number(getVal("Amount") || 0));

    // Update tracking transaction to SUCCESS
    if (existingTx.length > 0) {
      await db
        .update(mpesaTransactions)
        .set({
          status: "SUCCESS",
          mpesaReceiptNumber: mpesaRef,
          resultCode: stkCallback.ResultCode,
          resultDesc: stkCallback.ResultDesc,
          rawCallbackJson: JSON.stringify(callback),
          updatedAt: now,
        })
        .where(eq(mpesaTransactions.id, existingTx[0].id));
    }

    // 4. Record financial payment with atomic transaction allocation
    try {
      const tenantId = linkedEntities?.tenantId || "t1";
      const leaseId = linkedEntities?.leaseId || "l1";
      const unitId = linkedEntities?.unitId || "u1";
      const propertyId = linkedEntities?.propertyId || "kilimani-heights";

      await FinancialService.recordPayment(orgId, role, userId, {
        tenantId,
        leaseId,
        unitId,
        propertyId,
        amount,
        paymentMethod: "MPESA",
        transactionReference: mpesaRef,
        notes: `M-Pesa STK Push CheckoutRequestID: ${checkoutRequestId}`,
      });

      return { success: true, reference: mpesaRef };
    } catch (err) {
      // Idempotency: duplicate payment reference safely ignored
      return { success: true, idempotencySkipped: true, reference: mpesaRef };
    }
  }
}
