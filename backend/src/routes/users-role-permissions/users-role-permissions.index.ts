// src/routes/users/users-role-permissions.index.ts

import { createRouter } from "@/lib/create-app";

import * as handlers from "./users-role-permissions.handler";
import * as routes from "./users-role-permissions.routes";
import { authenticationMiddleware } from "@/middlewares/authentication.middleware";
import { authorizeMiddleware } from "@/middlewares/authorization.middleware";
import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";
import { wrapWithMiddlewares } from "@/lib/wrapWithMiddleware";

const router = createRouter().openapi(
  routes.getAllUserRolePermissions,
  wrapWithMiddlewares(
    handlers.getAllUserRolePermissions,
    authenticationMiddleware,
    authorizeMiddleware(
      ROLES.SUPERADMIN,
      ROLES.ADMIN,
      PERMISSIONS.VIEW_USER_ROLE_PERMISSIONS
    )
  )
);

export default router;
