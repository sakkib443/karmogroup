import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import config from '../../config';

/**
 * Sample desk data for a fresh production database: customers, orders in
 * every status, coupons, jobs, applications, reviews and the staff actions
 * the admin reports read. Products are never created or updated.
 * Runs once. A rerun sees order KRM-D0001 and does nothing.
 */
const MARKER = 'KRM-D0001';

const STAFF = [
    { email: 'manager@karmogroup.com', role: 'manager', firstName: 'Nusrat', lastName: 'Desk' },
    { email: 'agency@karmogroup.com', role: 'agency', firstName: 'Call', lastName: 'Agency' },
    { email: 'factory@karmogroup.com', role: 'factory', firstName: 'Factory', lastName: 'Floor' },
] as const;

type Actor = { id: mongoose.Types.ObjectId; name: string; role: string };

const ago = (days: number, hour = 11) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(hour, 12, 0, 0);
    return d;
};

const CUSTOMERS = [
    ['Nabila', 'Rahman', '01711001001', 'Dhanmondi 27', 'Dhaka', 'Dhaka'],
    ['Tanvir', 'Ahmed', '01822001002', 'Agrabad CDA', 'Chattogram', 'Chattogram'],
    ['Farhana', 'Islam', '01933001003', 'Zindabazar', 'Sylhet', 'Sylhet'],
    ['Rakib', 'Hasan', '01644001004', 'Shaheb Bazar', 'Rajshahi', 'Rajshahi'],
    ['Mitu', 'Akter', '01555001005', 'Sonadanga', 'Khulna', 'Khulna'],
    ['Sabbir', 'Hossain', '01366001006', 'Tongi Station Road', 'Gazipur', 'Gazipur'],
    ['Lamia', 'Khan', '01777001007', 'Chashara', 'Narayanganj', 'Narayanganj'],
    ['Imran', 'Chowdhury', '01888001008', 'Kandirpar', 'Cumilla', 'Cumilla'],
    ['Shila', 'Begum', '01999001009', 'Uttara Sector 7', 'Dhaka', 'Dhaka'],
    ['Arif', 'Mahmud', '01610001010', 'Halishahar', 'Chattogram', 'Chattogram'],
] as const;

const LINES = [
    { name: 'Karmo Magnific King', slug: 'karmo-magnific-king', price: 28500, division: 'mattress' },
    { name: 'Karmo Ortho Plus Queen', slug: 'karmo-ortho-plus-queen', price: 22400, division: 'mattress' },
    { name: 'Poly Furniture Foam Set', slug: 'poly-furniture-foam-set', price: 9600, division: 'foam' },
    { name: 'Rebonded Sofa Cushion', slug: 'rebonded-sofa-cushion', price: 4200, division: 'foam' },
    { name: 'HomeTex Cotton Bedsheet', slug: 'hometex-cotton-bedsheet', price: 1850, division: 'hometex' },
    { name: 'Fibre Pillow Pair', slug: 'fibre-pillow-pair', price: 1400, division: 'fiber_pillow' },
] as const;

const STATUSES = [
    'pending', 'pending', 'pending', 'pending',
    'confirmed', 'confirmed', 'confirmed',
    'factory', 'factory',
    'challan_ready', 'challan_ready',
    'courier_entry', 'courier_entry',
    'shipped', 'shipped', 'shipped',
    'delivered', 'delivered', 'delivered', 'delivered',
    'on_the_way', 'out_for_delivery',
    'cancelled', 'cancelled',
    'returned', 'refunded',
] as const;

const PAST = new Set(['factory', 'challan_ready', 'courier_entry', 'shipped', 'delivered', 'on_the_way', 'out_for_delivery', 'returned']);

export async function ensureDeskSamples(): Promise<void> {
    if (config.env !== 'production') return;
    const db = mongoose.connection;
    const orders = db.collection('orders');
    if (await orders.findOne({ orderId: MARKER }, { projection: { _id: 1 } })) return;

    const users = db.collection('users');
    const now = new Date();
    const password = await bcrypt.hash('customer123', config.bcrypt_salt_rounds);

    for (const account of STAFF) {
        const found = await users.findOne({ email: account.email }, { projection: { _id: 1 } });
        if (found) continue;
        const hash = await bcrypt.hash(account.email, config.bcrypt_salt_rounds);
        await users.insertOne({
            email: account.email, password: hash, role: account.role,
            firstName: account.firstName, lastName: account.lastName,
            phone: '', avatar: '', status: 'active', isEmailVerified: true, isDeleted: false,
            permissions: [], divisions: [], shippingAddresses: [], wishlist: [],
            totalOrders: 0, totalSpent: 0, createdAt: now, updatedAt: now,
        });
    }

    const staffDocs = await users.find(
        { role: { $in: ['admin', 'superadmin', 'manager', 'agency', 'factory'] }, isDeleted: { $ne: true } },
        { projection: { firstName: 1, lastName: 1, role: 1 } },
    ).toArray();
    const actorOf = (role: string): Actor => {
        const hit = staffDocs.find((s) => s.role === role) || staffDocs[0];
        const name = hit ? [hit.firstName, hit.lastName].filter(Boolean).join(' ') : 'Karmo Desk';
        return { id: (hit?._id || new mongoose.Types.ObjectId()) as mongoose.Types.ObjectId, name, role: hit?.role || role };
    };
    const desk = actorOf('manager');
    const agency = actorOf('agency');
    const factory = actorOf('factory');

    const customerIds: mongoose.Types.ObjectId[] = [];
    for (let i = 0; i < CUSTOMERS.length; i++) {
        const [first, last, phone, line, city, district] = CUSTOMERS[i];
        const email = `demo.customer.${String(i + 1).padStart(2, '0')}@karmogroup.demo`;
        const existing = await users.findOne({ email }, { projection: { _id: 1 } });
        if (existing) {
            customerIds.push(existing._id as mongoose.Types.ObjectId);
            continue;
        }
        const inserted = await users.insertOne({
            email, password, role: 'user', firstName: first, lastName: last, phone,
            avatar: '', status: 'active', isEmailVerified: true, isDeleted: false,
            permissions: [], divisions: [], shippingAddresses: [], wishlist: [],
            totalOrders: 0, totalSpent: 0, createdAt: ago(6, 9), updatedAt: now,
        });
        customerIds.push(inserted.insertedId as mongoose.Types.ObjectId);
    }

    const docs = STATUSES.map((status, i) => {
        const who = CUSTOMERS[i % CUSTOMERS.length];
        const line = LINES[i % LINES.length];
        const qty = i % 5 === 0 ? 2 : 1;
        const subtotal = line.price * qty;
        const shippingCost = subtotal >= 15000 ? 0 : 120;
        const total = subtotal + shippingCost;
        const day = i % 6;
        const at = ago(day, 9 + (i % 8));
        const later = (ms: number) => {
            const d = new Date(at.getTime() + ms);
            return d.getTime() > Date.now() - 60_000 ? new Date(Date.now() - 60_000) : d;
        };
        const manual = i % 3 === 0;
        const paid = ['delivered', 'shipped', 'refunded'].includes(status) || (status === 'returned' && i % 2 === 0);
        const paymentMethod = i % 4 === 0 ? 'bkash' : i % 4 === 1 ? 'nagad' : 'cod';
        const fullName = `${who[0]} ${who[1]}`;
        const by = (person: Actor, note: string, when: Date, step = status) => ({ status: step, note, by: person, createdAt: when });
        const timeline = [by(manual ? agency : desk, manual ? 'Taken over the phone.' : 'Order placed on the website.', at, 'pending')];
        if (status !== 'pending') timeline.push(by(desk, 'Confirmed with the customer.', later(3600_000), 'confirmed'));
        if (PAST.has(status)) timeline.push(by(factory, 'Sent to the factory.', later(7200_000), 'factory'));
        if (['challan_ready', 'courier_entry', 'shipped', 'delivered', 'on_the_way', 'out_for_delivery', 'returned'].includes(status)) {
            timeline.push(by(factory, 'Challan issued.', later(10800_000), 'challan_ready'));
        }
        if (['shipped', 'delivered', 'on_the_way', 'out_for_delivery', 'returned'].includes(status)) {
            timeline.push(by(agency, 'Handed to the courier.', later(14400_000), 'shipped'));
        }
        if (status === 'delivered') timeline.push(by(agency, 'Delivered.', later(86400_000), 'delivered'));
        if (status === 'cancelled') timeline.push(by(desk, 'Customer asked to cancel.', later(5400_000), 'cancelled'));
        if (status === 'returned') timeline.push(by(desk, 'Returned after delivery.', later(172800_000), 'returned'));
        if (status === 'refunded') timeline.push(by(desk, 'Refund completed.', later(172800_000), 'refunded'));

        const doc: Record<string, unknown> = {
            orderId: `KRM-D${String(i + 1).padStart(4, '0')}`,
            user: customerIds[i % customerIds.length],
            items: [{ name: line.name, slug: line.slug, price: line.price, quantity: qty, total: subtotal, division: line.division }],
            shippingAddress: { fullName, phone: who[2], email: `demo.customer.${String((i % CUSTOMERS.length) + 1).padStart(2, '0')}@karmogroup.demo`, address: who[3], area: who[5], city: who[4] },
            subtotal, shippingCost, discount: 0, total,
            paymentMethod, paymentStatus: status === 'refunded' ? 'refunded' : paid ? 'paid' : 'pending',
            status, source: manual ? 'manual' : 'website',
            note: '', timeline, sms: [], jobs: [],
            createdAt: at, updatedAt: timeline[timeline.length - 1].createdAt,
        };
        if (manual) doc.createdBy = agency;
        if (status !== 'pending') {
            doc.confirmedBy = desk;
            doc.confirmedAt = later(3600_000);
        }
        if (status === 'cancelled') {
            doc.cancelledBy = desk;
            doc.cancelledAt = later(5400_000);
            doc.cancelReason = 'Customer changed their mind.';
        }
        if (status !== 'pending' && status !== 'cancelled') {
            doc.sms = [{ kind: 'confirmed', to: who[2], message: `Karmo: ${doc.orderId} is confirmed. Total ৳${total}.`, status: 'sent', by: desk, at: later(3700_000) }];
        }
        if (PAST.has(status)) {
            doc.jobs = [{
                division: line.division,
                challanNo: `M${String(2400 + i)}`,
                units: [{ code: `M${2400 + i}-1`, itemIndex: 0, scannedAt: later(8000_000), scannedBy: factory, method: 'scan' }],
                issuedAt: later(10800_000),
                issuedBy: factory,
            }];
        }
        if (['courier_entry', 'shipped', 'delivered', 'on_the_way', 'out_for_delivery', 'returned'].includes(status)) {
            doc.carrier = i % 2 === 0 ? 'Steadfast' : 'Pathao';
            doc.consignmentId = `SF${88000 + i}`;
            doc.trackingNumber = `SF${88000 + i}`;
            doc.courierStatus = status === 'delivered' ? 'delivered' : 'in_transit';
            doc.courierBookedAt = later(14000_000);
        }
        return doc;
    });

    await orders.insertMany(docs);

    const spent = new Map<string, { n: number; v: number }>();
    docs.forEach((d) => {
        const id = String(d.user);
        const row = spent.get(id) || { n: 0, v: 0 };
        row.n += 1;
        if (!['cancelled', 'refunded'].includes(String(d.status))) row.v += Number(d.total);
        spent.set(id, row);
    });
    for (const [id, row] of spent) {
        await users.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $inc: { totalOrders: row.n, totalSpent: row.v } });
    }

    const coupons = db.collection('coupons');
    const couponRows = [
        { code: 'WELCOME10', description: '10% off a first order', discountType: 'percentage', discountValue: 10, minOrderAmount: 5000, maxDiscount: 2000, usageLimit: 100, usedCount: 4, expiresAt: ago(-60) },
        { code: 'FREESHIP', description: 'Free delivery over ৳3,000', discountType: 'free_shipping', discountValue: 0, minOrderAmount: 3000, usageLimit: 200, usedCount: 7, expiresAt: ago(-45) },
    ];
    for (const row of couponRows) {
        if (await coupons.findOne({ code: row.code }, { projection: { _id: 1 } })) continue;
        await coupons.insertOne({ ...row, isActive: true, createdAt: ago(5), updatedAt: now });
    }

    const jobs = db.collection('jobs');
    const jobSeeds = [
        { title: 'Sales Executive, Dhaka', slug: 'sales-executive-dhaka', division: 'mattress', location: 'Dhaka', employmentType: 'full-time', summary: 'Showroom and phone sales for mattress and home textile.' },
        { title: 'Foam Plant Supervisor', slug: 'foam-plant-supervisor', division: 'foam', location: 'Gazipur', employmentType: 'full-time', summary: 'Shift supervision on the foam production line.' },
        { title: 'HomeTex Merchandiser', slug: 'hometex-merchandiser', division: 'hometex', location: 'Dhaka', employmentType: 'full-time', summary: 'Buyer follow-up and sampling for HomeTex.' },
    ];
    const jobIds: mongoose.Types.ObjectId[] = [];
    for (const job of jobSeeds) {
        const existing = await jobs.findOne({ slug: job.slug }, { projection: { _id: 1 } });
        if (existing) {
            jobIds.push(existing._id as mongoose.Types.ObjectId);
            continue;
        }
        const inserted = await jobs.insertOne({
            ...job, description: job.summary, requirements: 'Relevant experience and clear Bangla and English.',
            status: 'published', applicationCount: 0, createdAt: ago(4), updatedAt: now,
        });
        jobIds.push(inserted.insertedId as mongoose.Types.ObjectId);
    }

    const applications = db.collection('applications');
    const applicants = [
        ['Sumaiya Akter', 'sumaiya.akter.demo@karmogroup.demo', '01712002001', 0, 'shortlisted'],
        ['Jahidul Islam', 'jahidul.islam.demo@karmogroup.demo', '01823002002', 0, 'interview'],
        ['Pavel Hossain', 'pavel.hossain.demo@karmogroup.demo', '01934002003', 1, 'new'],
        ['Rina Begum', 'rina.begum.demo@karmogroup.demo', '01645002004', 1, 'offered'],
        ['Nadia Karim', 'nadia.karim.demo@karmogroup.demo', '01556002005', 2, 'new'],
        ['Omar Faruk', 'omar.faruk.demo@karmogroup.demo', '01367002006', 2, 'rejected'],
    ] as const;
    for (let i = 0; i < applicants.length; i++) {
        const [fullName, email, phone, jobIndex, status] = applicants[i];
        const job = jobIds[jobIndex];
        if (!job) continue;
        const trackingId = `KRM-APP-${1001 + i}`;
        if (await applications.findOne({ trackingId }, { projection: { _id: 1 } })) continue;
        await applications.insertOne({
            job, jobTitle: jobSeeds[jobIndex].title, trackingId, fullName, email, phone,
            coverLetterText: 'I would like to join the Karmo team.',
            cvUrl: 'https://www.karmogroup.com/career',
            cvFileName: `${fullName.replace(/\s+/g, '-').toLowerCase()}-cv.pdf`,
            status, createdAt: ago(3 - (i % 3), 10), updatedAt: now,
        });
        await jobs.updateOne({ _id: job }, { $inc: { applicationCount: 1 } });
    }

    const inquiries = db.collection('inquiries');
    const messages = [
        ['Nabila Rahman', '01711001001', 'product', '/mattress/king', 'Is the Magnific King available in 10 inch?'],
        ['Tanvir Ahmed', '01822001002', 'contact_form', '/contact', 'Do you deliver to Chattogram within three days?'],
        ['Farhana Islam', '01933001003', 'chat', '/', 'Please call me about a showroom visit in Sylhet.'],
        ['Rakib Hasan', '01644001004', 'product', '/mattress/ortho', 'Looking for a firm mattress for back pain.'],
        ['Mitu Akter', '01555001005', 'contact_form', '/contact', 'What is the warranty on the Ortho Plus?'],
    ] as const;
    for (let i = 0; i < messages.length; i++) {
        const [name, phone, source, page, message] = messages[i];
        if (await inquiries.findOne({ phone, message }, { projection: { _id: 1 } })) continue;
        const handled = i < 3;
        await inquiries.insertOne({
            name, phone, message, source, page,
            status: handled ? 'replied' : 'pending',
            ...(handled ? { handledBy: agency, handledAt: ago(i, 15), adminReply: 'Called back the same day.' } : {}),
            createdAt: ago(i, 14), updatedAt: now,
        });
    }

    const products = await db.collection('products').find({}, { projection: { _id: 1 } }).limit(4).toArray();
    if (products.length) {
        const reviews = db.collection('reviews');
        const comments = [
            'Very comfortable. Delivery was on time.',
            'Firm in a good way. The cover feels solid.',
            'Good value. We have already ordered a second one.',
            'Support team confirmed the size before dispatch.',
        ];
        for (let i = 0; i < Math.min(8, products.length * 2); i++) {
            const product = products[i % products.length]._id;
            const user = customerIds[i % customerIds.length];
            if (await reviews.findOne({ product, user }, { projection: { _id: 1 } })) continue;
            await reviews.insertOne({
                product, user, rating: i % 5 === 0 ? 4 : 5,
                comment: comments[i % comments.length],
                isApproved: true, createdAt: ago(i % 5, 16), updatedAt: now,
            });
        }
    }

    console.log('✅ Desk samples ready: 26 orders, customers, coupons, jobs, applications.');
}
