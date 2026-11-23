import { Counter, ICounter } from './counter.model';
import { ensureDefaultCounters } from './counter.seed';
import AppError from '../../utils/AppError';

export const CounterService = {
    async getActive(): Promise<ICounter[]> {
        const count = await Counter.countDocuments();
        if (count === 0) {
            await ensureDefaultCounters();
        }
        return Counter.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean() as unknown as ICounter[];
    },

    async getAll(): Promise<ICounter[]> {
        const count = await Counter.countDocuments();
        if (count === 0) {
            await ensureDefaultCounters();
        }
        return Counter.find().sort({ order: 1, createdAt: 1 }).lean() as unknown as ICounter[];
    },

    async getById(id: string): Promise<ICounter> {
        const item = await Counter.findById(id);
        if (!item) {
            throw new AppError(404, 'Counter not found');
        }
        return item;
    },

    async create(data: Partial<ICounter>): Promise<ICounter> {
        const count = await Counter.countDocuments();
        const order = data.order !== undefined ? data.order : count + 1;
        const item = await Counter.create({ ...data, order });
        return item;
    },

    async update(id: string, data: Partial<ICounter>): Promise<ICounter> {
        const item = await Counter.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!item) {
            throw new AppError(404, 'Counter not found');
        }
        return item;
    },

    async bulkUpdate(items: Array<Partial<ICounter> & { _id?: string }>): Promise<ICounter[]> {
        const updated: ICounter[] = [];
        for (const it of items) {
            if (it._id) {
                const item = await Counter.findByIdAndUpdate(it._id, it, { new: true, runValidators: true });
                if (item) updated.push(item);
            } else {
                const item = await Counter.create(it);
                updated.push(item);
            }
        }
        return updated;
    },

    async delete(id: string): Promise<void> {
        const item = await Counter.findByIdAndDelete(id);
        if (!item) {
            throw new AppError(404, 'Counter not found');
        }
    },
};

export default CounterService;
