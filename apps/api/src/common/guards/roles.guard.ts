import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{
      user?: {
        role?:
          | string
          | { name: string; code?: string }
          | Array<string | { name: string; code?: string }>;
      };
    }>();

    if (!user || !user.role) {
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    const roles = Array.isArray(user.role) ? user.role : [user.role];

    const hasRole = requiredRoles.some((role) =>
      roles.some((userRole) =>
        typeof userRole === "string"
          ? userRole === role
          : userRole.name === role || userRole.code === role,
      ),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    return true;
  }
}
