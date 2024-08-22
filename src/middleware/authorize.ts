// src/middleware/authorize.ts
import { NextFunction, Request, Response } from "express";
import { User } from "../db/entities/User.entity";

// Define interfaces for our entities
interface Permission {
  name: string;
}

interface Role {
  permissions: Permission[];
}

// Extend the Express Request type
interface AuthenticatedRequest extends Request {
  user?: User & { role: Role };
}

export const authorizePermission = (requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role || !user.role.permissions) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    const userPermissions = user.role.permissions.map(
      (p: Permission) => p.name
    );

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Forbidden: Required permission not found" });
    }

    next();
  };
};
