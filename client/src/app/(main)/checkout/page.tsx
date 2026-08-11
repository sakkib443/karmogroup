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
import {
    LuChevronLeft, LuInfo, LuCheck, LuCopy, LuLock, LuTag, LuCreditCard, LuTruck
} from 'react-icons/lu';
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
    "w-full px-3.5 py-2.5 bg-white border border-ink/20 rounded-none text-sm text-ink outline-none focus:border-brand transition-colors placeholder:text-ink/40";

const labelClass =
    "block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/55 mb-1.5";

const CheckoutPage = () => {
    const allCartItems = useAppSelector((state) => state.cart.items);
    // Honor the cart's selection: only the ticked items are checked out (falls back to all).
    const items = React.useMemo(() => {
        try {
            const sel = JSON.parse(localStorage.getItem('skawsarsunnahmart_selected_cart') || 'null');
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
    const methods: PayMethod[] = methodsRes?.data?.methods || [];
    const paymentInstructions: string = methodsRes?.data?.instructions || '';
    const availableIds = methods.map(m => m.id).join(',');

    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', address: '', city: '', area: '', postalCode: '',
    });

    const [selectedPayment, setSelectedPayment] = useState('bkash');
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                try { localStorage.removeItem('skawsarsunnahmart_selected_cart'); } catch {}
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
                try { localStorage.removeItem('skawsarsunnahmart_selected_cart'); } catch {}
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
                toast.success('Your account has been created.', { duration: 5000 });
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
    const FieldError = ({ field }: { field: string }) =>
        errors[field] ? <p className="mt-1 text-xs text-red-500">{errors[field]}</p> : null;

    // ── Order placed → confirmation modal ──
    if (placedOrder) {
        const orderRef = placedOrder.orderId || (placedOrder._id ? `#${placedOrder._id.slice(-8).toUpperCase()}` : '');
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                <div className="bg-white rounded-none shadow-2xl w-full max-w-md p-7 sm:p-8 text-center animate-[popIn_0.25s_ease-out]">
                    {/* Success check */}
                    <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                            <LuCheck size={32} className="text-white" strokeWidth={3} />
                        </div>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Karmo</span>
                    <h2 className="display mt-2 text-[1.45rem] font-light uppercase tracking-[0.01em] text-ink">Order Placed</h2>
                    <p className="text-sm text-ink/50 mt-2 leading-relaxed">
                        Thank you for your purchase. Your order has been placed successfully
                        {orderRef && <> — <span className="font-semibold text-ink/80">{orderRef}</span></>}.
                        {selectedPayment === 'cod' && ' Pay in cash when it arrives.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-7">
                        <button
                            onClick={() => router.push('/dashboard/user/orders')}
                            className="flex-1 py-3 rounded-none bg-brand text-white text-sm font-semibold hover:brightness-95 transition-all shadow-md shadow-brand/20"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 py-3 rounded-none border border-ink/12 text-ink/80 text-sm font-semibold hover:bg-cream/60 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
                <style>{`@keyframes popIn { 0% { opacity: 0; transform: scale(0.92) translateY(8px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="shell pt-8 pb-12 lg:pt-10 lg:pb-16">

                <Link href="/cart" className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45 hover:text-brand mb-6 transition-colors">
                    <LuChevronLeft size={14} />
                    Back to Cart
                </Link>

                <div className="mb-7 border-b border-ink/10 pb-5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Karmo</span>
                    <h1 className="display mt-2 text-[1.55rem] font-light uppercase leading-[1.1] tracking-[0.01em] text-ink sm:text-[1.85rem]">
                        Checkout
                    </h1>
                    <p className="mt-1.5 text-sm text-ink/50">Confirm delivery details and place your order</p>
                </div>

                {/* Guest Banner */}
                {!isAuthenticated && (
                    <div className="mb-5 border border-ink/12 bg-cream/60 px-4 py-3.5 flex items-start gap-3">
                        <LuInfo size={16} className="text-brand mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-ink/70 leading-relaxed">
                            No account needed. We&apos;ll create one automatically — your email will be your login ID and password.{' '}
                            <Link href="/login?redirect=/checkout" className="font-semibold text-brand underline underline-offset-2">Already have an account?</Link>
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5">

                        {/* ══ LEFT COLUMN ══ */}
                        <div className="lg:col-span-7 space-y-5">

                            {/* ── Shipping Address ── */}
                            <div className="border border-ink/10 bg-white">
                                <div className="px-5 py-3.5 border-b border-ink/8">
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">Shipping Address</h2>
                                </div>
                                {/* Saved addresses — auto-filled from the dashboard. Pick one or add a new one. */}
                                {isAuthenticated && savedAddresses.length > 0 && (
                                    <div className="px-5 pt-4 space-y-2.5">
                                        {savedAddresses.map((a: any) => {
                                            const active = selectedAddressId === a._id;
                                            return (
                                                <label
                                                    key={a._id}
                                                    className={`flex items-start gap-3 px-4 py-3 border cursor-pointer transition-colors ${active ? 'border-brand bg-brand/[0.04]' : 'border-ink/12 hover:border-ink/20'}`}
                                                >
                                                    <input type="radio" name="savedAddress" className="sr-only" checked={active} onChange={() => { setSelectedAddressId(a._id); applyAddress(a); }} />
                                                    <span className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-brand' : 'border-ink/25'}`}>
                                                        {active && <span className="w-2 h-2 rounded-full bg-brand" />}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block text-sm font-medium text-ink">
                                                            {a.fullName} <span className="text-ink/40 font-normal">· {a.phone}</span>
                                                            {a.isDefault && <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-brand bg-brand/10 px-1.5 py-0.5">Default</span>}
                                                            {a.label && <span className="ml-1.5 text-[10px] text-ink/50 bg-cream px-1.5 py-0.5">{a.label}</span>}
                                                        </span>
                                                        <span className="block text-xs text-ink/50 mt-0.5">{[a.address, a.area, a.city, a.postalCode].filter(Boolean).join(', ')}</span>
                                                    </span>
                                                </label>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedAddressId('new'); setFormData(prev => ({ ...prev, address: '', area: '', city: '', postalCode: '' })); }}
                                            className={`w-full text-left px-4 py-3 border text-sm transition-colors ${selectedAddressId === 'new' ? 'border-brand bg-brand/[0.04] text-ink' : 'border-dashed border-ink/20 text-ink/50 hover:border-ink/35'}`}
                                        >
                                            + Deliver to a new address
                                        </button>
                                        <Link href="/dashboard/user/addresses" className="inline-block text-xs text-brand hover:underline">Manage saved addresses →</Link>
                                    </div>
                                )}

                                {/* Manual form — guests, no saved address, or "new address" */}
                                {(!isAuthenticated || savedAddresses.length === 0 || selectedAddressId === 'new') && (
                                <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className={cls('fullName')} />
                                        <FieldError field="fullName" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Email {!isAuthenticated && <span className="text-ink/40">(login ID)</span>}</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className={cls('email')} />
                                        <FieldError field="email" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className={cls('phone')} />
                                        <FieldError field="phone" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Address <span className="text-red-500">*</span></label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="House no, road, area" className={cls('address')} />
                                        <FieldError field="address" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>City <span className="text-red-500">*</span></label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Dhaka, Chittagong..." className={cls('city')} />
                                        <FieldError field="city" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Area / Thana</label>
                                        <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Mirpur, Dhanmondi..." className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Postal Code</label>
                                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="1207" className={inputClass} />
                                    </div>
                                    {isAuthenticated && (
                                        <label className="md:col-span-2 flex items-center gap-2.5 mt-1 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={saveAddress}
                                                onChange={(e) => setSaveAddress(e.target.checked)}
                                                className="w-4 h-4 rounded border-ink/20 accent-brand cursor-pointer"
                                            />
                                            <span className="text-xs text-ink/65">Save this address to my account for faster checkout next time</span>
                                        </label>
                                    )}
                                </div>
                                )}
                            </div>

                            {/* ── Order Items (read-only) ── */}
                            <div className="border border-ink/10 bg-white">
                                <div className="px-5 py-3.5 border-b border-ink/8 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-ink">Order Items</h2>
                                    <span className="text-xs text-ink/40">{totalQuantity} item{totalQuantity > 1 ? 's' : ''}</span>
                                </div>
                                <div className="divide-y divide-ink/6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3.5 px-5 py-4">
                                            <div className="w-16 h-16 bg-cream/60 rounded border border-ink/8 p-1 flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm text-ink line-clamp-2 leading-snug">{item.name}</h4>
                                                {(item.color || item.size) && (
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        {item.color && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-ink/50 bg-cream/60 border border-ink/8 rounded px-1.5 py-0.5">
                                                                {item.colorHex && <span className="w-2.5 h-2.5 rounded-full border border-ink/12" style={{ background: item.colorHex }} />}
                                                                {item.color}
                                                            </span>
                                                        )}
                                                        {item.size && (
                                                            <span className="text-[11px] text-ink/50 bg-cream/60 border border-ink/8 rounded px-1.5 py-0.5">
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-ink/40">৳{item.price.toLocaleString()} × {item.quantity}</span>
                                                    <span className="text-sm font-semibold text-ink">৳{(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Payment Method ── */}
                            <div className="bg-white rounded-none border border-ink/12 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-ink/8 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center">
                                            <LuCreditCard size={15} className="text-brand" />
                                        </span>
                                        <div>
                                            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink leading-tight">Payment Method</h2>
                                            <p className="text-[11px] text-ink/40 mt-0.5">Choose how you&apos;d like to pay</p>
                                        </div>
                                    </div>
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                        <LuLock size={11} /> Secure
                                    </span>
                                </div>
                                <div className="px-5 py-5 space-y-3">

                                    {isLoadingMethods && (
                                        <div className="space-y-2.5">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="h-[68px] rounded-none bg-cream/60 animate-pulse" />
                                            ))}
                                        </div>
                                    )}

                                    {/* Selectable method cards */}
                                    {methods.map((method) => {
                                        const active = selectedPayment === method.id;
                                        const brand = BRAND[method.id] || { name: method.label, color: '#64748b', short: '' };
                                        return (
                                            <label
                                                key={method.id}
                                                className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-none border cursor-pointer transition-all duration-200 ${
                                                    active
                                                        ? 'shadow-[0_2px_12px_-4px_rgba(0,0,0,0.18)]'
                                                        : 'border-ink/12 hover:border-ink/20 hover:bg-cream/60'
                                                }`}
                                                style={active
                                                    ? { borderColor: brand.color, background: `${brand.color}0A`, boxShadow: `0 0 0 1px ${brand.color}` }
                                                    : {}}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={active}
                                                    onChange={() => setSelectedPayment(method.id)}
                                                    className="sr-only"
                                                />
                                                {/* Brand tile */}
                                                <span
                                                    className="w-11 h-11 rounded-none flex items-center justify-center flex-shrink-0 text-white text-[13px] font-extrabold shadow-sm transition-transform duration-200 group-hover:scale-105"
                                                    style={{ background: brand.color }}
                                                >
                                                    {method.mode === 'cod'
                                                        ? <LuTruck size={18} />
                                                        : method.id === 'sslcommerz'
                                                            ? <LuCreditCard size={18} />
                                                            : brand.short}
                                                </span>
                                                <span className="flex-1 min-w-0">
                                                    <span className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="text-sm font-bold text-ink">{brand.name}</span>
                                                        {/* How this method actually takes the money */}
                                                        {method.mode === 'gateway' && method.live && (
                                                            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
                                                                <LuLock size={8} /> Secure gateway
                                                            </span>
                                                        )}
                                                        {method.mode === 'gateway' && !method.live && (
                                                            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                                                                Demo preview
                                                            </span>
                                                        )}
                                                        {method.mode === 'manual' && (
                                                            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-ink/65 bg-cream border border-ink/12 rounded px-1.5 py-0.5">
                                                                Send Money
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="block text-xs text-ink/40 mt-0.5 truncate">{SUBLINE[method.mode](method)}</span>
                                                </span>
                                                {/* Selected tick */}
                                                <span
                                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                                                    style={active
                                                        ? { borderColor: brand.color, background: brand.color }
                                                        : { borderColor: '#d1d5db' }}
                                                >
                                                    {active && <LuCheck size={11} className="text-white" strokeWidth={3.5} />}
                                                </span>
                                            </label>
                                        );
                                    })}

                                    {!isLoadingMethods && methods.length === 0 && (
                                        <div className="rounded-none border border-amber-200 bg-amber-50 px-4 py-4 text-center">
                                            <p className="text-sm font-semibold text-amber-800">No payment method is available right now</p>
                                            <p className="text-xs text-amber-700 mt-0.5">Please contact us to complete your order.</p>
                                        </div>
                                    )}

                                    {/* ── Method-specific details ── */}
                                    {selectedPayment === 'cod' && (
                                        <div className="rounded-none border border-green-200 bg-green-50 px-4 py-4 flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <LuTruck size={15} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-green-800">Pay when your order arrives!</p>
                                                <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                                                    No advance payment needed. Our delivery agent will collect the full amount in cash when your order is delivered to your door.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* GATEWAY — the provider collects the money, so we never ask
                                        for a receipt here. Only the redirect is explained. */}
                                    {isGatewayMethod && activeMethod && (
                                        <div className="rounded-none border px-4 py-4"
                                            style={{ borderColor: `${activeBrand.color}33`, background: `${activeBrand.color}0A` }}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-none flex items-center justify-center flex-shrink-0"
                                                    style={{ background: `${activeBrand.color}1A` }}>
                                                    <LuLock size={15} style={{ color: activeBrand.color }} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-ink">
                                                        You&apos;ll finish payment on {activeBrand.name}
                                                    </p>
                                                    <p className="text-xs text-ink/65 mt-0.5 leading-relaxed">
                                                        Place the order and we&apos;ll take you to the secure {activeBrand.name} page. Your
                                                        card or wallet details are entered there — they never touch this site.
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Honest about the sandbox: no merchant account is connected yet. */}
                                            {!activeMethod.live && (
                                                <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-amber-700 bg-amber-50 border border-amber-200 rounded-none px-2.5 py-2">
                                                    <LuInfo size={12} className="mt-0.5 flex-shrink-0" />
                                                    <span>
                                                        <strong>Demo preview</strong> — a merchant account isn&apos;t connected yet, so the next
                                                        screen is a sandbox that mirrors the real flow. No money is taken.
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* MANUAL — the shop published a wallet number. The customer sends
                                        money themselves, so the receipt details ARE the payment proof. */}
                                    {isManualMethod && activeMethod && (
                                        <div className="pt-1 space-y-4">
                                            {/* Step 1 — the number to send to */}
                                            <div className="rounded-none border-2 border-dashed px-4 py-4"
                                                style={{ borderColor: `${activeBrand.color}59`, background: `${activeBrand.color}08` }}>
                                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                                    <div className="min-w-0">
                                                        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: activeBrand.color }}>
                                                            <span className="w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center" style={{ background: activeBrand.color }}>1</span>
                                                            Send Money ({activeMethod.accountType}) to
                                                        </p>
                                                        <p className="text-xl font-extrabold tracking-wider text-ink mt-1 tabular-nums">
                                                            {activeMethod.number}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={copyNumber}
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-none text-white transition-opacity hover:opacity-90"
                                                        style={{ background: activeBrand.color }}
                                                    >
                                                        {copied ? <><LuCheck size={13} /> Copied</> : <><LuCopy size={13} /> Copy</>}
                                                    </button>
                                                </div>
                                                <p className="mt-2.5 text-xs text-ink/65 leading-relaxed">
                                                    {paymentInstructions || `Open your ${activeBrand.name} app, Send Money to the number above, then fill in the details below.`}
                                                </p>
                                            </div>

                                            {/* Step 2 — the receipt */}
                                            <div>
                                                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink/50 mb-3">
                                                    <span className="w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center" style={{ background: activeBrand.color }}>2</span>
                                                    Confirm your payment
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className={labelClass}>Your {activeBrand.name} Number <span className="text-red-500">*</span></label>
                                                        <input type="tel" name="senderNumber" value={paymentDetails.senderNumber} onChange={handlePaymentDetailChange} placeholder="Number you sent money from" className={cls('senderNumber')} />
                                                        <FieldError field="senderNumber" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Transaction ID <span className="text-red-500">*</span></label>
                                                        <input type="text" name="transactionId" value={paymentDetails.transactionId} onChange={handlePaymentDetailChange} placeholder="e.g. 9A1B2C3D4E" className={cls('transactionId')} />
                                                        <FieldError field="transactionId" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Payment Time <span className="text-red-500">*</span></label>
                                                        <input type="datetime-local" name="paymentTime" value={paymentDetails.paymentTime} onChange={handlePaymentDetailChange} className={cls('paymentTime')} />
                                                        <FieldError field="paymentTime" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ══ RIGHT COLUMN: Sticky Order Summary ══ */}
                        <div className="lg:col-span-5 lg:sticky lg:top-[200px] h-fit">
                            <div className="border border-ink/10 bg-white">
                                <div className="px-5 py-3.5 border-b border-ink/8">
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">Order Summary</h2>
                                </div>

                                {/* Totals */}
                                <div className="px-5 py-4 space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ink/50">Subtotal ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})</span>
                                        <span className="text-ink">৳{totalPrice.toLocaleString()}</span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span className="flex items-center gap-1">
                                                <LuTag size={12} /> Coupon{appliedCoupons.length > 1 ? `s (${appliedCoupons.length})` : ` (${appliedCoupons.find(c => c.discount > 0)?.code || ''})`}
                                            </span>
                                            <span className="font-medium">-৳{couponDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {couponFreeShipping && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span className="flex items-center gap-1"><LuTag size={12} /> Free shipping coupon</span>
                                            <span className="font-medium">Applied</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ink/50">
                                            Delivery
                                            {estimatedDays && (
                                                <span className="block text-xs text-ink/40">Est. {estimatedDays}</span>
                                            )}
                                        </span>
                                        {freeShipping ? (
                                            <span className="text-right">
                                                <span className="font-medium text-green-600">FREE</span>
                                                {freeReasonLabel && <span className="block text-[10px] text-green-600/70">{freeReasonLabel}</span>}
                                            </span>
                                        ) : (
                                            <span className="text-ink">৳{shippingCost.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center pt-3 mt-1 border-t border-ink/8">
                                        <span className="text-sm font-semibold text-ink">Total</span>
                                        <div className="text-right">
                                            {(couponDiscount > 0 || couponFreeShipping) && (
                                                <p className="text-xs line-through text-ink/40">৳{(totalPrice + (couponFreeShipping ? (shippingQuote?.shippingCost ?? (totalPrice >= 5000 ? 0 : 120)) : shippingCost)).toLocaleString()}</p>
                                            )}
                                            <span className="text-xl font-bold text-brand">
                                                ৳{orderTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-ink/40">
                                        {selectedPayment === 'cod'
                                            ? <><span className="font-medium text-green-600">Cash on Delivery</span> — pay when delivered</>
                                            : <>Paying via <span className="font-medium" style={{ color: activeBrand.color }}>{activeBrand.name}</span></>
                                        }
                                    </p>
                                </div>

                                {/* Place Order */}
                                <div className="px-5 pb-5">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white rounded-none text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Placing order...
                                            </>
                                        ) : (
                                            <><LuLock size={14} /> Place Order</>
                                        )}
                                    </button>
                                    <p className="text-xs text-ink/40 text-center mt-3 leading-relaxed">
                                        By placing this order you agree to our{' '}
                                        <Link href="/terms" className="underline hover:text-ink/65">Terms &amp; Conditions</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
