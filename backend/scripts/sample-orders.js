/**
 * Sample orders for trying the admin panel (Dashboard, Orders, Order insights).
 *
 *   node scripts/sample-orders.js add      → adds 50 sample orders
 *   node scripts/sample-orders.js remove   → deletes every sample order
 *
 * Every sample order is marked so it can never pass for a real one: order number
 * TEST-0001…, customer "Test Customer N", phone 01700000xxx and a note saying so.
 * Sent sample orders also carry made-up courier data (Pathao / Steadfast, consignment
 * TEST-PT-… / TEST-SF-…) and two sample courier payouts (reference TEST-…), so Courier
 * parcels and Courier payouts have something to show. Nothing is booked with a real courier.
 * Each sample customer is a sample account too (email test-customer-N@sample.karmo.test,
 * no usable password), plus a few who signed up and never ordered — for Customers.
 * Staff on the sample orders are the demo accounts (agency confirms / cancels and sends
 * the SMS, online sales takes phone orders and books the courier) — for Staff activity.
 * Eight sample inquiries from today (phones 01700000150…157) fill Inquiries.
 * Three sample job posts (marked sample: true) and three applications to them (emails
 * @sample.karmo.test, CVs in client/public/demo/) fill Career.
 * They are written straight to the database — no SMS, WhatsApp, email or notification
 * goes out. They use the database in backend/.env (the same one the live site uses), so
 * REMOVE THEM BEFORE GO-LIVE: order numbers count every order, and deleting samples after
 * real orders exist could make a later order number repeat.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MARK = 'TEST ORDER (sample data) — delete before go-live';
const SAMPLE_EMAIL = /@sample\.karmo\.test$/;
const SAMPLE_INQUIRY_PHONES = Array.from({ length: 8 }, (_, i) => `01700000${150 + i}`);
// [name, message, source, page, status, note]
const JOBS = [
    {
        title: 'Production Supervisor — Foam', division: 'foam', department: 'Production', location: 'Demra, Dhaka',
        employmentType: 'full-time', workplaceType: 'on-site', experienceLevel: 'mid', vacancies: 2, experienceMin: 3, experienceMax: 6,
        salaryMin: 35000, salaryMax: 45000, isUrgent: true, bannerImage: '/pages/about/park-unit1-demra-gate.webp',
        summary: 'Run a foam production shift at our Demra plant — people, quality and safety.',
        description: '<p>Karmo has made foam since 1965. You will run one production shift at Unit 1, Demra.</p>',
        responsibilities: '<ul><li>Plan and run the shift</li><li>Check foam density and quality</li><li>Keep the floor safe and clean</li></ul>',
        requirements: '<ul><li>3+ years in foam or a similar factory</li><li>Able to lead a team of 15–20</li></ul>',
        education: '<p>Diploma or B.Sc. in Chemical / Mechanical Engineering.</p>',
        benefits: '<ul><li>Two festival bonuses</li><li>Lunch and transport</li></ul>',
        skills: ['Production planning', 'Quality control', 'Team leading'],
    },
    {
        title: 'Sales Executive — Mattress', division: 'mattress', department: 'Sales', location: 'Dhaka',
        employmentType: 'full-time', workplaceType: 'on-site', experienceLevel: 'entry', vacancies: 3, experienceMin: 1, experienceMax: 3,
        salaryMin: 22000, salaryMax: 30000, bannerImage: '/pages/mattress/hero/about-lifestyle-woman-cat-navy-room-hq.webp',
        summary: 'Sell Karmo mattresses to dealers and showrooms in Dhaka.',
        description: '<p>Visit dealers, take orders and grow mattress sales in your area.</p>',
        responsibilities: '<ul><li>Visit dealers every week</li><li>Take and follow up orders</li><li>Report sales each month</li></ul>',
        requirements: '<ul><li>1+ year in sales</li><li>Own motorcycle preferred</li></ul>',
        education: '<p>Bachelor degree in any subject.</p>',
        benefits: '<ul><li>Sales commission</li><li>Mobile and fuel allowance</li></ul>',
        skills: ['Dealer sales', 'Negotiation', 'Bangla & English'],
    },
    {
        title: 'Lab Assistant — Chemicals', division: 'chemicals', department: 'Quality Control', location: 'Feni',
        employmentType: 'full-time', workplaceType: 'on-site', experienceLevel: 'entry', vacancies: 1, experienceMin: 0, experienceMax: 2,
        salaryNegotiable: true, bannerImage: '/pages/chemicals/chemicals-karmo-adhesive-tins.webp',
        summary: 'Test adhesive and silicate batches in our chemicals lab.',
        description: '<p>Help the QC team test every batch before it leaves the plant.</p>',
        responsibilities: '<ul><li>Take and test batch samples</li><li>Keep lab records</li></ul>',
        requirements: '<ul><li>Fresh graduates welcome</li><li>Careful with lab safety</li></ul>',
        education: '<p>B.Sc. in Chemistry.</p>',
        benefits: '<ul><li>Training in-house</li><li>Accommodation at the plant</li></ul>',
        skills: ['Lab testing', 'Record keeping'],
    },
];
// [job index, name, email no., phone, status, current role, years, expected salary]
const APPLICANTS = [
    [0, 'Arif Hossain', 1, '01700000160', 'shortlisted', 'Shift In-charge', 6, 42000],
    [1, 'Sadia Islam', 2, '01700000161', 'new', 'Sales Officer', 3, 28000],
    [2, 'Mahmudul Hasan', 3, '01700000162', 'new', 'QC Trainee', 1, 20000],
];

const INQUIRIES = [
    ['Rafiq Hasan', 'King size mattress er dam koto? Uttara te delivery hobe?', 'contact_form', '/mattress', 'pending', ''],
    ['Nusrat Jahan', 'Amar 2 ta pillow lagbe, cash on delivery hobe ki?', 'chat', '/hometex/pillow', 'pending', ''],
    ['Kamal Uddin', 'Factory te bulk foam lagbe — 50 sheet HD foam, quotation chai.', 'contact_form', '/foam', 'pending', ''],
    ['Sharmin Akter', 'Order korechilam 3 din age, ekhono pai ni. Please call korun.', 'chat', '/', 'pending', ''],
    ['Tanvir Ahmed', 'Dealer hote chai Chattogram e. Ki ki lagbe?', 'contact_form', '/contact', 'replied', 'Called — sending the dealer form on WhatsApp.'],
    ['Mitu Rahman', 'Sodium silicate er price list pathaben?', 'contact_form', '/chemicals/sodium-silicate', 'replied', 'Price list sent by email.'],
    ['Abdul Karim', 'Mattress topper ki ache? 6 inch?', 'chat', '/mattress', 'closed', 'Has 4 inch only — customer ordered it by phone.'],
    ['Farhana Islam', 'Comforter er color option ki ki?', 'contact_form', '/hometex', 'closed', 'Told the colours; will order online.'],
];
const DAY = 864e5;

const PRODUCTS = [
    { name: 'King Mattress', slug: 'king', division: 'mattress', size: 'Damask 1 · 69 × 81 × 4 inch', price: 9622 },
    { name: 'Prestige Mattress', slug: 'prestige', division: 'mattress', size: 'Damask 1 · 69 × 81 × 4 inch', price: 10447 },
    { name: 'Orthopedic Mattress', slug: 'orthopedic', division: 'mattress', size: 'Damask 1 · 69 × 81 × 4 inch', price: 12096 },
    { name: 'Pillow Top Pocket Spring Mattress', slug: 'pillow-top-pocket-spring', division: 'mattress', size: 'Damask 1 · 69 × 81 × 12 inch', price: 44537 },
    { name: 'Mattress Topper', slug: 'topper', division: 'mattress', size: 'Damask 1 · 69 × 81 × 8 inch', price: 4948 },
    { name: 'Poly Foam Combo Offer', slug: 'poly', division: 'foam', size: '72 × 48 × 4 inch', price: 4734 },
    { name: 'HD Foam Combo Offer', slug: 'hd', division: 'foam', size: '72 × 48 × 4 inch', price: 7270 },
    { name: '280 Foam Combo Offer', slug: 'combo-280', division: 'foam', size: '72 × 48 × 4 inch', price: 5463 },
    { name: 'Plush Head Pillow (18" x 24")', slug: 'plush-head-pillow', division: 'fiber_pillow', size: '', price: 1030 },
    { name: 'RelaxTime Pillow Combo Offer', slug: 'relaxtime-pillow-combo', division: 'fiber_pillow', size: '', price: 1599 },
    { name: 'Comforter Crimson Royale', slug: 'comforter-crimson-royale', division: 'hometex', size: '', price: 2200 },
    { name: 'AC Quilt Blue Mandala', slug: 'ac-quilt-blue-mandala', division: 'hometex', size: '', price: 1900 },
];

// [area, city] — Dhaka city, its suburbs and the rest of the country.
const PLACES = [
    ['Mirpur', 'Dhaka'], ['Uttara', 'Dhaka'], ['Dhanmondi', 'Dhaka'], ['Gulshan', 'Dhaka'], ['Mohammadpur', 'Dhaka'],
    ['Badda', 'Dhaka'], ['Motijheel', 'Dhaka'], ['Tongi', 'Gazipur'], ['Fatullah', 'Narayanganj'], ['Agrabad', 'Chattogram'],
    ['Kandirpar', 'Cumilla'], ['Zindabazar', 'Sylhet'], ['Shaheb Bazar', 'Rajshahi'], ['Sonadanga', 'Khulna'],
    ['Satmatha', 'Bogura'], ['Sadar', 'Barishal'], ['Jahaj Company', 'Rangpur'], ['Ganginar Par', 'Mymensingh'],
];

// Status mix that needs no factory challan (confirmed → courier entry need issued jobs).
const STATUSES = ['delivered', 'delivered', 'delivered', 'delivered', 'shipped', 'pending', 'pending', 'cancelled', 'returned'];
const METHODS = ['cod', 'cod', 'cod', 'bkash', 'nagad'];
const REASONS = ['Customer changed mind', 'Could not reach the customer', 'Ordered twice by mistake'];

let seed = 20261023;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (a) => a[Math.floor(rnd() * a.length)];

async function add(db) {
    const orders = db.collection('orders');
    if (await orders.countDocuments({ note: MARK })) {
        console.log('Sample orders are already there — run "remove" first to add a fresh set.');
        return;
    }
    // A real hash of a random secret: these accounts exist, but nobody can sign in to them.
    const noLogin = await bcrypt.hash(require('crypto').randomBytes(24).toString('hex'), 10);

    // 30 customers; the first few order again and again. Each gets a sample account.
    const people = Array.from({ length: 30 }, (_, i) => ({ name: `Test Customer ${i + 1}`, phone: `01700000${String(100 + i)}`, _id: new mongoose.Types.ObjectId() }));
    // The demo staff who "did" things to the samples (Staff activity, Sales by staff).
    const actor = async (email) => {
        const u = await db.collection('users').findOne({ email });
        return u ? { id: u._id, name: [u.firstName, u.lastName].filter((x) => x && x !== '.').join(' '), role: u.role } : undefined;
    };
    const agency = await actor('agency@gmail.com');
    const sales = await actor('salesman@gmail.com');
    const manager = await actor('manager@gmail.com');
    const dhakaNow = Date.now() + 6 * 3600e3;
    const today = Math.floor(dhakaNow / DAY) * DAY - 6 * 3600e3; // Dhaka midnight

    const docs = Array.from({ length: 50 }, (_, i) => {
        const who = i < 14 ? people[i % 4] : pick(people);       // customers 1–4 are regulars
        const [area, city] = i < 14 ? PLACES[i % 7] : pick(PLACES);
        const daysAgo = i < 4 ? 0 : i < 7 ? 1 : Math.floor(rnd() * 60);
        const createdAt = new Date(Math.min(Date.now() - 60e3, today - daysAgo * DAY + (9 + rnd() * 13) * 3600e3));
        const lines = Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => {
            const p = pick(PRODUCTS);
            const quantity = p.division === 'mattress' ? 1 : 1 + Math.floor(rnd() * 2);
            return { name: p.name, slug: p.slug, division: p.division, size: p.size, color: '', thumbnail: '', price: p.price, cost: 0, quantity, total: p.price * quantity };
        });
        const subtotal = lines.reduce((a, l) => a + l.total, 0);
        const shippingCost = subtotal >= 5000 ? 0 : city === 'Dhaka' ? 60 : 120;
        let status = daysAgo === 0 ? 'pending' : pick(STATUSES);
        // Parcels from the last week are mostly still with the courier.
        if (status === 'delivered' && daysAgo <= 7) status = 'shipped';
        const method = pick(METHODS);
        // Sent orders: a made-up parcel with Pathao (even) or Steadfast (odd).
        let courier = {};
        if (['delivered', 'shipped', 'returned'].includes(status)) {
            const pathao = i % 2 === 0;
            const code = `TEST-${pathao ? 'PT' : 'SF'}-${1000 + i}`;
            const courierStatus = status === 'delivered' ? (pathao ? 'Delivered' : 'delivered')
                : status === 'returned' ? (pathao ? 'Return' : 'cancelled')
                    : pick(pathao ? ['Pending', 'In Transit', 'In Transit', 'On Hold'] : ['in_review', 'in_transit', 'in_transit', 'hold']);
            courier = {
                carrier: pathao ? 'Pathao' : 'Steadfast', consignmentId: code, trackingNumber: code, courierStatus,
                courierBookedAt: new Date(Math.min(Date.now() - 120e3, createdAt.getTime() + 20 * 3600e3)),
                courierCod: method === 'cod' ? subtotal + shippingCost : 0,
                courierFee: pathao ? (city === 'Dhaka' ? 60 : 120) : 0,   // Steadfast reports its charge with the payout
            };
        }
        // Who did what: manual orders taken by sales / the manager; agency confirms or cancels.
        const manual = i % 4 === 0;
        const takenBy = manual ? (i % 8 === 0 ? manager : sales) : undefined;
        const confirmer = manual ? takenBy : (i % 3 === 0 ? sales : agency);
        const at = (h) => new Date(Math.min(Date.now() - 30e3, createdAt.getTime() + h * 3600e3));
        const done = status !== 'pending';
        const confirmed = done && status !== 'cancelled';
        const steps = [
            { status: 'pending', note: manual ? 'Taken by phone' : 'Placed on the website', by: takenBy, createdAt },
            ...(confirmed ? [{ status: 'confirmed', note: 'Confirmed with the customer', by: confirmer, createdAt: at(1) }] : []),
            ...(status === 'cancelled' ? [{ status: 'cancelled', note: pick(REASONS), by: agency, createdAt: at(1) }] : []),
            ...(courier.consignmentId ? [{ status: 'shipped', note: `Sent with ${courier.carrier} · ${courier.consignmentId}`, by: sales, createdAt: courier.courierBookedAt }] : []),
            ...(['delivered', 'returned'].includes(status) ? [{ status, note: 'Sample order', createdAt: at(72) }] : []),
        ];
        const smsList = done && i % 2 === 1 ? [{
            kind: status === 'cancelled' ? 'cancelled' : 'confirmed', to: `88${who.phone}`, status: 'not_configured',
            message: status === 'cancelled' ? 'Sample: order cancelled' : 'Sample: order confirmed', providerRef: '', error: '', by: confirmer || agency, at: at(1.2),
        }] : [];
        return {
            orderId: `TEST-${String(i + 1).padStart(4, '0')}`,
            user: who._id,
            items: lines,
            shippingAddress: { fullName: who.name, phone: who.phone, email: '', address: `House ${10 + i}, Road ${1 + (i % 9)}`, area, city, postalCode: '' },
            subtotal, shippingCost, discount: 0, total: subtotal + shippingCost,
            couponCode: '', couponCodes: i % 9 === 0 ? ['EID10'] : [],
            status,
            cancelReason: status === 'cancelled' ? pick(REASONS) : '',
            cancelledAt: status === 'cancelled' ? at(1) : undefined,
            ...(status === 'cancelled' && agency ? { cancelledBy: agency } : {}),
            ...(confirmed && confirmer ? { confirmedBy: confirmer, confirmedAt: at(1) } : {}),
            ...(takenBy ? { createdBy: takenBy } : {}),
            paymentMethod: method,
            paymentStatus: method !== 'cod' && status !== 'cancelled' ? 'paid' : status === 'delivered' ? 'paid' : 'pending',
            source: manual ? 'manual' : 'website',
            note: MARK,
            adminNote: MARK,
            timeline: steps.map((st) => (st.by ? st : { status: st.status, note: st.note, createdAt: st.createdAt })),
            sms: smsList, jobs: [],
            ...courier,
            createdAt, updatedAt: createdAt,
        };
    });

    // Two sample payouts: half the delivered Steadfast parcels (pulled "from the API") and
    // half the delivered Pathao ones (written in by hand).
    const payoutsCol = db.collection('courierpayouts');
    const payouts = [];
    for (const [carrier, ref, source] of [['steadfast', 'TEST-SF-PAYOUT-1', 'api'], ['pathao', 'TEST-PT-INV-1', 'manual']]) {
        const done = docs.filter((d) => d.status === 'delivered' && (d.carrier || '').toLowerCase() === carrier);
        const settled = done.slice(0, Math.ceil(done.length / 2));
        if (!settled.length) continue;
        const _id = new mongoose.Types.ObjectId();
        for (const d of settled) {
            if (carrier === 'steadfast') d.courierFee = d.shippingAddress.city === 'Dhaka' ? 70 : 130;
            d.courierPayout = _id;
        }
        const paidAt = new Date(Math.min(Date.now() - 60e3, Math.max(...settled.map((d) => +d.courierBookedAt)) + 3 * DAY));
        settled.forEach((d) => { d.courierPaidAt = paidAt; });
        const codTotal = settled.reduce((a, d) => a + d.courierCod, 0);
        const chargeTotal = settled.reduce((a, d) => a + d.courierFee, 0);
        payouts.push({
            _id, carrier, source, reference: ref, paidAt, amount: codTotal - chargeTotal, codTotal, chargeTotal,
            parcels: settled.map((d) => ({ orderNo: d.orderId, consignmentId: d.consignmentId, cod: d.courierCod, charge: d.courierFee, returnCharge: 0, status: d.status })),
            note: MARK, createdAt: paidAt, updatedAt: paidAt,
        });
    }

    // The sample accounts: joined a minute before their first order (as a guest order makes
    // them); customers no order picked, and four extra, signed up and never ordered.
    const accounts = people.map((p, k) => {
        const first = docs.filter((d) => String(d.user) === String(p._id)).reduce((m, d) => Math.min(m, +d.createdAt), Infinity);
        const joined = Number.isFinite(first) ? new Date(first - 60e3) : new Date(Date.now() - (5 + k) * DAY);
        return { _id: p._id, name: p.name, phone: p.phone, n: k + 1, joined };
    });
    for (let k = 0; k < 4; k++) {
        accounts.push({ _id: new mongoose.Types.ObjectId(), name: `Test Signup ${k + 1}`, phone: `01700000${String(140 + k)}`, n: 31 + k, joined: new Date(Date.now() - (k * 4 + 1) * DAY) });
    }
    await db.collection('users').insertMany(accounts.map((a) => ({
        _id: a._id, firstName: a.name.split(' ').slice(0, -1).join(' '), lastName: a.name.split(' ').at(-1),
        email: `test-customer-${a.n}@sample.karmo.test`, phone: a.phone, password: noLogin, role: 'user', status: 'active',
        isEmailVerified: false, loyaltyPoints: a.n === 1 ? 250 : 0, defaultDiscount: a.n === 2 ? 5 : 0,
        createdAt: a.joined, updatedAt: a.joined,
    })));

    // Today's inquiries, spread over the morning.
    const dayStart = Math.floor((Date.now() + 6 * 3600e3) / DAY) * DAY - 6 * 3600e3;
    await db.collection('inquiries').insertMany(INQUIRIES.map(([name, message, source, page, status, note], k) => {
        const at = new Date(Math.min(Date.now() - (8 - k) * 60e3, dayStart + (9 + k * 0.6) * 3600e3));
        return {
            name, phone: SAMPLE_INQUIRY_PHONES[k], message, source, page, status, adminReply: note,
            ...(status !== 'pending' ? { handledBy: sales || { name: 'Online Sales', role: 'online_sales' }, handledAt: new Date(at.getTime() + 25 * 60e3) } : {}),
            createdAt: at, updatedAt: at,
        };
    }));

    // Career: three open jobs, and one application to each.
    const year = new Date().getFullYear();
    const jobs = JOBS.map((j, k) => {
        const at = new Date(Date.now() - (6 - k * 2) * DAY);
        const slug = j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return {
            salaryCurrency: 'BDT', salaryPeriod: 'monthly', salaryNegotiable: false, isUrgent: false, isFeatured: k === 0,
            jdFile: '', jdFileName: '', contactEmail: 'hr@karmogroup.com', contactPhone: '01713483284', metaTitle: '', metaDescription: '',
            experienceLevel: 'any', ...j,
            _id: new mongoose.Types.ObjectId(), slug, status: 'published', acceptingApplications: true,
            deadline: new Date(Date.now() + (20 + k * 5) * DAY), applicationCount: 1, views: 40 + k * 17, sample: true,
            createdAt: at, updatedAt: at,
        };
    });
    await db.collection('jobs').insertMany(jobs);
    await db.collection('applications').insertMany(APPLICANTS.map(([j, fullName, n, phone, status, designation, years, expected], k) => {
        const at = new Date(Date.now() - (3 - k) * DAY);
        return {
            job: jobs[j]._id, jobTitle: jobs[j].title, trackingId: `KG-${year}-${9101 + k}`, fullName,
            email: `applicant-${n}@sample.karmo.test`, phone, gender: k === 1 ? 'female' : 'male', district: 'Dhaka',
            presentAddress: 'Dhaka', currentDesignation: designation, currentCompany: 'Sample Ltd.', totalExperience: years,
            expectedSalary: expected, noticePeriod: '1 month', skills: jobs[j].skills, experiences: [], educations: [],
            cvUrl: `/demo/demo-cv-${n}.pdf`, cvFileName: `demo-cv-${n}.pdf (1 KB)`, photoUrl: '', coverLetterUrl: '', portfolioFileUrl: '',
            certificates: [], coverLetterText: `I would like to apply for ${jobs[j].title}.`, linkedinUrl: '', portfolioUrl: '', references: '',
            status, adminNotes: status === 'shortlisted' ? 'Good experience — call for interview.' : '', rating: status === 'shortlisted' ? 4 : 0,
            isStarred: status === 'shortlisted', source: 'website', createdAt: at, updatedAt: at,
        };
    }));

    const res = await orders.insertMany(docs);
    if (payouts.length) await payoutsCol.insertMany(payouts);
    console.log(`Added ${res.insertedCount} sample orders (TEST-0001 … TEST-0050), ${docs.filter((d) => d.carrier).length} with courier data, ${payouts.length} sample payouts, ${accounts.length} sample customers, ${INQUIRIES.length} sample inquiries, ${JOBS.length} sample jobs and ${APPLICANTS.length} applications.`);
}

async function remove(db) {
    const res = await db.collection('orders').deleteMany({ note: MARK, orderId: /^TEST-/ });
    const pay = await db.collection('courierpayouts').deleteMany({ note: MARK, reference: /^TEST-/ });
    const people = await db.collection('users').deleteMany({ role: 'user', email: SAMPLE_EMAIL });
    const asks = await db.collection('inquiries').deleteMany({ phone: { $in: SAMPLE_INQUIRY_PHONES } });
    const sampleJobs = await db.collection('jobs').find({ sample: true }).project({ _id: 1 }).toArray();
    const apps = await db.collection('applications').deleteMany({ $or: [{ email: SAMPLE_EMAIL }, { job: { $in: sampleJobs.map((j) => j._id) } }] });
    const jobsGone = await db.collection('jobs').deleteMany({ sample: true });
    console.log(`Removed ${res.deletedCount} sample orders, ${pay.deletedCount} sample payouts, ${people.deletedCount} sample customers, ${asks.deletedCount} sample inquiries, ${jobsGone.deletedCount} sample jobs and ${apps.deletedCount} applications.`);
}

(async () => {
    const cmd = process.argv[2];
    if (!['add', 'remove'].includes(cmd)) {
        console.log('Use: node scripts/sample-orders.js add | remove');
        process.exit(1);
    }
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set (backend/.env).');
    await mongoose.connect(process.env.DATABASE_URL);
    try {
        await (cmd === 'add' ? add : remove)(mongoose.connection.db);
    } finally {
        await mongoose.disconnect();
    }
})().catch((e) => { console.error(e.message || e); process.exit(1); });
