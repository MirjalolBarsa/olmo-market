import { handleError } from "../helpers/error-success.js";

export const RolesGuard = (includeRoles = []) => {
  return (req, res, next) => {
    if (!includeRoles.includes(req.user?.role)) {
      return handleError(res, "Forbidden user", 403);
    }
    next();
  };
};
