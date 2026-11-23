"use client";

import React, { useState, useEffect } from 'react';
import {
    useGetAdminCountersQuery,
    useBulkUpdateCountersMutation,
    useCreateCounterMutation,
    useDeleteCounterMutation,
    CounterItem,
} from '@/redux/api/counterApi';
import { PageHeader, Btn, Badge, cx } from '@/components/admin/ui';
import {
    LuAward,
    LuFactory,
    LuUsers,
    LuShieldCheck,
    LuZap,
    LuTrendingUp,
    LuGlobe,
    LuPackage,
    LuStar,
    LuSave,
    LuPlus,
    LuTrash2,
    LuCheck,
    LuRotateCcw,
    LuEye,
} from 'react-icons/lu';
import toast from 'react-hot-toast';

const ICON_MAP: Record<string, React.ElementType> = {
    award: LuAward,
    factory: LuFactory,
    users: LuUsers,
    shield: LuShieldCheck,
    zap: LuZap,
    'trending-up': LuTrendingUp,
    globe: LuGlobe,
    package: LuPackage,
    star: LuStar,
};

const ICON_OPTIONS = [
    { value: 'award', label: 'Award' },
    { value: 'factory', label: 'Factory' },
    { value: 'users', label: 'Users' },
    { value: 'shield', label: 'Shield' },
    { value: 'zap', label: 'Energy / Zap' },
    { value: 'trending-up', label: 'Growth / Trending' },
    { value: 'globe', label: 'Globe' },
    { value: 'package', label: 'Package' },
    { value: 'star', label: 'Star' },
];

export default function AdminCountersPage() {
    const { data: serverCounters, isLoading, isError, refetch } = useGetAdminCountersQuery();
    const [bulkUpdate, { isLoading: isSaving }] = useBulkUpdateCountersMutation();
    const [createCounter, { isLoading: isCreating }] = useCreateCounterMutation();
    const [deleteCounter] = useDeleteCounterMutation();

    const [counters, setCounters] = useState<CounterItem[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (serverCounters && serverCounters.length > 0) {
            setCounters(serverCounters);
            setHasChanges(false);
        }
    }, [serverCounters]);

    const handleChange = (index: number, field: keyof CounterItem, value: any) => {
        setCounters((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
        setHasChanges(true);
    };

    const handleSaveAll = async () => {
        try {
            await bulkUpdate(counters).unwrap();
            toast.success('All counters updated successfully!');
            setHasChanges(false);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to save counters');
        }
    };

    const handleAddNew = async () => {
        try {
            const newOrder = counters.length + 1;
            await createCounter({
                title: `Metric ${newOrder}`,
                value: 100,
                prefix: '',
                suffix: '+',
                description: 'Enter description here',
                icon: 'award',
                order: newOrder,
                isActive: true,
            }).unwrap();
            toast.success('New counter card added!');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to add counter');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this counter?')) return;
        try {
            await deleteCounter(id).unwrap();
            toast.success('Counter removed');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete');
        }
    };

    const handleReset = () => {
        if (serverCounters) {
            setCounters(serverCounters);
            setHasChanges(false);
            toast('Reset to last saved values', { icon: '🔄' });
        }
    };

    return (
        <div className="space-y-8 pb-16">
            <PageHeader
                title="Homepage Counters"
                subtitle="Manage the 4 dynamic counters on the homepage Chemicals / Warehouse section."
                actions={
                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <Btn variant="secondary" onClick={handleReset} icon={<LuRotateCcw size={15} />}>
                                Discard
                            </Btn>
                        )}
                        <Btn
                            variant="secondary"
                            onClick={handleAddNew}
                            disabled={isCreating}
                            icon={<LuPlus size={16} />}
                        >
                            Add Metric
                        </Btn>
                        <Btn
                            variant="primary"
                            onClick={handleSaveAll}
                            disabled={isSaving || !hasChanges}
                            icon={<LuSave size={16} />}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Btn>
                    </div>
                }
            />

            {/* Live Visual Preview Section */}
            <div className="rounded-2xl border border-gray-200 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/20 text-brand">
                            <LuEye size={16} />
                        </span>
                        <div>
                            <h2 className="text-sm font-semibold tracking-wide uppercase text-white">
                                Live Preview (Homepage 2x2 Grid)
                            </h2>
                            <p className="text-xs text-white/50">
                                This is how these cards look right now over the warehouse photo
                            </p>
                        </div>
                    </div>
                    {hasChanges && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                            Unsaved live changes
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                    {counters.map((c, i) => (
                        <div
                            key={c._id || i}
                            className={cx(
                                'relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.07] p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition-all duration-300 sm:p-6',
                                !c.isActive && 'opacity-40 grayscale'
                            )}
                        >
                            <div className="relative flex items-baseline whitespace-nowrap leading-none">
                                {c.prefix && <span className="mr-1 text-2xl font-black text-brand sm:text-3xl">{c.prefix}</span>}
                                <span className="tabular-nums font-black tracking-tight text-white text-3xl sm:text-4xl">
                                    {Number(c.value || 0).toLocaleString()}
                                </span>
                                {c.suffix && (
                                    <span className="ml-1 text-xl font-bold tracking-tight text-brand sm:text-2xl">
                                        {c.suffix}
                                    </span>
                                )}
                            </div>
                            <h3 className="mt-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white/90 sm:text-[13px]">
                                {c.title || 'Untitled Metric'}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Forms for Each Counter */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Configure Metrics</h2>
                    <span className="text-xs text-gray-500">{counters.length} counters total</span>
                </div>

                {isLoading && (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                        Loading counters...
                    </div>
                )}

                {isError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                        Could not load counters from server.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {counters.map((c, i) => (
                        <div
                            key={c._id || i}
                            className={cx(
                                'relative rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6',
                                c.isActive ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50/50'
                            )}
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        Counter #{i + 1}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={c.isActive}
                                            onChange={(e) => handleChange(i, 'isActive', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                        />
                                        Active
                                    </label>
                                    {counters.length > 1 && c._id && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(c._id)}
                                            className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                                            title="Delete counter"
                                        >
                                            <LuTrash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Title */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Title / Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={c.title || ''}
                                        onChange={(e) => handleChange(i, 'title', e.target.value)}
                                        placeholder="e.g. Years of Heritage"
                                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                {/* Value */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Count / Number
                                    </label>
                                    <input
                                        type="number"
                                        value={c.value !== undefined ? c.value : 0}
                                        onChange={(e) => handleChange(i, 'value', Number(e.target.value) || 0)}
                                        placeholder="60"
                                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                {/* Suffix */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Suffix
                                    </label>
                                    <input
                                        type="text"
                                        value={c.suffix || ''}
                                        onChange={(e) => handleChange(i, 'suffix', e.target.value)}
                                        placeholder="+ Years, + MT, %"
                                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                {/* Prefix */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Prefix (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={c.prefix || ''}
                                        onChange={(e) => handleChange(i, 'prefix', e.target.value)}
                                        placeholder="e.g. $"
                                        className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                {/* Icon selector */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Icon Style
                                    </label>
                                    <select
                                        value={c.icon || 'award'}
                                        onChange={(e) => handleChange(i, 'icon', e.target.value)}
                                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                    >
                                        {ICON_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Subtitle / Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={c.description || ''}
                                        onChange={(e) => handleChange(i, 'description', e.target.value)}
                                        placeholder="Pioneering polyurethane in Bangladesh since 1965"
                                        className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                {/* Order */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={c.order !== undefined ? c.order : i + 1}
                                        onChange={(e) => handleChange(i, 'order', Number(e.target.value) || 1)}
                                        className="h-10 w-24 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating save bar when dirty */}
                {hasChanges && (
                    <div className="sticky bottom-6 z-20 flex items-center justify-between rounded-xl bg-gray-900 p-4 text-white shadow-2xl">
                        <span className="text-sm font-medium">You have unsaved changes in counters</span>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white"
                            >
                                Discard
                            </button>
                            <Btn
                                variant="primary"
                                onClick={handleSaveAll}
                                disabled={isSaving}
                                icon={<LuSave size={15} />}
                            >
                                {isSaving ? 'Saving...' : 'Save All Changes'}
                            </Btn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
