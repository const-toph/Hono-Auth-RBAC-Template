// src/routes/users/users-role.index.ts

import { createRouter } from "@/lib/create-app";

import * as handlers from "./users-role.handler";
import * as routes from "./users-role.routes";
import { authenticationMiddleware } from "@/middlewares/authentication.middleware";
import { authorizeMiddleware } from "@/middlewares/authorization.middleware";
import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";
import { wrapWithMiddlewares } from "@/lib/wrapWithMiddleware";

const router = createRouter().openapi(
  routes.patchUserRole,
  wrapWithMiddlewares(
    handlers.patchUserRole,
    authenticationMiddleware,
    authorizeMiddleware(
      ROLES.SUPERADMIN,
      ROLES.ADMIN,
      PERMISSIONS.PATCH_USER_ROLE
    )
  )
);

export default router;
