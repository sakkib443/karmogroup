"use client";

/**
 * The courier pages' header card: title, what the page is for, and which couriers are
 * connected. (The pages themselves are reached from the sidebar.)
 */
import React from 'react';
import { LuTruck, LuCircleCheck } from 'react-icons/lu';

export default function CourierTabs({ title, subtitle, status, right }: {
    title: React.ReactNode;
    subtitle: React.ReactNode;
    /** Connected couriers, shown on the right of the header. */
    status?: { pathao: boolean; steadfast: boolean };
    right?: React.ReactNode;
}) {
    const connected = status ? (['pathao', 'steadfast'] as const).filter((c) => status[c]).map((c) => (c === 'pathao' ? 'Pathao' : 'Steadfast')) : [];

    return (
        <div className="mb-5">
            <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                        <LuTruck size={20} />
                    </span>
                    <div className="min-w-0">
                        <h1 className="text-[17px] font-semibold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {connected.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <LuCircleCheck size={14} /> Connected · {connected.join(' + ')}
                        </span>
                    )}
                    {right}
                </div>
            </section>
        </div>
    );
}
