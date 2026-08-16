import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";
import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    return await next();
  } catch (error) {
    const accept = request?.headers?.get("accept") ?? "";
    const isServerFn = request?.headers?.get("x-ts-server-fn") || accept.includes("application/json");

    if (isServerFn) {
      throw error;
    }

    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    console.error("SSR Error intercepted by start.ts errorMiddleware:", error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => process.env.NODE_ENV === "production" && ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
