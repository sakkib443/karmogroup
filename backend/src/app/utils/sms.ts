import config from '../config';

export type SmsResult = { status: 'sent' | 'failed' | 'not_configured'; ref?: string; error?: string };

/** "+880 1712-345678" / "01712345678" → "8801712345678" — the form Bangladeshi gateways take. */
export function intlPhone(raw: string): string {
    const d = String(raw || '').replace(/\D/g, '');
    if (d.startsWith('880')) return d;
    if (d.startsWith('0')) return '88' + d;
    return d.length === 10 ? '880' + d : d;
}

export const isSmsConfigured = () => {
    const { provider, api_key, sender_id } = config.sms;
    return provider === 'bulksmsbd' && !!api_key && !!sender_id;
};

/**
 * Send one SMS. Never throws — the order desk records whatever happened, so a gateway
 * outage shows up as a failed SMS on the order rather than a broken button.
 */
export async function sendSms(to: string, message: string): Promise<SmsResult> {
    if (!isSmsConfigured()) {
        return { status: 'not_configured', error: 'SMS gateway is not set up (SMS_PROVIDER, SMS_API_KEY, SMS_SENDER_ID).' };
    }
    const number = intlPhone(to);
    if (!/^8801\d{9}$/.test(number)) return { status: 'failed', error: `Not a Bangladeshi mobile number: ${to}` };

    const { base_url, api_key, sender_id } = config.sms;
    try {
        // BulkSMSBD: GET /api/smsapi — response_code 202 means accepted.
        const url = `${base_url}/api/smsapi?` + new URLSearchParams({
            api_key, type: 'text', number, senderid: sender_id, message,
        }).toString();
        const res = await fetch(url, { method: 'GET' });
        const data: any = await res.json().catch(() => ({}));
        if (Number(data?.response_code) === 202) {
            return { status: 'sent', ref: String(data?.message_id || '') };
        }
        return { status: 'failed', error: String(data?.error_message || data?.success_message || `HTTP ${res.status}`) };
    } catch (e: any) {
        return { status: 'failed', error: e?.message || 'Could not reach the SMS gateway' };
    }
}
