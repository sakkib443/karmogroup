import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../utils/AppError';
import { User } from '../modules/user/user.model';
import type { Role } from '../constants/roles';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & {
                userId: string;
                email: string;
                role: Role;
                /** Display name, for "done by" on order timelines. */
                name?: string;
                /** Factory divisions this user may see; empty = all. */
                divisions?: string[];
            };
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(401, 'You are not logged in. Please login to continue.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) throw new AppError(401, 'Invalid authentication token.');

        const decoded = jwt.verify(token, config.jwt.access_secret) as JwtPayload & {
            userId: string;
            email: string;
            role: Role;
        };

        const user = await User.findById(decoded.userId);
        if (!user) throw new AppError(401, 'User belonging to this token no longer exists.');
        if (user.isDeleted) throw new AppError(401, 'This user account has been deleted.');
        if (user.status === 'blocked') throw new AppError(403, 'Your account has been blocked. Contact support.');

        // The role comes from the account, not the token, so a role change (or a
        // demotion) takes effect on the very next request instead of when the token expires.
        req.user = {
            ...decoded,
            role: user.role as Role,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            divisions: (user as any).divisions || [],
        };
        next();
    } catch (error) {
        next(error);
    }
};

export const authorizeRoles = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // The super admin passes every role check. Which roles open which route is
        // grouped in constants/roles.ts (R.ops, R.orderDesk…).
        const allowed = !!req.user && (req.user.role === 'superadmin' || allowedRoles.includes(req.user.role));
        if (!allowed) {
            throw new AppError(403, 'You do not have permission to perform this action.');
        }
        next();
    };
};

/**
 * Permission-based authorization.
 * Passes if the user is a superadmin (bypasses all permission checks),
 * or an admin who holds EVERY listed permission.
 * Permissions are not in the JWT, so the user is fetched from the DB.
 */
export const authorizePermission = (...requiredPerms: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new AppError(401, 'You are not logged in. Please login to continue.');

            // Superadmin bypasses all permission checks.
            if (req.user.role === 'superadmin') return next();

            const user = await User.findById(req.user.userId);
            if (!user) throw new AppError(401, 'User belonging to this token no longer exists.');

            const userPerms = user.permissions || [];
            const hasAll = req.user.role === 'admin' && requiredPerms.every((p) => userPerms.includes(p));
            if (!hasAll) {
                throw new AppError(403, 'You do not have permission to perform this action.');
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token) {
                try {
                    const decoded = jwt.verify(token, config.jwt.access_secret) as JwtPayload & {
                        userId: string;
                        email: string;
                        role: Role;
                    };
                    req.user = decoded;
                } catch {
                    // ignore invalid token for optional auth
                }
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};
