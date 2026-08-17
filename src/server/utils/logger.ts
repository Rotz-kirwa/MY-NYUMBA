type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  level?: LogLevel;
  organizationId?: string;
  userId?: string;
  action?: string;
  data?: Record<string, any>;
  error?: any;
}

export class Logger {
  private static formatLog(payload: LogPayload) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: payload.level || "info",
      message: payload.message,
      orgId: payload.organizationId || null,
      userId: payload.userId || null,
      action: payload.action || null,
      ...(payload.data ? { data: payload.data } : {}),
      ...(payload.error ? { error: payload.error?.message || payload.error } : {}),
    });
  }

  static info(message: string, meta?: Partial<LogPayload>) {
    console.log(this.formatLog({ message, level: "info", ...meta }));
  }

  static warn(message: string, meta?: Partial<LogPayload>) {
    console.warn(this.formatLog({ message, level: "warn", ...meta }));
  }

  static error(message: string, error?: any, meta?: Partial<LogPayload>) {
    console.error(this.formatLog({ message, level: "error", error, ...meta }));
  }
}
