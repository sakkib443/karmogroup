/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux';
import { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, updateCartItemVariant, CartItem } from '@/redux/slices/cartSlice';
import { saveForLater, removeFromSaved, hydrateSaved } from '@/redux/slices/savedForLaterSlice';
import { LuTrash2, LuChevronLeft, LuTriangleAlert, LuMinus, LuPlus, LuX, LuCheck, LuBookmark, LuHeart, LuChevronRight } from 'react-icons/lu';
import { ShopHeader, LeafRule, TrustRow, BagIcon, LockIcon, TruckIcon, TagIcon, ORANGE, tk } from '@/components/karmo/shop/ShopChrome';
import { toast } from 'react-hot-toast';
import { useValidateCouponMutation } from '@/redux/api/couponApi';
import { useGetShippingQuoteQuery, useGetShippingSettingsQuery } from '@/redux/api/shippingApi';
import { useGetProductByIdQuery } from '@/redux/api/productApi';
import {
    type AppliedCoupon,
    loadAppliedCoupons, saveAppliedCoupons,
    couponDiscountTotal, couponHasFreeShipping,
} from '@/lib/coupons';

const SELECTED_STORAGE_KEY = 'karmogroup_selected_cart';

// Resolve common colour names to a CSS hex so the swatch dot always renders.
const COLOR_HEX_MAP: Record<string, string> = {
    red: '#FF0000', orange: '#FF8C00', yellow: '#FFD700', green: '#00C853', blue: '#2196F3',
    black: '#000000', white: '#FFFFFF', pink: '#FF69B4', purple: '#9C27B0', brown: '#795548',
    gray: '#9E9E9E', grey: '#9E9E9E', navy: '#001F3F', teal: '#009688', maroon: '#800000',
    olive: '#808000', cyan: '#00BCD4', lime: '#76FF03', coral: '#FF7F50', gold: '#FFD700',
    silver: '#C0C0C0', beige: '#F5F5DC', cream: '#FFFDD0', khaki: '#F0E68C',
};
const resolveHex = (value?: string) => {
    if (!value) return '';
    return COLOR_HEX_MAP[value.toLowerCase()] || value;
};

type ColorSwatch = { name: string; hex: string };

/**
 * Inline variant editor for one cart line.
 * Fetches the line's product, surfaces its colour/size options, lets the shopper
 * change them right in the cart, and reports back whether a required choice is
 * still missing (so the page can block checkout until it's resolved).
 */
const CartItemVariants = ({
    item,
    onStatusChange,
}: {
    item: CartItem;
    onStatusChange: (id: string, incomplete: boolean) => void;
}) => {
    const dispatch = useAppDispatch();
    // Karmo's mattresses and foam are configured on their own page and carry a slug, not a
    // product id — there is nothing to look up for them (and no colour/size to pick here).
    const isDbProduct = /^[a-f0-9]{24}$/i.test(item.productId || '');
    const { data: productRes } = useGetProductByIdQuery(item.productId, { skip: !isDbProduct });
    const product = (productRes as any)?.data;

    const variants: any[] = product?.variants || [];
    const hasVariants = variants.length > 0;

    // Colour options — from variants, else the legacy colors[] array.
    const colorSwatches: ColorSwatch[] = useMemo(() => {
        if (!product) return [];
        if (hasVariants) {
            const map = new Map<string, string>();
            variants.forEach((v: any) => { if (v.color) map.set(v.color, resolveHex(v.colorHex || v.color)); });
            return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
        }
        if (product.colors?.length > 0) {
            return product.colors.map((c: string, i: number) => ({ name: c, hex: resolveHex(product.colorHex?.[i] || c) }));
        }
        return [];
    }, [product, hasVariants, variants]);

    // Size options — from variants, else the legacy sizes[] array.
    const sizeList: string[] = useMemo(() => {
        if (!product) return [];
        if (hasVariants) return [...new Set(variants.filter((v: any) => v.size).map((v: any) => v.size))] as string[];
        return product.sizes?.length > 0 ? product.sizes : [];
    }, [product, hasVariants, variants]);

    const needsColor = colorSwatches.length > 0;
    const needsSize = sizeList.length > 0;
    const incomplete = (needsColor && !item.color) || (needsSize && !item.size);

    // Tell the parent this line's status (only once the product is known).
    useEffect(() => {
        if (!product) return;
        onStatusChange(item.id, incomplete);
    }, [product, item.id, incomplete, onStatusChange]);

    // Which colours/sizes are valid given the other axis' current choice.
    const availableColors = useMemo(() => {
        if (!hasVariants || !item.size) return colorSwatches.map(c => c.name);
        return variants.filter((v: any) => v.size === item.size).map((v: any) => v.color).filter(Boolean);
    }, [hasVariants, item.size, variants, colorSwatches]);

    const availableSizes = useMemo(() => {
        if (!hasVariants || !item.color) return sizeList;
        return variants.filter((v: any) => v.color === item.color).map((v: any) => v.size).filter(Boolean);
    }, [hasVariants, item.color, variants, sizeList]);

    // Commit a colour+size pick: resolve the matching variant for price/image/hex, then dispatch.
    const apply = (color: string, size: string) => {
        let nextSize = size;
        if (hasVariants && color && nextSize) {
            const sizesForColor = variants.filter((v: any) => v.color === color).map((v: any) => v.size).filter(Boolean);
            if (sizesForColor.length > 0 && !sizesForColor.includes(nextSize)) nextSize = '';
        }

        let colorHex = resolveHex(colorSwatches.find(c => c.name === color)?.hex || color);
        let price: number | undefined;
        let mrp: number | undefined;
        let image: string | undefined;

        if (hasVariants) {
            const v = variants.find((vv: any) => (!color || vv.color === color) && (!nextSize || vv.size === nextSize));
            if (v) {
                const vd = v.discount || 0;
                price = vd > 0 ? v.price - (v.price * vd) / 100 : v.price;
                mrp = v.originalPrice || v.price;
                if (v.colorHex) colorHex = resolveHex(v.colorHex);
                if (v.images?.[0]) image = v.images[0];
            }
        }

        dispatch(updateCartItemVariant({
            id: item.id,
            color: color || undefined,
            colorHex: colorHex || undefined,
            size: nextSize || undefined,
            price,
            mrp,
            image,
        }));
    };

    // Product without selectable variants → keep the original read-only badges (no regression).
    if (!needsColor && !needsSize) {
        if (!item.color && !item.size) return null;
        return (
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {item.color && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink/50 bg-cream/60 px-2 py-0.5 rounded border border-ink/8">
                        <span className="w-2 h-2 border border-ink/12" style={{ background: item.colorHex || '#ccc' }} />
                        {item.color}
                    </span>
                )}
                {item.size && (
                    <span className="text-xs text-ink/50 bg-cream/60 px-2 py-0.5 rounded border border-ink/8">{item.size}</span>
                )}
            </div>
        );
    }

    return (
        <div className={`mt-2 rounded-none ${incomplete ? 'border border-amber-300 bg-amber-50/50 p-2' : ''}`}>
            {needsColor && (
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[11px] font-medium text-ink/50 w-10">Color</span>
                    {item.color && <span className="text-[11px] font-semibold text-ink">{item.color}</span>}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {colorSwatches.map((c) => {
                            const selected = item.color === c.name;
                            const disabled = !availableColors.includes(c.name);
                            return (
                                <button
                                    key={c.name}
                                    type="button"
                                    title={c.name}
                                    disabled={disabled}
                                    onClick={() => apply(c.name, item.size || '')}
                                    className="w-6 h-6 flex-shrink-0 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                                    style={{
                                        background: c.hex,
                                        border: selected ? '2px solid #D44348' : '1.5px solid #d1d5db',
                                        boxShadow: selected ? '0 0 0 2px rgba(212,67,72,0.2)' : 'none',
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
            {needsSize && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-ink/50 w-10">Size</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {sizeList.map((s) => {
                            const selected = item.size === s;
                            const disabled = !availableSizes.includes(s);
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => apply(item.color || '', s)}
                                    className={`min-w-[30px] h-7 px-2 rounded text-[11px] font-semibold transition-all disabled:opacity-35 disabled:cursor-not-allowed ${
                                        selected
                                            ? 'border-2 border-brand text-brand bg-brand/[0.08]'
                                            : 'border border-ink/20 text-ink/80 bg-white hover:border-gray-400'
                                    }`}
                                >
                                    {s}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            {incomplete && (
                <p className="mt-1.5 text-[11px] font-medium text-amber-700 flex items-center gap-1">
                    <LuTriangleAlert size={11} />
                    Please choose {needsColor && !item.color ? 'a color' : ''}{needsColor && !item.color && needsSize && !item.size ? ' and ' : ''}{needsSize && !item.size ? 'a size' : ''} to continue
                </p>
            )}
        </div>
    );
};

const CartPage = () => {
    const { items, totalPrice, totalQuantity } = useAppSelector((state) => state.cart);
    const savedItems = useAppSelector((state) => state.savedForLater.items);
    const dispatch = useAppDispatch();
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState('');
    // Multiple coupons can be stacked on one order (percentage / fixed / free-shipping).
    const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>([]);
    const [couponError, setCouponError] = useState('');
    const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation();

    // ─── Per-item selection (Daraz-style "Select All") ──
    // New items start selected; deselected items stay deselected across re-renders.
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const knownIdsRef = useRef<string[]>([]);
    useEffect(() => {
        const ids = items.map(i => i.id);
        const newOnes = ids.filter(id => !knownIdsRef.current.includes(id));
        setSelectedIds(prev => Array.from(new Set([...prev.filter(id => ids.includes(id)), ...newOnes])));
        knownIdsRef.current = ids;
    }, [items]);

    const isSelected = (id: string) => selectedIds.includes(id);
    const allSelected = items.length > 0 && selectedIds.length === items.length;
    const toggleItem = (id: string) =>
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    const toggleAll = () => setSelectedIds(allSelected ? [] : items.map(i => i.id));

    const selectedItems = items.filter(i => selectedIds.includes(i.id));
    const selectedSubtotal = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const selectedQty = selectedItems.reduce((s, i) => s + i.quantity, 0);

    // ─── Variant completeness (color/size) reported by each line ──
    // A line with variation options but no choice made blocks checkout.
    const [variantIssues, setVariantIssues] = useState<Record<string, boolean>>({});
    const reportVariantStatus = useCallback((id: string, incomplete: boolean) => {
        setVariantIssues(prev => (prev[id] === incomplete ? prev : { ...prev, [id]: incomplete }));
    }, []);
    const incompleteSelected = selectedItems.filter(i => variantIssues[i.id]);
    const hasVariantIssues = incompleteSelected.length > 0;
    const canCheckout = selectedIds.length > 0 && !hasVariantIssues;

    const deleteSelected = () => {
        if (selectedIds.length === 0) return;
        selectedIds.forEach(id => dispatch(removeFromCart(id)));
        setSelectedIds([]);
        toast.success('Selected items removed');
    };
    // Hand the selected ids to the checkout page so only chosen items are ordered.
    const goCheckout = () => {
        try { localStorage.setItem(SELECTED_STORAGE_KEY, JSON.stringify(selectedIds)); } catch {}
    };

    // Restore saved coupons on mount
    useEffect(() => {
        setAppliedCoupons(loadAppliedCoupons());
    }, []);

    // Hydrate the saved-for-later list from localStorage on mount
    useEffect(() => {
        dispatch(hydrateSaved());
    }, [dispatch]);

    // Move a line from the cart into the saved-for-later list
    const handleSaveForLater = (item: typeof items[number]) => {
        dispatch(saveForLater(item));
        dispatch(removeFromCart(item.id));
        toast.success('Saved for later');
    };

    // Move a saved item back into the cart
    const handleMoveToCart = (item: typeof savedItems[number]) => {
        dispatch(addToCart(item));
        dispatch(removeFromSaved(item.id));
        toast.success('Moved to cart');
    };

    const persistCoupons = (list: AppliedCoupon[]) => {
        setAppliedCoupons(list);
        saveAppliedCoupons(list);
    };

    const handleApplyCoupon = async () => {
        const code = couponCode.trim().toUpperCase();
        if (!code) return;
        setCouponError('');
        // Guard: don't add the same coupon twice.
        if (appliedCoupons.some((c) => c.code === code)) {
            setCouponError('This coupon is already applied');
            return;
        }
        try {
            const items = selectedItems.map((i: any) => ({ product: i.productId, price: i.price, quantity: i.quantity }));
            const result = await validateCoupon({ code, orderAmount: selectedSubtotal, items }).unwrap();
            const freeShipping = Boolean(result.data?.freeShipping ?? result.freeShipping);
            // Guard: only one free-shipping coupon is meaningful per order.
            if (freeShipping && couponHasFreeShipping(appliedCoupons)) {
                setCouponError('A free-shipping coupon is already applied');
                return;
            }
            const couponData: AppliedCoupon = {
                code,
                discount: result.data?.discount ?? result.discount ?? 0,
                message: result.data?.message ?? result.message ?? 'Coupon applied!',
                freeShipping,
            };
            persistCoupons([...appliedCoupons, couponData]);
            setCouponCode('');
            toast.success('Coupon applied successfully!');
        } catch (err: any) {
            const msg = err?.data?.message || 'Invalid or expired coupon code';
            setCouponError(msg);
            toast.error(msg);
        }
    };

    const handleRemoveCoupon = (code: string) => {
        persistCoupons(appliedCoupons.filter((c) => c.code !== code));
        setCouponError('');
    };

    // ─── Estimated shipping (no city yet → backend returns the default flat rate) ──
    const { data: shippingQuote } = useGetShippingQuoteQuery(
        { subtotal: selectedSubtotal },
        { skip: selectedSubtotal <= 0 },
    );
    const couponFreeShipping = couponHasFreeShipping(appliedCoupons);
    const couponDiscount = couponDiscountTotal(appliedCoupons);
    const freeShipping = couponFreeShipping || (shippingQuote?.freeShipping ?? (selectedSubtotal >= 5000));
    const shippingCost = freeShipping ? 0 : (shippingQuote?.shippingCost ?? (selectedSubtotal >= 5000 ? 0 : 120));

    // Live free-shipping threshold → "add ৳X more for free shipping" nudge.
    const { data: shipSettings } = useGetShippingSettingsQuery();
    const freeThreshold = shipSettings?.freeShippingByThresholdEnabled ? (shipSettings?.freeShippingThreshold || 0) : 0;
    const remainingForFree = freeThreshold > 0 && !freeShipping ? Math.max(0, freeThreshold - selectedSubtotal) : 0;

    // Total = (subtotal − total coupon discount, floored at 0) + estimated shipping
    const baseAmount = Math.max(0, selectedSubtotal - couponDiscount);
    const finalTotal = baseAmount + shippingCost;
    // What the order would cost with no coupons — shown struck-through when any coupon applies.
    const originalShipping = couponFreeShipping
        ? (shippingQuote?.shippingCost ?? (selectedSubtotal >= 5000 ? 0 : 120))
        : shippingCost;
    const preDiscountTotal = selectedSubtotal + originalShipping;

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            dispatch(clearCart());
            toast.success('Cart cleared');
        }
    };

    /* ═══ SAVED FOR LATER (shared between empty + filled bag) ═══ */
    const savedSection = savedItems.length > 0 && (
        <section className="overflow-hidden rounded-md border border-ink/10 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-5 py-4">
                <h2 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
                    <LuHeart size={15} className="text-brand" /> Saved for later
                </h2>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">{savedItems.length} item{savedItems.length > 1 ? 's' : ''}</span>
            </div>
            <ul className="divide-y divide-ink/8">
                {savedItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-ink/8 bg-[#f3f1ec]">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="display line-clamp-1 text-[13px] font-semibold uppercase tracking-[0.04em] text-ink">{item.name}</p>
                            <p className="mt-0.5 text-xs text-ink/45">{[item.color, item.size].filter(Boolean).join(' · ')}</p>
                            <p className="mt-1 text-sm font-semibold text-brand">{tk(item.price)}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                            <button onClick={() => handleMoveToCart(item)} className="inline-flex h-9 items-center gap-1.5 bg-ink px-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand">
                                <BagIcon className="h-4 w-4" accent="#ffffff" /> Move to bag
                            </button>
                            <button onClick={() => dispatch(removeFromSaved(item.id))} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40 hover:text-brand">
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );

    const checkoutLabel = hasVariantIssues ? 'Choose options first' : canCheckout ? `Checkout · ${selectedIds.length}` : 'Select an item';

    /* ═══ EMPTY BAG ═══ */
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <ShopHeader eyebrow="Karmo · Shopping bag" title="Your" accent="bag" step={1} />
                <div className="mx-auto w-full max-w-[1760px] px-5 sm:px-8 md:px-10 lg:px-12 py-12 lg:py-16">
                    <div className="mx-auto max-w-2xl rounded-md border border-ink/10 bg-white px-6 py-12 text-center">
                        <span className="mx-auto flex h-20 w-20 items-center justify-center bg-[#f5f3ef] text-ink/60">
                            <BagIcon className="h-11 w-11" />
                        </span>
                        <h2 className="display mt-6 text-[1.35rem] font-light uppercase tracking-[0.02em] text-ink">Your bag is empty</h2>
                        <LeafRule align="center" />
                        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink/55">
                            Foam, mattresses and HomeTex — pick what fits your home and it waits here for you.
                        </p>
                        <div className="mt-7 flex flex-wrap justify-center gap-3">
                            <Link href="/mattress" className="inline-flex h-12 items-center gap-2 bg-brand px-7 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark">
                                Shop mattresses <LuChevronRight size={16} />
                            </Link>
                            <Link href="/foam" className="inline-flex h-12 items-center gap-2 border border-ink/15 px-7 text-[12px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink/40">
                                Shop foam
                            </Link>
                        </div>
                        <div className="mx-auto mt-10 max-w-md border-t border-ink/8 pt-8">
                            <TrustRow />
                        </div>
                    </div>
                    {savedSection ? <div className="mx-auto mt-6 max-w-2xl">{savedSection}</div> : null}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-28 lg:pb-20">
            <ShopHeader
                eyebrow="Karmo · Shopping bag"
                title="Your"
                accent="bag"
                step={1}
                sub={`${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'} ready for checkout`}
            />

            <div className="mx-auto w-full max-w-[1760px] px-5 sm:px-8 md:px-10 lg:px-12 py-8 lg:py-12">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start xl:gap-12">

                    {/* ═══ ITEMS ═══ */}
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-3">
                            <button onClick={toggleAll} className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/80">
                                <span className={`flex h-[18px] w-[18px] items-center justify-center border transition-colors ${allSelected ? 'border-brand bg-brand' : 'border-ink/25 bg-white'}`}>
                                    {allSelected && <LuCheck size={12} className="text-white" />}
                                </span>
                                Select all ({items.length})
                            </button>
                            <div className="flex items-center gap-5">
                                <button onClick={deleteSelected} disabled={selectedIds.length === 0}
                                    className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45 transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-ink/45">
                                    Remove selected
                                </button>
                                <button onClick={handleClearCart} className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45 transition-colors hover:text-brand">
                                    Clear bag
                                </button>
                            </div>
                        </div>

                        <ul className="divide-y divide-ink/8">
                            {items.map((item) => {
                                const selected = isSelected(item.id);
                                const save = item.mrp && item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
                                return (
                                    <li key={item.id} className={`group relative flex gap-4 py-6 transition-opacity sm:gap-5 ${selected ? '' : 'opacity-60'}`}>
                                        <button onClick={() => toggleItem(item.id)} className="mt-1 shrink-0 self-start sm:self-center" aria-label={selected ? 'Leave out of this order' : 'Include in this order'}>
                                            <span className={`flex h-[18px] w-[18px] items-center justify-center border transition-colors ${selected ? 'border-brand bg-brand' : 'border-ink/25 bg-white'}`}>
                                                {selected && <LuCheck size={12} className="text-white" />}
                                            </span>
                                        </button>

                                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-ink/8 bg-[#f3f1ec] sm:h-32 sm:w-32">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]" />
                                            {save > 0 ? (
                                                <span className="absolute left-0 top-0 bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">−{save}%</span>
                                            ) : null}
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    {item.category ? <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">{item.category}</span> : null}
                                                    <h3 className="display mt-0.5 line-clamp-2 text-[14px] font-semibold uppercase leading-snug tracking-[0.03em] text-ink sm:text-[15px]">{item.name}</h3>
                                                </div>
                                                <div className="flex shrink-0 items-start gap-3">
                                                    <p className="text-right">
                                                        <span className="block text-base font-bold tabular-nums text-ink sm:text-lg">{tk(item.price * item.quantity)}</span>
                                                        {item.quantity > 1 ? <span className="block text-[11px] text-ink/40">{tk(item.price)} each</span> : null}
                                                    </p>
                                                    {/* Delete — always in view, top-right of every line */}
                                                    <button onClick={() => setDeleteConfirmId(item.id)} aria-label={`Remove ${item.name}`} title="Remove from cart"
                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink/12 bg-white text-ink/50 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                                                        <LuTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <CartItemVariants item={item} onStatusChange={reportVariantStatus} />

                                            <div className="mt-1.5 flex items-baseline gap-2 text-sm">
                                                <span className="font-semibold text-brand">{tk(item.price)}</span>
                                                {item.mrp && item.mrp > item.price ? <span className="text-xs text-ink/35 line-through">{tk(item.mrp)}</span> : null}
                                            </div>

                                            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-3">
                                                <div className="flex h-9 items-center overflow-hidden rounded-sm border border-ink/15 bg-white">
                                                    <button onClick={() => dispatch(decreaseQuantity(item.id))} disabled={item.quantity <= 1} aria-label="Decrease quantity"
                                                        className="flex h-full w-9 items-center justify-center text-ink/60 transition-colors hover:bg-[#f5f3ef] disabled:cursor-not-allowed disabled:opacity-30">
                                                        <LuMinus size={13} />
                                                    </button>
                                                    <span className="flex h-full w-10 items-center justify-center border-x border-ink/15 text-sm font-bold tabular-nums text-ink">{item.quantity}</span>
                                                    <button onClick={() => dispatch(increaseQuantity(item.id))} disabled={item.quantity >= 99} aria-label="Increase quantity"
                                                        className="flex h-full w-9 items-center justify-center text-ink/60 transition-colors hover:bg-[#f5f3ef] disabled:cursor-not-allowed disabled:opacity-30">
                                                        <LuPlus size={13} />
                                                    </button>
                                                </div>
                                                <button onClick={() => handleSaveForLater(item)} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/45 transition-colors hover:text-brand">
                                                    <LuBookmark size={12} /> Save for later
                                                </button>
                                                <button onClick={() => setDeleteConfirmId(item.id)} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red-500/80 transition-colors hover:text-red-600">
                                                    <LuTrash2 size={13} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="border-t border-ink/10 pt-5">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/55 transition-colors hover:text-brand">
                                <LuChevronLeft size={14} /> Continue shopping
                            </Link>
                        </div>

                        {savedSection ? <div className="mt-8">{savedSection}</div> : null}
                    </div>

                    {/* ═══ SUMMARY ═══ */}
                    <aside className="lg:sticky lg:top-[150px]">
                        <div className="relative overflow-hidden rounded-md border border-ink/10 bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                            <div className="relative px-6 pb-6 pt-7">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Summary</span>
                                <h2 className="display mt-1.5 text-[1.3rem] font-light uppercase tracking-[0.02em] text-ink">Your order</h2>

                                {/* Free delivery progress */}
                                {freeThreshold > 0 ? (
                                    <div className="mt-5 rounded-sm border border-ink/10 bg-gray-50 px-4 py-3">
                                        <p className="flex items-center gap-2 text-[13px] font-medium text-ink/75">
                                            <TruckIcon className="h-5 w-5 shrink-0" />
                                            {freeShipping ? <>Free delivery unlocked</> : <>Add <b className="font-bold text-ink">{tk(remainingForFree)}</b> more for free delivery</>}
                                        </p>
                                        <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-ink/10">
                                            <span className="block h-full transition-all duration-500" style={{ width: `${freeShipping ? 100 : Math.min(100, (selectedSubtotal / freeThreshold) * 100)}%`, backgroundColor: ORANGE }} />
                                        </span>
                                    </div>
                                ) : null}

                                {/* Coupon */}
                                <div className="mt-5">
                                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55"><TagIcon className="h-3.5 w-3.5" /> Coupon</p>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                            onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                            placeholder="Enter code"
                                            className="h-11 min-w-0 flex-1 rounded-l-sm border border-[#d1d5db] bg-white px-3.5 text-sm uppercase text-ink outline-none transition-colors placeholder:normal-case placeholder:text-ink/35 focus:border-brand"
                                        />
                                        <button onClick={handleApplyCoupon} disabled={isValidating || !couponCode.trim()}
                                            className="h-11 shrink-0 rounded-r-sm bg-ink px-5 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40">
                                            {isValidating ? '…' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <p className="mt-1.5 text-xs text-brand">{couponError}</p>}
                                    {appliedCoupons.length > 0 && (
                                        <ul className="mt-2.5 space-y-1.5">
                                            {appliedCoupons.map((c) => (
                                                <li key={c.code} className="flex items-center justify-between gap-2 rounded-sm border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2">
                                                    <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-[#15803d]">
                                                        <LuCheck size={12} className="shrink-0" />
                                                        <span className="truncate">{c.code}</span>
                                                        <span className="shrink-0 font-medium text-ink/45">{c.freeShipping && c.discount === 0 ? 'Free delivery' : `−${tk(c.discount || 0)}`}</span>
                                                    </span>
                                                    <button onClick={() => handleRemoveCoupon(c.code)} aria-label={`Remove ${c.code}`} className="text-ink/35 hover:text-brand"><LuX size={13} /></button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Totals */}
                                <dl className="mt-6 space-y-2.5 border-t border-[#eee] pt-5 text-[14px]">
                                    <div className="flex justify-between"><dt className="text-ink/60">Subtotal ({selectedQty} {selectedQty === 1 ? 'item' : 'items'})</dt><dd className="tabular-nums">{tk(selectedSubtotal)}</dd></div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-[#15803d]"><dt>Coupon discount</dt><dd className="tabular-nums">−{tk(couponDiscount)}</dd></div>
                                    )}
                                    <div className="flex justify-between">
                                        <dt className="text-ink/60">Delivery <span className="block text-[11px] text-ink/35">Exact charge at checkout</span></dt>
                                        <dd className={freeShipping ? 'font-semibold text-[#15803d]' : 'tabular-nums'}>{freeShipping ? 'Free' : tk(shippingCost)}</dd>
                                    </div>
                                </dl>
                                <div className="mt-5 flex items-end justify-between border-t border-[#eee] pt-5">
                                    <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink/70">Total</span>
                                    <span className="text-right">
                                        {(couponDiscount > 0 || couponFreeShipping) && preDiscountTotal > finalTotal ? (
                                            <span className="block text-[14px] text-[#9ca3af] line-through">{tk(preDiscountTotal)}</span>
                                        ) : null}
                                        <span className="text-[1.65rem] font-bold leading-none tabular-nums tracking-tight text-brand sm:text-[1.85rem]">{tk(finalTotal)}</span>
                                    </span>
                                </div>

                                {hasVariantIssues && (
                                    <p className="mt-4 flex items-start gap-2 border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                        <LuTriangleAlert size={14} className="mt-0.5 shrink-0" />
                                        {incompleteSelected.length} selected item{incompleteSelected.length > 1 ? 's need' : ' needs'} a colour or size.
                                    </p>
                                )}

                                {canCheckout ? (
                                    <Link href="/checkout" onClick={goCheckout}
                                        className="group mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-brand text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-brand-dark">
                                        <LockIcon className="h-4 w-4" /> {checkoutLabel}
                                        <LuChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                ) : (
                                    <button disabled className="mt-5 flex h-11 w-full cursor-not-allowed rounded-sm items-center justify-center gap-2 bg-ink/10 text-[15px] font-bold uppercase tracking-[0.06em] text-ink/35">
                                        {checkoutLabel}
                                    </button>
                                )}
                                <p className="mt-3 text-center text-[12px] text-ink/45">Cash on delivery available · Secure checkout</p>
                            </div>
                            <div className="border-t border-[#eee] px-5 py-5">
                                <TrustRow />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ═══ MOBILE CHECKOUT BAR ═══ */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-ink/12 bg-white px-4 py-3 shadow-[0_-6px_18px_rgba(0,0,0,0.06)] lg:hidden">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">Total</p>
                    <p className="text-lg font-bold leading-none tabular-nums text-ink">{tk(finalTotal)}</p>
                </div>
                {canCheckout ? (
                    <Link href="/checkout" onClick={goCheckout} className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-sm bg-brand px-6 text-[14px] font-bold uppercase tracking-[0.06em] text-white">
                        <LockIcon className="h-4 w-4" /> {checkoutLabel}
                    </Link>
                ) : (
                    <button disabled className="flex h-12 shrink-0 cursor-not-allowed items-center justify-center bg-ink/10 px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-ink/35">{checkoutLabel}</button>
                )}
            </div>

            {/* ═══ REMOVE CONFIRMATION ═══ */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4" onClick={() => setDeleteConfirmId(null)}>
                    <div className="w-full max-w-sm rounded-md bg-white p-7 text-center" onClick={(e) => e.stopPropagation()}>
                        <span className="mx-auto flex h-14 w-14 items-center justify-center bg-[#f5f3ef] text-brand"><BagIcon className="h-8 w-8" /></span>
                        <h3 className="display mt-5 text-[1.05rem] font-semibold uppercase tracking-[0.04em] text-ink">Remove this item?</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink/55">It leaves your bag. You can save it for later instead.</p>
                        <div className="mt-6 grid grid-cols-2 gap-2.5">
                            <button onClick={() => setDeleteConfirmId(null)} className="h-11 border border-ink/15 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink/40">Keep it</button>
                            <button
                                onClick={() => {
                                    dispatch(removeFromCart(deleteConfirmId));
                                    toast.success('Item removed');
                                    setDeleteConfirmId(null);
                                }}
                                className="h-11 bg-brand text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
