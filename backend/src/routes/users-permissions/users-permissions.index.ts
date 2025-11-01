// src/routes/users/users-permissions.index.ts

import { createRouter } from "@/lib/create-app";

import * as handlers from "./users-permissions.handler";
import * as routes from "./users-permissions.routes";
import { authorizeMiddleware } from "@/middlewares/authorization.middleware";
import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";
import { wrapWithMiddlewares } from "@/lib/wrapWithMiddleware";

const router = createRouter()
  .openapi(
    routes.grantUserPermissions,
    wrapWithMiddlewares(
      handlers.grantUserPermissions,
      authorizeMiddleware(
        ROLES.SUPERADMIN,
        ROLES.ADMIN,
        PERMISSIONS.GRANT_USER_PERMISSIONS
      )
    )
  )
  .openapi(
    routes.denyUserPermissions,
    wrapWithMiddlewares(
      handlers.denyUserPermissions,
      authorizeMiddleware(
        ROLES.SUPERADMIN,
        ROLES.ADMIN,
        PERMISSIONS.DENY_USER_PERMISSIONS
      )
    )
  );

export default router;
