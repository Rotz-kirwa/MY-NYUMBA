import { z } from "zod";

export const recordPaymentSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  leaseId: z.string().min(1, "Lease ID is required"),
  unitId: z.string().min(1, "Unit ID is required"),
  propertyId: z.string().min(1, "Property ID is required"),
  amount: z.number().positive("Payment amount must be greater than zero"),
  paymentMethod: z.enum(["MPESA", "BANK_TRANSFER", "CHEQUE", "CASH"]),
  transactionReference: z.string().min(3, "Transaction reference is required"),
  notes: z.string().optional(),
});

export const stkPushSchema = z.object({
  phoneNumber: z.string().regex(/^(\+?254|0)[17]\d{8}$/, "Invalid Kenyan phone number format"),
  amount: z.number().min(10, "Minimum STK push amount is KSh 10"),
  accountReference: z.string().default("RENT"),
});

export const createPropertySchema = z.object({
  name: z.string().min(2, "Property name is required"),
  propertyCode: z.string().min(2, "Property code is required"),
  area: z.string().min(2, "Neighborhood/Area is required"),
  tier: z.enum(["Standard", "Mid", "Premium", "Luxury"]).default("Mid"),
  caretakerName: z.string().min(2, "Caretaker name is required"),
  caretakerPhone: z.string().min(10, "Caretaker phone is required"),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear()),
});

export const createUnitSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  type: z.string().min(2, "Unit type is required"),
  monthlyRent: z.number().positive("Monthly rent must be positive"),
  serviceCharge: z.number().nonnegative().default(0),
  depositAmount: z.number().nonnegative().default(0),
});
