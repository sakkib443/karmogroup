"use client";

/**
 * Send a website message to the admin's Inquiries (the contact form above the footer and
 * the chat bubble's "Leave a message" both use this). Records the page it came from.
 */
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCreateInquiryMutation } from '@/redux/api/inquiryApi';

export type InquiryState = 'idle' | 'sending' | 'sent' | 'error';

export function useWebsiteInquiry(source: 'contact_form' | 'chat') {
    const page = usePathname() || '';
    const [create] = useCreateInquiryMutation();
    const [state, setState] = useState<InquiryState>('idle');
    const [error, setError] = useState('');

    const send = async (fields: { name: string; phone: string; message: string }) => {
        setState('sending');
        setError('');
        try {
            await create({ ...fields, source, page }).unwrap();
            setState('sent');
            return true;
        } catch (e) {
            setError((e as { data?: { message?: string } })?.data?.message || 'Could not send — please call us instead.');
            setState('error');
            return false;
        }
    };

    return { send, state, error, reset: () => setState('idle') };
}
