import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import RoleService from './role.service';

const actorOf = (req: Request) => ({ userId: req.user!.userId, role: req.user!.role });

const RoleController = {
    getPermissions: catchAsync(async (_req: Request, res: Response) => {
        const permissions = RoleService.getPermissions();
        sendResponse(res, { statusCode: 200, success: true, message: 'Permissions fetched', data: permissions });
    }),

    getStaff: catchAsync(async (_req: Request, res: Response) => {
        const staff = await RoleService.getStaff();
        sendResponse(res, { statusCode: 200, success: true, message: 'Staff fetched', data: staff });
    }),

    createStaff: catchAsync(async (req: Request, res: Response) => {
        const user = await RoleService.createStaff(actorOf(req), req.body);
        sendResponse(res, { statusCode: 201, success: true, message: 'Staff account created', data: user });
    }),

    updateUserRole: catchAsync(async (req: Request, res: Response) => {
        const user = await RoleService.updateUserRole(actorOf(req), req.params.userId, req.body);
        sendResponse(res, { statusCode: 200, success: true, message: 'User role updated', data: user });
    }),
};

export default RoleController;
