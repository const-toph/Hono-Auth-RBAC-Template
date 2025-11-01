// src/routes/auth/auth.index.ts

import { createRouter } from "@/lib/create-app";
import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";

const router = createRouter()
  .openapi(routes.login, handlers.login)
  .openapi(routes.logout, handlers.logout)
  .openapi(routes.logout_all, handlers.logout_all)
  .openapi(routes.refresh, handlers.refresh);

export default router;
