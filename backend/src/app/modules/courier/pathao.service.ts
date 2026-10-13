import config from '../../config';
import AppError from '../../utils/AppError';

// ── Pathao Courier merchant API wrapper ──────────────────────────────
// Sign in with the merchant's client id/secret + login (password grant) for a
// bearer token, then create one parcel per order.
//   POST {base}/aladdin/api/v1/issue-token
//   POST {base}/aladdin/api/v1/orders

const cfg = () => config.pathao;

function ensureConfigured(): void {
    const { client_id, client_secret, username, password, store_id } = cfg();
    if (!client_id || !client_secret || !username || !password || !store_id) {
        throw new AppError(
            503,
            'Pathao courier is not set up. Add PATHAO_CLIENT_ID, PATHAO_CLIENT_SECRET, PATHAO_USERNAME, PATHAO_PASSWORD and PATHAO_STORE_ID to the server .env, then restart.'
        );
    }
}

// The token lasts for days; keep it until shortly before it runs out.
let cached: { token: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
    if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
    const { base_url, client_id, client_secret, username, password } = cfg();
    const res = await fetch(`${base_url}/aladdin/api/v1/issue-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id, client_secret, username, password, grant_type: 'password' }),
    });
    const data: any = await res.json().catch(() => ({}));
    if (!res.ok || !data?.access_token) {
        throw new AppError(502, `Pathao sign-in failed${data?.message ? `: ${data.message}` : ''}`);
    }
    cached = { token: data.access_token, expiresAt: Date.now() + (Number(data.expires_in) || 3600) * 1000 };
    return cached.token;
}

/** "+880 1712-345678" → "01712345678" — Pathao wants the 11-digit local form. */
function localPhone(raw: string): string {
    const digits = String(raw || '').replace(/\D/g, '');
    return digits.startsWith('880') ? digits.slice(2) : digits;
}

export interface PathaoOrderInput {
    merchantOrderId: string;  // our order number, shown on Pathao's side
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    amountToCollect: number;  // 0 for prepaid
    itemQuantity: number;
    itemDescription?: string;
    specialInstruction?: string;
}

const PathaoService = {
    async createOrder(input: PathaoOrderInput) {
        ensureConfigured();
        const { base_url, store_id, city_id, zone_id, item_weight_kg } = cfg();

        const phone = localPhone(input.recipientPhone);
        if (!/^01\d{9}$/.test(phone)) {
            throw new AppError(400, `Pathao needs an 11-digit mobile number; this order has "${input.recipientPhone}"`);
        }

        const body: Record<string, unknown> = {
            store_id: Number(store_id),
            merchant_order_id: input.merchantOrderId,
            recipient_name: input.recipientName,
            recipient_phone: phone,
            recipient_address: input.recipientAddress,
            delivery_type: 48,          // 48 = normal delivery, 12 = on demand
            item_type: 2,               // 1 = document, 2 = parcel
            item_quantity: input.itemQuantity,
            item_weight: item_weight_kg,
            amount_to_collect: Math.round(input.amountToCollect),
            item_description: (input.itemDescription || '').slice(0, 250),
            special_instruction: (input.specialInstruction || '').slice(0, 250),
        };
        if (city_id) body.recipient_city = Number(city_id);
        if (zone_id) body.recipient_zone = Number(zone_id);

        const res = await fetch(`${base_url}/aladdin/api/v1/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${await accessToken()}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data: any = await res.json().catch(() => ({}));
        const booked = data?.data;
        if (!res.ok || !booked?.consignment_id) {
            if (res.status === 401) cached = null; // stale token — sign in again next time
            const detail = data?.errors
                ? Object.values(data.errors).flat().join(' ')
                : data?.message;
            throw new AppError(502, `Pathao did not accept the parcel${detail ? `: ${detail}` : ''}`);
        }

        return {
            consignmentId: String(booked.consignment_id),
            status: String(booked.order_status || 'Pending'),
            deliveryFee: Number(booked.delivery_fee) || 0,
        };
    },
};

export default PathaoService;
