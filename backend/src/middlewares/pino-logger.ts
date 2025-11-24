// backend/src/middlewares/pino-logger.ts

import envConfig from "@/env";
import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

export function pinoLogger() {
  return logger({
    pino: pino(
      { 
        level: envConfig.LOG_LEVEL || "info",
        // Use serializers to remove req
        serializers: {
          // req: () => undefined,
        },
      },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
      envConfig.NODE_ENV === "production" ? undefined : pretty()
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}