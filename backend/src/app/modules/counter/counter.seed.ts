import { Counter } from './counter.model';

export const DEFAULT_COUNTERS = [
    {
        title: 'Years of Heritage',
        value: 60,
        prefix: '',
        suffix: '+ Years',
        description: 'Pioneering polyurethane foam in Bangladesh since 1965',
        icon: 'award',
        order: 1,
        isActive: true,
    },
    {
        title: 'Annual Production',
        value: 50000,
        prefix: '',
        suffix: '+ MT',
        description: 'Supplying polyurethane foam & specialized chemical polymers',
        icon: 'factory',
        order: 2,
        isActive: true,
    },
    {
        title: 'Dealer Network',
        value: 750,
        prefix: '',
        suffix: '+ Points',
        description: 'Trusted nationwide footprint and dealership channels',
        icon: 'users',
        order: 3,
        isActive: true,
    },
    {
        title: 'Quality Standard',
        value: 100,
        prefix: '',
        suffix: '%',
        description: 'ISO & international standard certified formulations',
        icon: 'shield',
        order: 4,
        isActive: true,
    },
];

export async function ensureDefaultCounters(): Promise<void> {
    try {
        const count = await Counter.countDocuments();
        if (count === 0) {
            console.log('📊 Seeding initial 4 homepage counters...');
            await Counter.insertMany(DEFAULT_COUNTERS);
            console.log('✅ Initial counters seeded successfully.');
        }
    } catch (err) {
        console.error('⚠️ Failed to ensure default counters:', err);
    }
}
