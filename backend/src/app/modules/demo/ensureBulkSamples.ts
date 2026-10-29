import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import config from '../../config';

/**
 * A second, larger batch of sample data on top of ensureDeskSamples: staff in
 * every role, 60 more customers, 180 orders over the last 90 days, coupons,
 * jobs, applications, inquiries and the staff activity feed.
 * Products are never created or updated.
 * Runs once. A rerun sees order KRM-B0001 and does nothing.
 */
const MARKER = 'KRM-B0001';

const STAFF = [
    { email: 'admin2@karmogroup.com', role: 'admin', firstName: 'Rafiq', lastName: 'Admin' },
    { email: 'manager2@karmogroup.com', role: 'manager', firstName: 'Sharmin', lastName: 'Sultana' },
    { email: 'sales@karmogroup.com', role: 'online_sales', firstName: 'Mehedi', lastName: 'Hasan' },
    { email: 'sales2@karmogroup.com', role: 'online_sales', firstName: 'Tania', lastName: 'Akter' },
    { email: 'agency2@karmogroup.com', role: 'agency', firstName: 'Kamrul', lastName: 'Islam' },
    { email: 'factory2@karmogroup.com', role: 'factory', firstName: 'Jasim', lastName: 'Uddin' },
] as const;

type Actor = { id: mongoose.Types.ObjectId; name: string; role: string };

const FIRST = ['Ayesha', 'Rahim', 'Sadia', 'Fahim', 'Nusrat', 'Shakil', 'Tasnim', 'Mahin', 'Rumana', 'Sohel',
    'Jannat', 'Riyad', 'Sumi', 'Hasib', 'Poly', 'Nayeem', 'Moumita', 'Asif', 'Keya', 'Rubel'];
const LAST = ['Rahman', 'Ahmed', 'Islam', 'Hossain', 'Khan', 'Chowdhury', 'Akter', 'Sarker', 'Mia', 'Talukder'];
const PLACES = [
    ['Mirpur 10', 'Dhaka', 'Dhaka'], ['Mohammadpur', 'Dhaka', 'Dhaka'], ['Bashundhara R/A', 'Dhaka', 'Dhaka'],
    ['Banani', 'Dhaka', 'Dhaka'], ['Gulshan 2', 'Dhaka', 'Dhaka'], ['Savar Bazar', 'Savar', 'Dhaka'],
    ['GEC Circle', 'Chattogram', 'Chattogram'], ['Nasirabad', 'Chattogram', 'Chattogram'],
    ['Amberkhana', 'Sylhet', 'Sylhet'], ['Uposhohor', 'Rajshahi', 'Rajshahi'], ['Boyra', 'Khulna', 'Khulna'],
    ['Joydebpur', 'Gazipur', 'Gazipur'], ['Fatullah', 'Narayanganj', 'Narayanganj'], ['Tomsom Bridge', 'Cumilla', 'Cumilla'],
    ['Band Road', 'Barishal', 'Barishal'], ['Jahaj Company Mor', 'Rangpur', 'Rangpur'], ['Charpara', 'Mymensingh', 'Mymensingh'],
    ['Kolatoli', "Cox's Bazar", "Cox's Bazar"], ['Maijdee', 'Noakhali', 'Noakhali'], ['Satmatha', 'Bogura', 'Bogura'],
] as const;

const LINES = [
    { name: 'Karmo Magnific King', slug: 'karmo-magnific-king', price: 28500, division: 'mattress' },
    { name: 'Karmo Magnific Queen', slug: 'karmo-magnific-queen', price: 24800, division: 'mattress' },
    { name: 'Karmo Ortho Plus Queen', slug: 'karmo-ortho-plus-queen', price: 22400, division: 'mattress' },
    { name: 'Karmo Ortho Plus Single', slug: 'karmo-ortho-plus-single', price: 14200, division: 'mattress' },
    { name: 'Karmo Spring Comfort Semi-Double', slug: 'karmo-spring-comfort-semi-double', price: 18900, division: 'mattress' },
    { name: 'Poly Furniture Foam Set', slug: 'poly-furniture-foam-set', price: 9600, division: 'foam' },
    { name: 'Rebonded Sofa Cushion', slug: 'rebonded-sofa-cushion', price: 4200, division: 'foam' },
    { name: 'High Density Foam Sheet 2"', slug: 'high-density-foam-sheet-2', price: 3100, division: 'foam' },
    { name: 'HomeTex Cotton Bedsheet', slug: 'hometex-cotton-bedsheet', price: 1850, division: 'hometex' },
    { name: 'HomeTex Comforter King', slug: 'hometex-comforter-king', price: 4500, division: 'hometex' },
    { name: 'HomeTex Mattress Protector', slug: 'hometex-mattress-protector', price: 2200, division: 'hometex' },
    { name: 'Fibre Pillow Pair', slug: 'fibre-pillow-pair', price: 1400, division: 'fiber_pillow' },
    { name: 'Memory Foam Pillow', slug: 'memory-foam-pillow', price: 2600, division: 'fiber_pillow' },
] as const;

const COUPONS = [
    { code: 'KARMO500', description: '৳500 off over ৳10,000', discountType: 'fixed', discountValue: 500, minOrderAmount: 10000, usageLimit: 300 },
    { code: 'MATTRESS15', description: '15% off mattresses', discountType: 'percentage', discountValue: 15, minOrderAmount: 12000, maxDiscount: 4000, usageLimit: 150 },
    { code: 'EID2026', description: 'Eid offer, 12% off', discountType: 'percentage', discountValue: 12, minOrderAmount: 5000, maxDiscount: 3000, usageLimit: 500 },
    { code: 'PILLOW200', description: '৳200 off pillows', discountType: 'fixed', discountValue: 200, minOrderAmount: 1500, usageLimit: 200 },
    { code: 'HOMETEX10', description: '10% off HomeTex', discountType: 'percentage', discountValue: 10, minOrderAmount: 2000, maxDiscount: 1000, usageLimit: 250 },
    { code: 'FOAM1000', description: '৳1,000 off foam sets', discountType: 'fixed', discountValue: 1000, minOrderAmount: 8000, usageLimit: 100 },
    { code: 'NEWYEAR', description: 'New year, 8% off', discountType: 'percentage', discountValue: 8, minOrderAmount: 3000, maxDiscount: 2500, usageLimit: 400 },
    { code: 'SHIPFREE5K', description: 'Free delivery over ৳5,000', discountType: 'free_shipping', discountValue: 0, minOrderAmount: 5000, usageLimit: null },
    { code: 'VIP2000', description: '৳2,000 off for repeat buyers', discountType: 'fixed', discountValue: 2000, minOrderAmount: 20000, usageLimit: 50 },
    { code: 'OLDDEAL', description: 'Expired autumn offer', discountType: 'percentage', discountValue: 20, minOrderAmount: 5000, maxDiscount: 5000, usageLimit: 100, expired: true },
] as const;

const JOBS = [
    { title: 'Area Sales Manager, Chattogram', slug: 'area-sales-manager-chattogram', division: 'mattress', location: 'Chattogram', employmentType: 'full-time', experienceLevel: 'senior', salaryMin: 45000, salaryMax: 65000 },
    { title: 'Showroom Sales Associate', slug: 'showroom-sales-associate', division: 'mattress', location: 'Dhaka', employmentType: 'full-time', experienceLevel: 'entry', salaryMin: 18000, salaryMax: 25000 },
    { title: 'Foam Machine Operator', slug: 'foam-machine-operator', division: 'foam', location: 'Gazipur', employmentType: 'full-time', experienceLevel: 'mid', salaryMin: 16000, salaryMax: 22000 },
    { title: 'Quality Control Officer', slug: 'quality-control-officer', division: 'foam', location: 'Gazipur', employmentType: 'full-time', experienceLevel: 'mid', salaryMin: 30000, salaryMax: 40000 },
    { title: 'Textile Designer', slug: 'textile-designer', division: 'hometex', location: 'Dhaka', employmentType: 'full-time', experienceLevel: 'mid', salaryMin: 35000, salaryMax: 50000 },
    { title: 'Chemical Lab Technician', slug: 'chemical-lab-technician', division: 'chemicals', location: 'Narayanganj', employmentType: 'full-time', experienceLevel: 'entry', salaryMin: 22000, salaryMax: 30000 },
    { title: 'Accounts Executive', slug: 'accounts-executive', division: 'corporate', location: 'Dhaka', employmentType: 'full-time', experienceLevel: 'mid', salaryMin: 30000, salaryMax: 42000 },
    { title: 'Digital Marketing Executive', slug: 'digital-marketing-executive', division: 'corporate', location: 'Dhaka', employmentType: 'full-time', experienceLevel: 'mid', salaryMin: 28000, salaryMax: 40000 },
    { title: 'Delivery Coordinator', slug: 'delivery-coordinator', division: 'other', location: 'Dhaka', employmentType: 'contract', experienceLevel: 'entry', salaryMin: 18000, salaryMax: 22000 },
    { title: 'Marketing Intern', slug: 'marketing-intern', division: 'corporate', location: 'Dhaka', employmentType: 'internship', experienceLevel: 'entry', salaryMin: 8000, salaryMax: 10000 },
] as const;

const APP_STATUSES = ['new', 'new', 'new', 'shortlisted', 'shortlisted', 'interview', 'offered', 'hired', 'rejected', 'rejected'] as const;

const QUESTIONS = [
    'Is the Magnific King available in 8 inch?',
    'Do you deliver outside Dhaka? How many days?',
    'What is the warranty on spring mattresses?',
    'Can I pay in installments with a card?',
    'Do you make custom size foam for a sofa?',
    'I want bulk bedsheets for a hotel, please call.',
    'Is there a showroom near Mirpur?',
    'Can I exchange the mattress if it is too firm?',
    'Need foam chemicals price list for my factory.',
    'Is the memory foam pillow good for neck pain?',
];

// Deterministic so a fresh database gets the same sample set every time.
let seed = 20261029;
const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
};
const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];

const ago = (days: number, hour = 11, minute = 12) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(hour, minute, 0, 0);
    return d;
};

/** Older orders have moved further along; recent ones are still on the desk. */
const statusFor = (day: number): string => {
    const r = rand();
    if (day > 20) return r < 0.72 ? 'delivered' : r < 0.82 ? 'cancelled' : r < 0.9 ? 'returned' : r < 0.95 ? 'refunded' : 'shipped';
    if (day > 7) return r < 0.4 ? 'delivered' : r < 0.6 ? 'shipped' : r < 0.7 ? 'on_the_way' : r < 0.78 ? 'courier_entry' : r < 0.86 ? 'out_for_delivery' : r < 0.94 ? 'cancelled' : 'returned';
    return r < 0.3 ? 'pending' : r < 0.5 ? 'confirmed' : r < 0.65 ? 'factory' : r < 0.77 ? 'challan_ready' : r < 0.87 ? 'courier_entry' : r < 0.95 ? 'shipped' : 'cancelled';
};

const PAST = new Set(['factory', 'challan_ready', 'courier_entry', 'shipped', 'delivered', 'on_the_way', 'out_for_delivery', 'returned', 'refunded']);
const HANDED = new Set(['shipped', 'delivered', 'on_the_way', 'out_for_delivery', 'returned', 'refunded']);

export async function ensureBulkSamples(): Promise<void> {
    if (config.env !== 'production') return;
    const db = mongoose.connection;
    const orders = db.collection('orders');
    if (await orders.findOne({ orderId: MARKER }, { projection: { _id: 1 } })) return;

    const users = db.collection('users');
    const now = new Date();

    for (const account of STAFF) {
        if (await users.findOne({ email: account.email }, { projection: { _id: 1 } })) continue;
        const hash = await bcrypt.hash(account.email, config.bcrypt_salt_rounds);
        await users.insertOne({
            email: account.email, password: hash, role: account.role,
            firstName: account.firstName, lastName: account.lastName,
            phone: '', avatar: '', status: 'active', isEmailVerified: true, isDeleted: false,
            permissions: [], divisions: [], shippingAddresses: [], wishlist: [],
            totalOrders: 0, totalSpent: 0, createdAt: ago(30, 9), updatedAt: now,
        });
    }

    const staffDocs = await users.find(
        { role: { $in: ['admin', 'superadmin', 'manager', 'online_sales', 'agency', 'factory'] }, isDeleted: { $ne: true } },
        { projection: { firstName: 1, lastName: 1, role: 1 } },
    ).toArray();
    const actorsOf = (role: string): Actor[] => {
        const hits = staffDocs.filter((s) => s.role === role);
        const list = hits.length ? hits : staffDocs.slice(0, 1);
        return list.map((hit) => ({
            id: hit._id as mongoose.Types.ObjectId,
            name: [hit.firstName, hit.lastName].filter(Boolean).join(' ') || 'Karmo Desk',
            role: hit.role,
        }));
    };
    const desks = [...actorsOf('manager'), ...actorsOf('online_sales')];
    const agencies = actorsOf('agency');
    const factories = actorsOf('factory');

    const password = await bcrypt.hash('customer123', config.bcrypt_salt_rounds);
    type Customer = { id: mongoose.Types.ObjectId; name: string; phone: string; email: string; place: readonly string[] };
    const customers: Customer[] = [];
    for (let i = 0; i < 60; i++) {
        const first = FIRST[i % FIRST.length];
        const last = LAST[(i * 7) % LAST.length];
        const place = PLACES[(i * 3) % PLACES.length];
        const phone = `01${String(3 + (i % 7))}${String(40000000 + i * 1379).slice(0, 8)}`;
        const email = `demo.customer.${String(i + 11).padStart(2, '0')}@karmogroup.demo`;
        const existing = await users.findOne({ email }, { projection: { _id: 1 } });
        let id = existing?._id as mongoose.Types.ObjectId | undefined;
        if (!id) {
            const inserted = await users.insertOne({
                email, password, role: 'user', firstName: first, lastName: last, phone,
                avatar: '', status: i % 23 === 22 ? 'blocked' : 'active', isEmailVerified: true, isDeleted: false,
                permissions: [], divisions: [],
                shippingAddresses: [{ fullName: `${first} ${last}`, phone, address: place[0], area: place[2], city: place[1], isDefault: true }],
                wishlist: [], totalOrders: 0, totalSpent: 0, createdAt: ago(95 - i, 10), updatedAt: now,
            });
            id = inserted.insertedId as mongoose.Types.ObjectId;
        }
        customers.push({ id, name: `${first} ${last}`, phone, email, place });
    }

    const couponUse = new Map<string, number>();
    const docs = Array.from({ length: 180 }, (_, i) => {
        const who = customers[Math.floor(rand() * customers.length)];
        const day = Math.floor((i / 180) * 90);
        const at = ago(90 - day, 9 + Math.floor(rand() * 11), Math.floor(rand() * 60));
        const age = 90 - day;
        const status = statusFor(age);
        const later = (ms: number) => {
            const d = new Date(at.getTime() + ms);
            return d.getTime() > Date.now() - 60_000 ? new Date(Date.now() - 60_000) : d;
        };

        const count = rand() < 0.65 ? 1 : rand() < 0.75 ? 2 : 3;
        const items = Array.from({ length: count }, () => {
            const line = pick(LINES);
            const quantity = line.price < 5000 && rand() < 0.4 ? 2 : 1;
            return { name: line.name, slug: line.slug, price: line.price, quantity, total: line.price * quantity, division: line.division };
        });
        const subtotal = items.reduce((sum, it) => sum + it.total, 0);

        let discount = 0;
        let couponCode = '';
        if (rand() < 0.25) {
            const coupon = pick(COUPONS.filter((c) => !('expired' in c) && subtotal >= c.minOrderAmount));
            if (coupon) {
                couponCode = coupon.code;
                if (coupon.discountType === 'fixed') discount = coupon.discountValue;
                if (coupon.discountType === 'percentage') {
                    const cap = 'maxDiscount' in coupon ? coupon.maxDiscount : Infinity;
                    discount = Math.min(Math.round((subtotal * coupon.discountValue) / 100), cap);
                }
                couponUse.set(coupon.code, (couponUse.get(coupon.code) || 0) + 1);
            }
        }
        const shippingCost = subtotal >= 15000 || couponCode === 'SHIPFREE5K' ? 0 : who.place[1] === 'Dhaka' ? 80 : 150;
        const total = subtotal - discount + shippingCost;

        const desk = pick(desks);
        const agency = pick(agencies);
        const factory = pick(factories);
        const manual = rand() < 0.3;
        const paymentMethod = rand() < 0.55 ? 'cod' : pick(['bkash', 'nagad', 'rocket', 'sslcommerz'] as const);
        const paid = status === 'delivered' || status === 'refunded' || (paymentMethod !== 'cod' && status !== 'pending' && status !== 'cancelled');
        const orderId = `KRM-B${String(i + 1).padStart(4, '0')}`;

        const by = (person: Actor, note: string, when: Date, step: string) => ({ status: step, note, by: person, createdAt: when });
        const timeline = [by(manual ? agency : desk, manual ? 'Taken over the phone.' : 'Order placed on the website.', at, 'pending')];
        if (status !== 'pending') timeline.push(by(desk, 'Confirmed with the customer.', later(3600_000), 'confirmed'));
        if (PAST.has(status)) timeline.push(by(factory, 'Sent to the factory.', later(7200_000), 'factory'));
        if (PAST.has(status) && status !== 'factory') timeline.push(by(factory, 'Challan issued.', later(10800_000), 'challan_ready'));
        if (HANDED.has(status) || status === 'courier_entry') timeline.push(by(agency, 'Booked with the courier.', later(12600_000), 'courier_entry'));
        if (HANDED.has(status)) timeline.push(by(agency, 'Handed to the courier.', later(14400_000), 'shipped'));
        if (status === 'on_the_way') timeline.push(by(agency, 'Courier is on the way.', later(86400_000), 'on_the_way'));
        if (status === 'out_for_delivery') timeline.push(by(agency, 'Out for delivery.', later(129600_000), 'out_for_delivery'));
        if (['delivered', 'returned', 'refunded'].includes(status)) timeline.push(by(agency, 'Delivered.', later(172800_000), 'delivered'));
        if (status === 'cancelled') timeline.push(by(desk, pick(['Customer asked to cancel.', 'Phone unreachable after three calls.', 'Duplicate order.']), later(5400_000), 'cancelled'));
        if (status === 'returned' || status === 'refunded') timeline.push(by(desk, 'Returned after delivery.', later(345600_000), 'returned'));
        if (status === 'refunded') timeline.push(by(desk, 'Refund completed.', later(432000_000), 'refunded'));

        const doc: Record<string, unknown> = {
            orderId, user: who.id, items,
            shippingAddress: { fullName: who.name, phone: who.phone, email: who.email, address: who.place[0], area: who.place[2], city: who.place[1] },
            subtotal, shippingCost, discount, total,
            couponCode, couponCodes: couponCode ? [couponCode] : [],
            paymentMethod, paymentStatus: status === 'refunded' ? 'refunded' : paid ? 'paid' : 'pending',
            status, source: manual ? 'manual' : 'website',
            note: rand() < 0.15 ? pick(['Please call before delivery.', 'Deliver after 5 pm.', 'Gift wrap, please.']) : '',
            timeline, sms: [], jobs: [],
            createdAt: at, updatedAt: timeline[timeline.length - 1].createdAt,
        };
        if (manual) doc.createdBy = agency;
        if (status !== 'pending') {
            doc.confirmedBy = desk;
            doc.confirmedAt = later(3600_000);
            doc.sms = [{ kind: 'confirmed', to: who.phone, message: `Karmo: ${orderId} is confirmed. Total ৳${total}.`, status: 'sent', by: desk, at: later(3700_000) }];
        }
        if (status === 'cancelled') {
            doc.cancelledBy = desk;
            doc.cancelledAt = later(5400_000);
            doc.cancelReason = String(timeline[timeline.length - 1].note);
        }
        if (PAST.has(status)) {
            doc.jobs = items.map((it, k) => ({
                division: it.division,
                challanNo: `B${String(5000 + i * 3 + k)}`,
                units: Array.from({ length: it.quantity }, (_, u) => ({
                    code: `B${5000 + i * 3 + k}-${u + 1}`, itemIndex: k, scannedAt: later(8000_000), scannedBy: factory, method: 'scan',
                })),
                ...(status !== 'factory' ? { issuedAt: later(10800_000), issuedBy: factory } : {}),
            }));
        }
        if (HANDED.has(status) || status === 'courier_entry') {
            doc.carrier = rand() < 0.6 ? 'Steadfast' : 'Pathao';
            doc.consignmentId = `SF${91000 + i}`;
            doc.trackingNumber = `SF${91000 + i}`;
            doc.courierStatus = ['delivered', 'returned', 'refunded'].includes(status) ? 'delivered' : 'in_transit';
            doc.courierBookedAt = later(12600_000);
        }
        if (status === 'delivered') doc.deliveredAt = later(172800_000);
        return doc;
    });

    await orders.insertMany(docs);

    const spent = new Map<string, { n: number; v: number }>();
    docs.forEach((d) => {
        const id = String(d.user);
        const row = spent.get(id) || { n: 0, v: 0 };
        row.n += 1;
        if (!['cancelled', 'refunded', 'returned'].includes(String(d.status))) row.v += Number(d.total);
        spent.set(id, row);
    });
    for (const [id, row] of spent) {
        await users.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $inc: { totalOrders: row.n, totalSpent: row.v } });
    }

    const coupons = db.collection('coupons');
    for (const row of COUPONS) {
        if (await coupons.findOne({ code: row.code }, { projection: { _id: 1 } })) continue;
        const { expired, ...fields } = { expired: false, maxDiscount: null, ...row };
        await coupons.insertOne({
            ...fields, usedCount: couponUse.get(row.code) || 0,
            expiresAt: expired ? ago(10) : ago(-90), isActive: !expired,
            applicableTo: 'all', specificProducts: [], specificCategories: [],
            createdAt: ago(95), updatedAt: now,
        });
    }

    const jobs = db.collection('jobs');
    const jobIds: mongoose.Types.ObjectId[] = [];
    for (let j = 0; j < JOBS.length; j++) {
        const job = JOBS[j];
        const existing = await jobs.findOne({ slug: job.slug }, { projection: { _id: 1 } });
        if (existing) {
            jobIds.push(existing._id as mongoose.Types.ObjectId);
            continue;
        }
        const summary = `${job.title} for Karmo Group, based in ${job.location}.`;
        const inserted = await jobs.insertOne({
            ...job, department: job.division === 'corporate' ? 'Head Office' : 'Operations',
            workplaceType: 'on-site', vacancies: 1 + (j % 3), salaryCurrency: 'BDT', salaryPeriod: 'monthly', salaryNegotiable: j % 2 === 0,
            summary, description: summary,
            responsibilities: 'Day-to-day duties of the role, reporting to the division head.',
            requirements: 'Relevant experience and clear Bangla and English.',
            education: 'HSC or above; graduation preferred.',
            benefits: 'Festival bonus, lunch, provident fund.',
            skills: [], status: j === JOBS.length - 1 ? 'closed' : j === JOBS.length - 2 ? 'draft' : 'published',
            deadline: ago(-(20 + j * 3)), isUrgent: j < 2, applicationCount: 0,
            createdAt: ago(40 - j * 3), updatedAt: now,
        });
        jobIds.push(inserted.insertedId as mongoose.Types.ObjectId);
    }

    const applications = db.collection('applications');
    for (let i = 0; i < 50; i++) {
        const trackingId = `KRM-APP-${2001 + i}`;
        if (await applications.findOne({ trackingId }, { projection: { _id: 1 } })) continue;
        const j = i % (JOBS.length - 1); // nobody applies to the draft
        const fullName = `${FIRST[(i * 3 + 5) % FIRST.length]} ${LAST[(i * 5 + 2) % LAST.length]}`;
        const slug = fullName.replace(/\s+/g, '.').toLowerCase();
        await applications.insertOne({
            job: jobIds[j], jobTitle: JOBS[j].title, trackingId, fullName,
            email: `${slug}.${i}@karmogroup.demo`, phone: `017${String(55000000 + i * 4211).slice(0, 8)}`,
            coverLetterText: 'I would like to join the Karmo team.',
            cvUrl: `/demo/demo-cv-${(i % 3) + 1}.pdf`, cvFileName: `${slug}-cv.pdf`,
            status: APP_STATUSES[i % APP_STATUSES.length], createdAt: ago(35 - (i % 30), 10 + (i % 6)), updatedAt: now,
        });
        await jobs.updateOne({ _id: jobIds[j] }, { $inc: { applicationCount: 1 } });
    }

    const inquiries = db.collection('inquiries');
    for (let i = 0; i < 30; i++) {
        const who = customers[(i * 7) % customers.length];
        const message = QUESTIONS[i % QUESTIONS.length];
        if (await inquiries.findOne({ phone: who.phone, message }, { projection: { _id: 1 } })) continue;
        const status = i < 18 ? 'replied' : i < 22 ? 'closed' : 'pending';
        await inquiries.insertOne({
            name: who.name, phone: who.phone, message,
            source: (['contact_form', 'chat', 'product'] as const)[i % 3],
            page: (['/contact', '/', '/mattress'] as const)[i % 3],
            status,
            ...(status !== 'pending' ? { handledBy: pick(agencies), handledAt: ago(30 - i, 15), adminReply: 'Called back the same day.' } : {}),
            createdAt: ago(30 - i, 13), updatedAt: now,
        });
    }

    const logs = docs.flatMap((d) => (d.timeline as { status: string; by: Actor; createdAt: Date }[]).slice(1).map((step) => ({
        actor: step.by.id, actorName: step.by.name,
        action: `order_${step.status}`, target: String(d.orderId),
        meta: { role: step.by.role }, createdAt: step.createdAt, updatedAt: step.createdAt,
    })));
    if (logs.length) await db.collection('activitylogs').insertMany(logs);

    console.log(`✅ Bulk samples ready: ${docs.length} orders, ${customers.length} customers, ${STAFF.length} staff, ${COUPONS.length} coupons, ${JOBS.length} jobs.`);
}
