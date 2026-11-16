import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import CounterService from './counter.service';

const CounterController = {
    getActive: catchAsync(async (_req: Request, res: Response) => {
        const counters = await CounterService.getActive();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Active counters fetched successfully',
            data: counters,
        });
    }),

    getAll: catchAsync(async (_req: Request, res: Response) => {
        const counters = await CounterService.getAll();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'All counters fetched successfully',
            data: counters,
        });
    }),

    getById: catchAsync(async (req: Request, res: Response) => {
        const counter = await CounterService.getById(req.params.id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Counter fetched successfully',
            data: counter,
        });
    }),

    create: catchAsync(async (req: Request, res: Response) => {
        const counter = await CounterService.create(req.body);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Counter created successfully',
            data: counter,
        });
    }),

    update: catchAsync(async (req: Request, res: Response) => {
        const counter = await CounterService.update(req.params.id, req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Counter updated successfully',
            data: counter,
        });
    }),

    bulkUpdate: catchAsync(async (req: Request, res: Response) => {
        const items = Array.isArray(req.body) ? req.body : req.body.counters || [];
        const counters = await CounterService.bulkUpdate(items);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Counters updated successfully',
            data: counters,
        });
    }),

    delete: catchAsync(async (req: Request, res: Response) => {
        await CounterService.delete(req.params.id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Counter deleted successfully',
        });
    }),
};

export default CounterController;
