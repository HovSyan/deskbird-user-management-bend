import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ROLES } from 'src/constants';
import { Request } from 'express';

export const RolesGuard = (...roles: ROLES[]) => {
    return class _ implements CanActivate {
        canActivate(context: ExecutionContext) {
            if (!roles) return true;
            const role = context.switchToHttp().getRequest<Request>().jwt_payload?.sub.role ?? NaN;
            return roles.includes(role);
        }
    };
};
