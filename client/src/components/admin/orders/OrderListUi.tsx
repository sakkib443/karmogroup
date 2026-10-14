"use client";

/**
 * Small pieces for the Orders list: a dropdown that is position:fixed (so the table's
 * scroll container never clips it), the coloured status / payment pills built on it,
 * and the menu rows they share.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LuCheck, LuChevronDown } from 'react-icons/lu';
import { cx } from '@/components/admin/ui';

export function Dropdown({ button, buttonClassName, buttonStyle, ariaLabel, title, disabled, width = 208, align = 'left', children }: {
    button: React.ReactNode;
    buttonClassName?: string;
    buttonStyle?: React.CSSProperties;
    ariaLabel?: string;
    title?: string;
    disabled?: boolean;
    width?: number;
    align?: 'left' | 'right';
    children: (close: () => void) => React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!open || !btnRef.current) return;
        const r = btnRef.current.getBoundingClientRect();
        const h = menuRef.current?.offsetHeight || 240;
        const below = r.bottom + 6 + h <= window.innerHeight;
        const left = align === 'right' ? r.right - width : r.left;
        setPos({
            top: below ? r.bottom + 6 : Math.max(8, r.top - h - 6),
            left: Math.max(8, Math.min(window.innerWidth - width - 8, left)),
        });
    }, [open, width, align]);

    useEffect(() => {
        if (!open) return;
        const inside = (t: EventTarget | null) => !!t && (menuRef.current?.contains(t as Node) || btnRef.current?.contains(t as Node));
        const onDown = (e: Event) => { if (!inside(e.target)) setOpen(false); };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        const onScroll = (e: Event) => { if (!menuRef.current?.contains(e.target as Node)) setOpen(false); };
        const onResize = () => setOpen(false);
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onResize);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onResize);
        };
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                aria-label={ariaLabel}
                aria-expanded={open}
                title={title}
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className={buttonClassName}
                style={buttonStyle}
            >
                {button}
            </button>
            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    style={{ position: 'fixed', top: pos?.top ?? -9999, left: pos?.left ?? -9999, width }}
                    className="z-[200] max-h-[70vh] overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                >
                    {children(() => setOpen(false))}
                </div>
            )}
        </>
    );
}

export function MenuItem({ onClick, icon, children, hint, active, danger, color }: {
    onClick: () => void; icon?: React.ReactNode; children: React.ReactNode; hint?: string; active?: boolean; danger?: boolean; color?: string;
}) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onClick}
            className={cx(
                'flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm transition',
                danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50',
                active && 'bg-gray-50 font-medium text-gray-900',
            )}
        >
            {color && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />}
            {icon && <span className="shrink-0 text-gray-400">{icon}</span>}
            <span className="min-w-0 flex-1 truncate">
                {children}
                {hint && <span className="block truncate text-xs font-normal text-gray-400">{hint}</span>}
            </span>
            {active && <LuCheck size={14} className="shrink-0 text-gray-500" />}
        </button>
    );
}

export const MenuLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{children}</p>
);

export const MenuDivider = () => <div className="my-1 h-px bg-gray-100" />;

export type PillOption = { value: string; label: string; color: string; group?: string };

/**
 * A status shown as a quiet pill — white, grey outline, a small coloured dot — that
 * opens a menu to change it.
 */
export function PillSelect({ value, options, onChange, ariaLabel, disabled, fallbackLabel }: {
    value: string;
    options: PillOption[];
    onChange: (v: string) => void;
    ariaLabel?: string;
    disabled?: boolean;
    fallbackLabel?: string;
}) {
    const current = options.find((o) => o.value === value);
    const color = current?.color || '#9CA3AF';
    const label = current?.label || fallbackLabel || value;

    const pill = cx(
        'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md border border-gray-200 bg-white pl-2.5 pr-2 text-xs font-medium text-gray-700 transition',
        !disabled && 'hover:border-gray-300 hover:bg-gray-50',
        disabled && 'cursor-default pr-2.5',
    );
    const dot = <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />;

    if (disabled) return <span className={pill}>{dot}{label}</span>;

    return (
        <Dropdown
            ariaLabel={ariaLabel}
            buttonClassName={pill}
            width={200}
            button={<>
                {dot}
                {label}
                <LuChevronDown size={13} className="text-gray-400" />
            </>}
        >
            {(close) => options.map((o, i) => {
                const header = o.group && o.group !== options[i - 1]?.group ? o.group : null;
                return (
                    <React.Fragment key={o.value}>
                        {header && <>{i > 0 && <MenuDivider />}<MenuLabel>{header}</MenuLabel></>}
                        <MenuItem color={o.color} active={o.value === value} onClick={() => { close(); if (o.value !== value) onChange(o.value); }}>
                            {o.label}
                        </MenuItem>
                    </React.Fragment>
                );
            })}
        </Dropdown>
    );
}
