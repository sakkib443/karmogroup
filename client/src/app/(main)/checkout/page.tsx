/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux';
import { removeFromCart } from '@/redux/slices/cartSlice';
import { loginSuccess } from '@/redux/slices/authSlice';
import { useCreateOrderMutation, useGuestCheckoutMutation } from '@/redux/api/orderApi';
import { useInitPaymentMutation, useGetPaymentMethodsQuery } from '@/redux/api/paymentApi';
import { useGetShippingQuoteQuery } from '@/redux/api/shippingApi';
import { useGetMyAddressesQuery, useAddAddressMutation } from '@/redux/api/userApi';
import { LuChevronLeft, LuInfo, LuCheck, LuCopy, LuCreditCard, LuUser, LuPhone, LuMapPin, LuBuilding2, LuNavigation, LuMail } from 'react-icons/lu';
import { ShopHeader, LeafRule, TrustRow, SealIcon, LockIcon, TruckIcon, TagIcon, tk } from '@/components/karmo/shop/ShopChrome';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
    type AppliedCoupon,
    loadAppliedCoupons, clearAppliedCoupons,
    couponDiscountTotal, couponHasFreeShipping,
} from '@/lib/coupons';

/**
 * Branding only. WHICH methods appear and HOW each one takes money is decided
 * by the server (GET /payments/methods), never guessed here — that guess is what
 * used to make bKash ask for a Send Money receipt *and* bounce to a gateway.
 */
type PayMode = 'gateway' | 'manual' | 'cod';
interface PayMethod {
    id: string;
    label: string;
    mode: PayMode;
    live: boolean;
    number?: string;
    accountType?: string;
}

const BRAND: Record<string, { name: string; color: string; short: string }> = {
    bkash:      { name: 'bKash',            color: '#E2136E', short: 'bK' },
    nagad:      { name: 'Nagad',            color: '#EC1C24', short: 'N' },
    rocket:     { name: 'Rocket',           color: '#8C3494', short: 'R' },
    sslcommerz: { name: 'Cards & Banking',  color: '#1F6FEB', short: '' },
    cod:        { name: 'Cash on Delivery', color: '#16a34a', short: '' },
};

const SUBLINE: Record<PayMode, (m: PayMethod) => string> = {
    gateway: (m) => (m.id === 'sslcommerz'
        ? 'Visa, Mastercard, bKash, Nagad, Rocket & more'
        : `Pay securely with ${BRAND[m.id]?.name || m.label}`),
    manual: (m) => `Send Money to our ${BRAND[m.id]?.name || m.label} number`,
    cod: () => 'Pay in cash when your order arrives',
};

const inputClass =
    "h-12 w-full px-4 bg-white border border-[#d1d5db] rounded-sm text-[15px] text-ink outline-none hover:border-ink/35 focus:border-brand focus:shadow-[0_0_0_3px_rgba(212,67,72,0.10)] transition-[border-color,box-shadow] placeholder:text-ink/35";

const labelClass =
    "block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/55 mb-1.5";

const CheckoutPage = () => {
    const allCartItems = useAppSelector((state) => state.cart.items);
    // Honor the cart's selection: only the ticked items are checked out (falls back to all).
    const items = React.useMemo(() => {
        try {
            const sel = JSON.parse(localStorage.getItem('karmogroup_selected_cart') || 'null');
            if (Array.isArray(sel) && sel.length > 0) {
                const filtered = allCartItems.filter((i: any) => sel.includes(i.id));
                if (filtered.length > 0) return filtered;
            }
        } catch {}
        return allCartItems;
    }, [allCartItems]);
    const totalPrice = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
    const [guestCheckout, { isLoading: isGuestPlacing }] = useGuestCheckoutMutation();
    const [initPayment, { isLoading: isInitiatingPayment }] = useInitPaymentMutation();

    // The server decides what may be offered and how each method collects money.
    const { data: methodsRes, isLoading: isLoadingMethods } = useGetPaymentMethodsQuery(undefined);
    // Cash on delivery first — it is what most customers choose.
    const methods: PayMethod[] = React.useMemo(() => {
        const list: PayMethod[] = methodsRes?.data?.methods || [];
        return [...list].sort((x, y) => (x.mode === 'cod' ? -1 : y.mode === 'cod' ? 1 : 0));
    }, [methodsRes]);
    const paymentInstructions: string = methodsRes?.data?.instructions || '';
    const availableIds = methods.map(m => m.id).join(',');

    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', address: '', city: '', area: '', postalCode: '',
    });

    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [paymentDetails, setPaymentDetails] = useState({
        senderNumber: '', transactionId: '', paymentTime: '',
    });
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>([]);
    // Set once an order is successfully placed → drives the success modal.
    const [placedOrder, setPlacedOrder] = useState<{ _id?: string; orderId?: string } | null>(null);

    // ─── Saved shipping addresses (set in the dashboard → auto-filled here) ──
    const { data: addrRes } = useGetMyAddressesQuery(undefined, { skip: !isAuthenticated });
    const savedAddresses: any[] = addrRes?.data || [];
    const [selectedAddressId, setSelectedAddressId] = useState<string>(''); // '' = undecided · 'new' = manual entry
    const [addAddress] = useAddAddressMutation();
    // When a logged-in user types a fresh address, save it back to their account
    // (dashboard) so it auto-fills next time. Ticked by default.
    const [saveAddress, setSaveAddress] = useState(true);

    const applyAddress = (a: any) => {
        setFormData(prev => ({
            ...prev,
            fullName: a.fullName || prev.fullName,
            phone: a.phone || prev.phone,
            address: a.address || '',
            area: a.area || '',
            city: a.city || '',
            postalCode: a.postalCode || '',
        }));
        setErrors({});
    };

    // Load coupons from the cart page (supports multiple stacked coupons)
    useEffect(() => {
        setAppliedCoupons(loadAppliedCoupons());
    }, []);
    const couponDiscount = couponDiscountTotal(appliedCoupons);
    const couponFreeShipping = couponHasFreeShipping(appliedCoupons);

    // ─── Shipping quote (debounced on city; recomputes when subtotal changes) ──
    const [debouncedCity, setDebouncedCity] = useState('');
    useEffect(() => {
        const t = setTimeout(() => setDebouncedCity(formData.city.trim()), 400);
        return () => clearTimeout(t);
    }, [formData.city]);

    const { data: shippingQuote } = useGetShippingQuoteQuery(
        { city: debouncedCity || undefined, subtotal: totalPrice },
        { skip: totalPrice <= 0 },
    );

    // Fall back to a sensible default so a number always shows while the quote loads.
    // A free-shipping coupon overrides the quote (the server applies the same rule).
    const freeShipping = couponFreeShipping || (shippingQuote?.freeShipping ?? (totalPrice >= 5000));
    const shippingCost = freeShipping ? 0 : (shippingQuote?.shippingCost ?? (totalPrice >= 5000 ? 0 : 120));
    const estimatedDays = shippingQuote?.estimatedDays ?? '3-5 days';
    const FREE_REASON_LABEL: Record<string, string> = {
        threshold: 'Order qualifies', coupon: 'Coupon applied', product: 'Free-delivery items', quantity: 'Bulk order',
    };
    const freeReasonLabel = shippingQuote?.freeReason ? FREE_REASON_LABEL[shippingQuote.freeReason] : '';

    // Fill name / email / phone from the logged-in account.
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || user.name || '',
                email: prev.email || user.email || '',
                phone: prev.phone || user.phone || '',
            }));
        }
    }, [isAuthenticated, user]);

    // Default-select a saved address (the default one, else the first) and auto-fill.
    useEffect(() => {
        if (savedAddresses.length > 0 && !selectedAddressId) {
            const def = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
            setSelectedAddressId(def._id);
            applyAddress(def);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedAddresses.length]);

    useEffect(() => {
        // Don't bounce to the cart once the order is placed — the cart is emptied
        // on success and we want the confirmation modal to stay on screen.
        if (items.length === 0 && !placedOrder) router.push('/cart');
    }, [items, router, placedOrder]);

    // Keep selected payment valid if admin hides the current method
    useEffect(() => {
        if (methods.length && !methods.some(m => m.id === selectedPayment)) {
            setSelectedPayment(methods[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableIds]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
    };

    const handlePaymentDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!formData.fullName.trim()) e.fullName = 'Full name is required';
        if (!formData.phone.trim()) e.phone = 'Phone number is required';
        else if (!/^01\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid 11-digit number';
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Enter a valid email';
        if (!formData.address.trim()) e.address = 'Address is required';
        if (!formData.city.trim()) e.city = 'City is required';
        // Only a manual "Send Money" method needs receipt details. A gateway
        // collects the money itself and COD is paid on delivery — asking either
        // for a transaction id is what made the old flow contradictory.
        if (methods.find(m => m.id === selectedPayment)?.mode === 'manual') {
            if (!paymentDetails.senderNumber.trim()) e.senderNumber = 'Sender number is required';
            if (!paymentDetails.transactionId.trim()) e.transactionId = 'Transaction ID is required';
            if (!paymentDetails.paymentTime.trim()) e.paymentTime = 'Payment time is required';
        }
        return e;
    };

    const activeMethod: PayMethod | undefined = methods.find(m => m.id === selectedPayment) || methods[0];
    const activeBrand = BRAND[activeMethod?.id || ''] || { name: activeMethod?.label || '', color: '#64748b', short: '' };
    // Exactly one behaviour per method — never a manual receipt *and* a redirect.
    const isGatewayMethod = activeMethod?.mode === 'gateway';
    const isManualMethod = activeMethod?.mode === 'manual';

    const copyNumber = () => {
        if (!activeMethod?.number) return;
        navigator.clipboard.writeText(activeMethod.number);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the highlighted fields');
            const firstField = Object.keys(validationErrors)[0];
            document.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
            return;
        }
        setErrors({});

        // Persist a freshly-typed address to the logged-in user's account so it
        // auto-fills next checkout. Best-effort: a failure here never blocks the order.
        const persistAddressIfNeeded = async () => {
            const isManualEntry = selectedAddressId === 'new' || savedAddresses.length === 0;
            if (!saveAddress || !isAuthenticated || !isManualEntry) return;
            const norm = (s: string) => (s || '').trim().toLowerCase();
            const alreadySaved = savedAddresses.some(a =>
                norm(a.address) === norm(formData.address) &&
                norm(a.city) === norm(formData.city) &&
                norm(a.phone) === norm(formData.phone),
            );
            if (alreadySaved) return;
            try {
                await addAddress({
                    label: 'Home',
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    area: formData.area,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    isDefault: savedAddresses.length === 0, // first address becomes the default
                }).unwrap();
            } catch {
                // best-effort only
            }
        };

        const orderPayload = {
            items: items.map(item => ({
                product: item.productId || item.id,
                quantity: item.quantity,
                color: item.color || undefined,
                size: item.size || undefined,
                // Karmo catalogue lines (mattress, foam, pillows…) are not in the products
                // collection, so they travel with their name, price, division and size; the
                // server re-quotes the price from the size and refuses one that differs.
                name: item.name,
                price: item.price,
                image: item.image,
                division: item.category,
                dims: item.dims,
            })),
            shippingAddress: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                area: formData.area,
                city: formData.city,
                postalCode: formData.postalCode,
            },
            paymentMethod: selectedPayment,
            // Receipt details exist only for a manual send-money method.
            paymentDetails: isManualMethod ? {
                senderNumber: paymentDetails.senderNumber,
                transactionId: paymentDetails.transactionId,
                paymentTime: paymentDetails.paymentTime,
            } : {},
            shippingCost,
            ...(appliedCoupons.length > 0
                ? { couponCodes: appliedCoupons.map((c) => c.code), discount: couponDiscount }
                : {}),
        };

        // Only a gateway method hands the browser off after the order is created.
        // Manual send-money and COD both land straight on the success page — the
        // customer has already paid (or will pay the rider).

        // Initialise the gateway for the freshly-created order and redirect the
        // browser to whatever URL the backend returns (real gateway in prod, the
        // /payment/simulate mock page in dev). Falls back to the success page if
        // the gateway can't be reached so the order is never lost.
        const goToGateway = async (orderId: string) => {
            try {
                const initRes = await initPayment({ orderId, method: selectedPayment }).unwrap();
                const redirectUrl = initRes?.data?.redirectUrl;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                    return;
                }
                // No redirect URL came back — treat as placed and let the user verify later.
                router.push('/checkout/success');
            } catch {
                toast.error('Order placed, but we could not start the payment. You can retry from My Orders.', { duration: 7000 });
                router.push('/checkout/success');
            }
        };

        try {
            if (isAuthenticated) {
                const result = await createOrder(orderPayload).unwrap();
                items.forEach((i: any) => dispatch(removeFromCart(i.id)));
                try { localStorage.removeItem('karmogroup_selected_cart'); } catch {}
                clearAppliedCoupons();
                await persistAddressIfNeeded();

                if (isGatewayMethod) {
                    const orderId = result?.data?._id;
                    if (orderId) {
                        await goToGateway(orderId);
                        return;
                    }
                }

                const ord = result?.data?.order || result?.data;
                setPlacedOrder({ _id: ord?._id, orderId: ord?.orderId || ord?.orderNumber });
            } else {
                const result = await guestCheckout(orderPayload).unwrap();
                items.forEach((i: any) => dispatch(removeFromCart(i.id)));
                try { localStorage.removeItem('karmogroup_selected_cart'); } catch {}
                clearAppliedCoupons();

                if (result.data?.accessToken && result.data?.user) {
                    const userData = result.data.user;
                    dispatch(loginSuccess({
                        user: {
                            id: userData._id,
                            name: `${userData.firstName} ${userData.lastName}`.trim(),
                            email: userData.email,
                            phone: userData.phone || '',
                            role: userData.role || 'user',
                        },
                        token: result.data.accessToken,
                    }));
                }

                if (isGatewayMethod) {
                    const orderId = result?.data?.order?._id;
                    if (orderId) {
                        await goToGateway(orderId);
                        return;
                    }
                }

                const ord = result?.data?.order || result?.data;
                // A new account is signed in at once; a returning customer logs in themselves.
                if (result?.data?.accessToken) toast.success('Your account has been created — your phone number is your password.', { duration: 6000 });
                else toast('You already have an account — log in with your password to follow this order.', { icon: 'ℹ️', duration: 7000 });
                setPlacedOrder({ _id: ord?._id, orderId: ord?.orderId || ord?.orderNumber });
            }
        } catch (err: any) {
            const errorData = err?.data;
            if (errorData?.errorMessages?.length > 0) {
                errorData.errorMessages.forEach((er: any) => toast.error(er.message, { duration: 6000 }));
            } else {
                toast.error(errorData?.message || 'Failed to place order. Please try again.', { duration: 6000 });
            }
        }
    };

    const isSubmitting = isPlacingOrder || isGuestPlacing || isInitiatingPayment;

    // Total = (subtotal − total coupon discount, floored at 0) + shippingCost
    const baseAmount = Math.max(0, totalPrice - couponDiscount);
    const orderTotal = baseAmount + shippingCost;
    const totalQuantity = items.reduce((a, i) => a + i.quantity, 0);

    const cls = (field: string) =>
        `${inputClass} ${errors[field] ? 'border-red-400 focus:border-red-500' : ''}`;
    const fieldError = (field: string) =>
        errors[field] ? <p className="mt-1 text-xs text-red-500">{errors[field]}</p> : null;

    // ── Order placed → step 3 ──
    if (placedOrder) {
        const orderRef = placedOrder.orderId || (placedOrder._id ? `#${placedOrder._id.slice(-8).toUpperCase()}` : '');
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <ShopHeader eyebrow="Karmo · Thank you" title="Order" accent="placed" step={3} />
                <div className="mx-auto w-full max-w-[1760px] px-5 sm:px-8 md:px-10 lg:px-12 py-12 lg:py-16">
                    <div className="mx-auto max-w-2xl rounded-md border border-ink/10 bg-white px-6 py-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-10">
                        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-md bg-brand text-white shadow-[0_14px_30px_-12px_rgba(212,67,72,0.8)]">
                            <SealIcon className="h-11 w-11" accent="#ffffff" />
                        </span>
                        <h2 className="display mt-6 text-[1.45rem] font-light uppercase tracking-[0.02em] text-ink">Thank you for your order</h2>
                        <LeafRule align="center" />
                        {orderRef ? (
                            <p className="mt-5 inline-flex items-center gap-2 rounded-sm border border-ink/12 px-4 py-2 text-sm">
                                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Order</span>
                                <span className="font-bold tracking-wide text-ink">{orderRef}</span>
                            </p>
                        ) : null}
                        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink/60">
                            Our team will call you shortly to confirm the order and the delivery date.
                            {selectedPayment === 'cod' ? ' Pay in cash when it arrives.' : ''}
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <button onClick={() => router.push('/dashboard/user/orders')}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-brand px-7 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark">
                                Track my order
                            </button>
                            <button onClick={() => router.push('/')}
                                className="inline-flex h-12 items-center justify-center rounded-sm border border-ink/15 bg-white px-7 text-[12px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink/40">
                                Continue shopping
                            </button>
                        </div>
                        <div className="mx-auto mt-10 max-w-md border-t border-ink/8 pt-8">
                            <TrustRow />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    const manualForm = !isAuthenticated || savedAddresses.length === 0 || selectedAddressId === 'new';

    return (
        <div className="min-h-screen bg-gray-50 pb-28 lg:pb-20">
            <ShopHeader
                eyebrow="Karmo · Checkout"
                title="Almost"
                accent="there"
                step={2}
                aside={
                    <Link href="/cart" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-ink/50 transition-colors hover:text-brand">
                        <LuChevronLeft size={14} /> Back to bag
                    </Link>
                }
            />

            <form id="checkout-form" onSubmit={handleSubmit} className="mx-auto w-full max-w-[1760px] px-5 sm:px-8 md:px-10 lg:px-12 py-8 lg:py-12">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start xl:gap-12">
                    {/* ══ LEFT ══ */}
                    <div className="min-w-0 space-y-6">
                        {/* 01 — Delivery */}
                        <StepCard n="01" title="Where should we deliver?" note="We call this number to confirm the order">
                            {isAuthenticated && savedAddresses.length > 0 && (
                                <div className={`space-y-2.5 ${manualForm ? 'mb-5' : ''}`}>
                                    {savedAddresses.map((a: any) => {
                                        const active = selectedAddressId === a._id;
                                        return (
                                            <label key={a._id}
                                                className={`flex cursor-pointer items-start gap-3 rounded-sm border px-4 py-3.5 transition-colors ${active ? 'border-brand bg-brand/[0.04]' : 'border-ink/12 hover:border-ink/25'}`}>
                                                <input type="radio" name="savedAddress" className="sr-only" checked={active} onChange={() => { setSelectedAddressId(a._id); applyAddress(a); }} />
                                                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-brand' : 'border-ink/25'}`}>
                                                    {active && <span className="h-2 w-2 rounded-full bg-brand" />}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-semibold text-ink">
                                                        {a.fullName} <span className="font-normal text-ink/45">· {a.phone}</span>
                                                        {a.isDefault && <span className="ml-2 bg-brand/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">Default</span>}
                                                    </span>
                                                    <span className="mt-0.5 block text-xs text-ink/50">{[a.address, a.area, a.city].filter(Boolean).join(', ')}</span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <button type="button"
                                            onClick={() => { setSelectedAddressId('new'); setFormData(prev => ({ ...prev, address: '', area: '', city: '', postalCode: '' })); }}
                                            className={`rounded-sm border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${selectedAddressId === 'new' ? 'border-brand text-brand' : 'border-dashed border-ink/25 text-ink/55 hover:border-ink/45'}`}>
                                            + Deliver to a new address
                                        </button>
                                        <Link href="/dashboard/user/addresses" className="text-xs font-medium text-brand hover:underline">Manage addresses</Link>
                                    </div>
                                </div>
                            )}

                            {manualForm && (
                                <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                                    <FormField label="Full name" required icon={<LuUser size={17} />} error={errors.fullName}>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Rahim Uddin" autoComplete="name" className={cls('fullName')} />
                                    </FormField>
                                    <FormField label="Mobile number" required icon={<LuPhone size={17} />} error={errors.phone} hint="11 digits, starting with 01">
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel" className={cls('phone')} />
                                    </FormField>
                                    <FormField label="Full address" required icon={<LuMapPin size={17} />} error={errors.address} className="md:col-span-2" top>
                                        <textarea name="address" value={formData.address} onChange={handleChange} rows={2} placeholder="House / flat no., road, block, nearby landmark" autoComplete="street-address" className={`${cls('address')} h-auto min-h-[76px] resize-none py-3 leading-relaxed`} />
                                    </FormField>
                                    <FormField label="City / district" required icon={<LuBuilding2 size={17} />} error={errors.city}>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Dhaka" autoComplete="address-level2" className={cls('city')} />
                                    </FormField>
                                    <FormField label="Area / thana" icon={<LuNavigation size={16} />}>
                                        <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Mirpur, Dhanmondi" autoComplete="address-level3" className={inputClass} />
                                    </FormField>
                                    <FormField label="Email" optional icon={<LuMail size={17} />} error={errors.email} className="md:col-span-2"
                                        hint="Optional — only for the order confirmation email. You can leave it empty.">
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" className={cls('email')} />
                                    </FormField>
                                    {isAuthenticated && (
                                        <label className="flex cursor-pointer select-none items-center gap-2.5 md:col-span-2">
                                            <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 cursor-pointer accent-brand" />
                                            <span className="text-[13px] text-ink/60">Save this address for next time</span>
                                        </label>
                                    )}
                                </div>
                            )}
                        </StepCard>

                        {/* 02 — Payment */}
                        <StepCard n="02" title="How would you like to pay?">
                            {isLoadingMethods && (
                                <div className="space-y-2.5">{[...Array(2)].map((_, i) => <div key={i} className="h-[68px] animate-pulse bg-[#f5f3ef]" />)}</div>
                            )}
                            <div className="grid gap-2.5 sm:grid-cols-2">
                                {methods.map((method) => {
                                    const active = selectedPayment === method.id;
                                    const brand = BRAND[method.id] || { name: method.label, color: '#64748b', short: '' };
                                    return (
                                        <label key={method.id}
                                            className={`relative flex cursor-pointer items-center gap-3.5 rounded-md border px-4 py-3.5 transition-all ${active ? '' : 'border-ink/12 bg-white hover:border-ink/25'}`}
                                            style={active ? { borderColor: brand.color, boxShadow: `inset 0 0 0 1px ${brand.color}`, background: `${brand.color}08` } : {}}>
                                            <input type="radio" name="paymentMethod" value={method.id} checked={active} onChange={() => setSelectedPayment(method.id)} className="sr-only" />
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-[13px] font-extrabold text-white" style={{ background: brand.color }}>
                                                {method.mode === 'cod' ? <TruckIcon className="h-5 w-5" /> : method.id === 'sslcommerz' ? <LuCreditCard size={18} /> : brand.short}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="flex flex-wrap items-center gap-1.5">
                                                    <span className="text-sm font-bold text-ink">{brand.name}</span>
                                                    {method.mode === 'gateway' && !method.live && (
                                                        <span className="border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-700">Demo</span>
                                                    )}
                                                    {method.mode === 'manual' && (
                                                        <span className="border border-ink/12 bg-[#f5f3ef] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-ink/60">Send Money</span>
                                                    )}
                                                </span>
                                                <span className="mt-0.5 block truncate text-xs text-ink/45">{SUBLINE[method.mode](method)}</span>
                                            </span>
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                                                style={active ? { borderColor: brand.color, background: brand.color } : { borderColor: '#d1d5db' }}>
                                                {active && <LuCheck size={11} className="text-white" strokeWidth={3.5} />}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            {!isLoadingMethods && methods.length === 0 && (
                                <div className="border border-amber-200 bg-amber-50 px-4 py-4 text-center">
                                    <p className="text-sm font-semibold text-amber-800">No payment method is available right now</p>
                                    <p className="mt-0.5 text-xs text-amber-700">Please call us to complete your order.</p>
                                </div>
                            )}

                            {selectedPayment === 'cod' && (
                                <div className="mt-4 flex items-start gap-3 rounded-sm bg-[#f0fdf4] px-4 py-3.5">
                                    <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#16a34a]" />
                                    <p className="text-sm leading-relaxed text-[#166534]">
                                        <b className="font-semibold">Pay when it arrives.</b> No advance needed — the delivery agent collects the amount in cash at your door.
                                    </p>
                                </div>
                            )}

                            {isGatewayMethod && activeMethod && (
                                <div className="mt-4 rounded-sm px-4 py-3.5" style={{ background: `${activeBrand.color}0D` }}>
                                    <p className="flex items-center gap-2 text-sm font-semibold text-ink"><LockIcon className="h-4 w-4" /> You&apos;ll finish payment on {activeBrand.name}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-ink/60">
                                        Place the order and we&apos;ll take you to the secure {activeBrand.name} page — your card or wallet details never touch this site.
                                    </p>
                                    {!activeMethod.live && (
                                        <p className="mt-2.5 flex items-start gap-1.5 border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-700">
                                            <LuInfo size={12} className="mt-0.5 shrink-0" />
                                            <span><strong>Demo preview</strong> — no merchant account is connected yet, so the next screen is a sandbox. No money is taken.</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {isManualMethod && activeMethod && (
                                <div className="mt-4 space-y-4">
                                    <div className="rounded-sm border-2 border-dashed px-4 py-4" style={{ borderColor: `${activeBrand.color}59`, background: `${activeBrand.color}08` }}>
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: activeBrand.color }}>Step 1 · Send Money ({activeMethod.accountType}) to</p>
                                                <p className="mt-1 text-xl font-extrabold tabular-nums tracking-wider text-ink">{activeMethod.number}</p>
                                            </div>
                                            <button type="button" onClick={copyNumber}
                                                className="inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90" style={{ background: activeBrand.color }}>
                                                {copied ? <><LuCheck size={13} /> Copied</> : <><LuCopy size={13} /> Copy</>}
                                            </button>
                                        </div>
                                        <p className="mt-2.5 text-xs leading-relaxed text-ink/65">
                                            {paymentInstructions || `Open your ${activeBrand.name} app, Send Money to the number above, then fill in the details below.`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-ink/50">Step 2 · Confirm your payment</p>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="md:col-span-2">
                                                <label className={labelClass}>Your {activeBrand.name} number <span className="text-brand">*</span></label>
                                                <input type="tel" name="senderNumber" value={paymentDetails.senderNumber} onChange={handlePaymentDetailChange} placeholder="Number you sent money from" className={cls('senderNumber')} />
                                                {fieldError("senderNumber")}
                                            </div>
                                            <div>
                                                <label className={labelClass}>Transaction ID <span className="text-brand">*</span></label>
                                                <input type="text" name="transactionId" value={paymentDetails.transactionId} onChange={handlePaymentDetailChange} placeholder="e.g. 9A1B2C3D4E" className={cls('transactionId')} />
                                                {fieldError("transactionId")}
                                            </div>
                                            <div>
                                                <label className={labelClass}>Payment time <span className="text-brand">*</span></label>
                                                <input type="datetime-local" name="paymentTime" value={paymentDetails.paymentTime} onChange={handlePaymentDetailChange} className={cls('paymentTime')} />
                                                {fieldError("paymentTime")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </StepCard>
                    </div>

                    {/* ══ RIGHT — summary ══ */}
                    <aside className="lg:sticky lg:top-[150px]">
                        <div className="relative overflow-hidden rounded-md border border-ink/10 bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                            <div className="relative px-6 pb-6 pt-7">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Summary</span>
                                        <h2 className="display mt-1.5 text-[1.3rem] font-light uppercase tracking-[0.02em] text-ink">Your order</h2>
                                    </div>
                                    <Link href="/cart" className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45 hover:text-brand">Edit</Link>
                                </div>

                                <ul className="mt-5 max-h-[320px] space-y-4 overflow-y-auto pr-1">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-3.5">
                                            <span className="relative h-16 w-16 shrink-0 rounded-sm border border-ink/8 bg-[#f3f1ec]">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                                                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{item.quantity}</span>
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="line-clamp-2 text-[13px] font-semibold uppercase leading-snug tracking-[0.02em] text-ink">{item.name}</span>
                                                {(item.size || item.color) && <span className="mt-0.5 block truncate text-[12px] text-ink/45">{[item.color, item.size].filter(Boolean).join(' · ')}</span>}
                                            </span>
                                            <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">{tk(item.price * item.quantity)}</span>
                                        </li>
                                    ))}
                                </ul>

                                <dl className="mt-6 space-y-2.5 border-t border-[#eee] pt-5 text-[14px]">
                                    <div className="flex justify-between"><dt className="text-ink/60">Subtotal ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})</dt><dd className="tabular-nums">{tk(totalPrice)}</dd></div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-[#15803d]">
                                            <dt className="flex items-center gap-1.5"><TagIcon className="h-3.5 w-3.5" /> Coupon{appliedCoupons.length > 1 ? `s (${appliedCoupons.length})` : ` (${appliedCoupons.find(c => c.discount > 0)?.code || ''})`}</dt>
                                            <dd className="tabular-nums">−{tk(couponDiscount)}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <dt className="text-ink/60">Delivery {estimatedDays && <span className="block text-[11px] text-ink/35">Arrives in {estimatedDays}</span>}</dt>
                                        <dd className={freeShipping ? 'text-right font-semibold text-[#15803d]' : 'tabular-nums'}>
                                            {freeShipping ? <>Free{freeReasonLabel && <span className="block text-[10px] font-normal text-[#15803d]/70">{freeReasonLabel}</span>}</> : tk(shippingCost)}
                                        </dd>
                                    </div>
                                </dl>
                                <div className="mt-5 flex items-end justify-between border-t border-[#eee] pt-5">
                                    <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink/70">Total</span>
                                    <span className="text-right">
                                        {(couponDiscount > 0 || couponFreeShipping) && (
                                            <span className="block text-[14px] text-[#9ca3af] line-through">{tk(totalPrice + (couponFreeShipping ? (shippingQuote?.shippingCost ?? (totalPrice >= 5000 ? 0 : 120)) : shippingCost))}</span>
                                        )}
                                        <span className="text-[1.65rem] font-bold leading-none tabular-nums tracking-tight text-brand sm:text-[1.85rem]">{tk(orderTotal)}</span>
                                    </span>
                                </div>

                                <button type="submit" disabled={isSubmitting}
                                    className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-brand text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60">
                                    {isSubmitting ? (
                                        <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Placing order…</>
                                    ) : (
                                        <><LockIcon className="h-4 w-4" /> Place order · {tk(orderTotal)}</>
                                    )}
                                </button>
                                <p className="mt-3 text-center text-[12px] leading-relaxed text-ink/45">
                                    {selectedPayment === 'cod' ? 'Cash on delivery · ' : `Paying with ${activeBrand.name} · `}
                                    By placing this order you agree to our <Link href="/terms" className="underline hover:text-brand">terms</Link>.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </form>

            {/* Phones: total + place order always in reach */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-ink/12 bg-white px-4 py-3 shadow-[0_-6px_18px_rgba(0,0,0,0.06)] lg:hidden">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">Total</p>
                    <p className="text-lg font-bold leading-none tabular-nums text-ink">{tk(orderTotal)}</p>
                </div>
                <button type="submit" form="checkout-form" disabled={isSubmitting}
                    className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-sm bg-brand px-6 text-[14px] font-bold uppercase tracking-[0.06em] text-white disabled:opacity-60">
                    <LockIcon className="h-4 w-4" /> {isSubmitting ? 'Placing…' : 'Place order'}
                </button>
            </div>
        </div>
    );
};

/** A numbered checkout step: "01  DELIVERY DETAILS". */
function StepCard({ n, title, note, right, children }: { n: string; title: string; note?: string; right?: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <header className="flex items-center gap-4 border-b border-ink/8 px-5 py-4 sm:px-6">
                <span className="display text-[1.7rem] font-light leading-none text-brand">{n}</span>
                <div className="min-w-0 flex-1">
                    <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink">{title}</h2>
                    {note ? <p className="mt-0.5 text-xs text-ink/45">{note}</p> : null}
                </div>
                {right}
            </header>
            <div className="px-5 py-5 sm:px-6">{children}</div>
        </section>
    );
}

/**
 * One labelled field with an icon inside the box, a clear "required" / "optional" tag,
 * a hint under it and the error in red when something is wrong.
 */
function FormField({ label, required, optional, icon, hint, error, className = '', top = false, children }: {
    label: string; required?: boolean; optional?: boolean; icon?: React.ReactNode; hint?: string; error?: string;
    className?: string; top?: boolean; children: React.ReactNode;
}) {
    return (
        <div className={className}>
            <label className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink/80">
                {label}
                {required ? <span className="text-brand">*</span> : null}
                {optional ? <span className="rounded border border-ink/12 bg-gray-50 px-1.5 py-px text-[10px] font-bold uppercase tracking-[0.1em] text-ink/50">Optional</span> : null}
            </label>
            <div className={`relative ${icon ? '[&>input]:!pl-11 [&>textarea]:!pl-11' : ''}`}>
                {icon ? (
                    <span className={`pointer-events-none absolute left-3.5 text-ink/35 ${top ? 'top-3.5' : 'top-1/2 -translate-y-1/2'}`}>{icon}</span>
                ) : null}
                {children}
            </div>
            {error ? <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
                : hint ? <p className="mt-1.5 text-xs text-ink/40">{hint}</p> : null}
        </div>
    );
}

export default CheckoutPage;
