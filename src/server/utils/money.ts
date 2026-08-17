/**
 * Enterprise Financial Money Utilities for KES (Kenyan Shilling)
 * Operates on exact rounded KES decimals and minor units (cents) to avoid floating-point drift.
 */

export class Money {
  /**
   * Converts a float/decimal KES amount to integer minor units (cents/cents of KES).
   */
  static toMinor(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Converts minor units back to KES decimal number rounded to 2 decimal places.
   */
  static fromMinor(minor: number): number {
    return Math.round(minor) / 100;
  }

  /**
   * Safe addition of monetary values.
   */
  static add(a: number, b: number): number {
    return this.fromMinor(this.toMinor(a) + this.toMinor(b));
  }

  /**
   * Safe subtraction of monetary values.
   */
  static subtract(a: number, b: number): number {
    return this.fromMinor(this.toMinor(a) - this.toMinor(b));
  }

  /**
   * Rounds a KES monetary value strictly to 2 decimal places.
   */
  static round(amount: number): number {
    return this.fromMinor(this.toMinor(amount));
  }

  /**
   * Formats a monetary amount into KES standard currency display string.
   */
  static format(amount: number): string {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}
