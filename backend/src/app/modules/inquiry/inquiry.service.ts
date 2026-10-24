import { Types } from 'mongoose';
import { Inquiry } from './inquiry.model';
import { Product } from '../product/product.model';
import AppError from '../../utils/AppError';
import { notifyInquiryToWhatsApp } from '../../utils/whatsappNotify';

type Actor = { userId: string; name?: string; role: string };

const SOURCES = ['contact_form', 'chat', 'product'];
const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

const InquiryService = {
    /** From the website. Only these fields are taken — status and replies are the desk's. */
    create: async (body: Record<string, unknown>) => {
        const name = clean(body.name, 100);
        const phone = clean(body.phone, 100);
        const message = String(body.message ?? '').trim().slice(0, 2000);
        if (!name) throw new AppError(400, 'Please write your name');
        if (!message) throw new AppError(400, 'Please write a message');
        const digits = phone.replace(/\D/g, '');
        const local = digits.startsWith('880') ? digits.slice(2) : digits;
        if (!/^01\d{9}$/.test(local) && !/^\S+@\S+\.\S+$/.test(phone)) throw new AppError(400, 'Please write a mobile number (01XXXXXXXXX)');

        // The same number, over and over in a few minutes, is someone pressing send again or spam.
        const recent = await Inquiry.countDocuments({ phone: { $in: [phone, local] }, createdAt: { $gte: new Date(Date.now() - 10 * 60e3) } });
        if (recent >= 3) throw new AppError(429, 'We already have your message — we will call you soon');

        const productId = body.product && Types.ObjectId.isValid(String(body.product)) ? String(body.product) : undefined;
        const product = productId ? await Product.findById(productId).select('name') : null;
        const source = SOURCES.includes(String(body.source)) ? String(body.source) : product ? 'product' : 'contact_form';

        const inquiry = await Inquiry.create({
            name, phone: /^01\d{9}$/.test(local) ? local : phone, message, source,
            page: clean(body.page, 300), product: product?._id,
        });

        notifyInquiryToWhatsApp({
            customerName: name, customerPhone: phone, productName: product?.name || 'General question', message,
            color: '', size: '',
        }).catch(() => {}); // never block the inquiry

        try {
            const { NotificationService } = require('../notification/notification.service');
            NotificationService.notifyRoles(['superadmin', 'admin', 'manager', 'online_sales'], {
                type: 'new_inquiry',
                title: 'New inquiry',
                message: `${name} (${phone})${product ? ` asked about "${product.name}"` : ' left a message'}.`,
                link: '/dashboard/admin/inquiries',
                meta: { inquiryId: inquiry._id.toString() },
            }).catch(() => {});
        } catch {
            // never block the inquiry
        }
        return inquiry;
    },

    /** The desk's list, newest first, with counts for each state. */
    getAll: async (query: Record<string, unknown>) => {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const filter: Record<string, any> = {};
        if (query.status && query.status !== 'all') filter.status = String(query.status);
        if (query.source && query.source !== 'all') filter.source = String(query.source);
        if (query.product) filter.product = query.product;
        if (query.searchTerm) {
            const rx = new RegExp(String(query.searchTerm).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [{ name: rx }, { phone: rx }, { message: rx }];
        }
        const [inquiries, total, counts] = await Promise.all([
            Inquiry.find(filter).populate('product', 'name slug thumbnail').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            Inquiry.countDocuments(filter),
            Inquiry.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
        ]);
        const summary: Record<string, number> = { pending: 0, replied: 0, closed: 0, total: 0 };
        for (const c of counts) { summary[c._id] = c.n; summary.total += c.n; }
        return { inquiries, summary, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    },

    getByProduct: async (productId: string) => {
        return Inquiry.find({ product: productId }).sort({ createdAt: -1 }).limit(50).select('name message createdAt');
    },

    /** Called / closed, with a note of what was said. */
    updateStatus: async (id: string, data: Record<string, unknown>, actor: Actor) => {
        const inquiry = await Inquiry.findById(id);
        if (!inquiry) throw new AppError(404, 'Inquiry not found');
        if (data.status !== undefined) {
            if (!['pending', 'replied', 'closed'].includes(String(data.status))) throw new AppError(400, 'Unknown status');
            inquiry.status = String(data.status) as any;
        }
        if (data.adminReply !== undefined) inquiry.adminReply = String(data.adminReply).slice(0, 2000);
        inquiry.handledBy = { id: actor.userId, name: actor.name || '', role: actor.role } as any;
        inquiry.handledAt = new Date();
        await inquiry.save();
        return inquiry;
    },

    delete: async (id: string) => {
        const inquiry = await Inquiry.findByIdAndDelete(id);
        if (!inquiry) throw new AppError(404, 'Inquiry not found');
        return inquiry;
    },
};

export default InquiryService;
