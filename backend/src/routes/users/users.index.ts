// src/routes/users/users.index.ts

import { createRouter } from "@/lib/create-app";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";
import { authenticationMiddleware } from "@/middlewares/authentication.middleware";
import { authorizeMiddleware } from "@/middlewares/authorization.middleware";
import { ROLES } from "@/constants/roles";
import { PERMISSIONS } from "@/constants/permissions";
import { wrapWithMiddlewares } from "@/lib/wrapWithMiddleware";

const router = createRouter()
  .openapi(
    routes.getAllUser,
    wrapWithMiddlewares(
      handlers.getAllUsers,
      authenticationMiddleware,
      authorizeMiddleware(ROLES.SUPERADMIN, ROLES.ADMIN, PERMISSIONS.VIEW_USER)
    )
  )
  .openapi(
    routes.createUser,
    wrapWithMiddlewares(
      handlers.createUser,
      authenticationMiddleware,
      authorizeMiddleware(
        ROLES.SUPERADMIN,
        ROLES.ADMIN,
        PERMISSIONS.CREATE_USER
      )
    )
  )
  .openapi(
    routes.patchUser,
    wrapWithMiddlewares(
      handlers.patchUser,
      authenticationMiddleware,
      authorizeMiddleware(ROLES.SUPERADMIN, ROLES.ADMIN, PERMISSIONS.PATCH_USER)
    )
  )
  .openapi(
    routes.getOneUser,
    wrapWithMiddlewares(
      handlers.getOneUser,
      authenticationMiddleware,
      authorizeMiddleware(
        ROLES.SUPERADMIN,
        ROLES.ADMIN,
        PERMISSIONS.VIEW_ONE_USER
      )
    )
  );

export default router;
