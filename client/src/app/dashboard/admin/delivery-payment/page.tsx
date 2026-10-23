"use client";

/**
 * Delivery & payment — what a customer pays for delivery (inside / outside Dhaka, free
 * delivery over a set amount, the courier's COD charge) and the bKash / Nagad / bank
 * details shown at checkout. Super admin and admins.
 */
import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import PageGuide from '@/components/admin/PageGuide';
import BusinessSettings from '../settings/BusinessSettings';
import PaymentSettings from '../settings/PaymentSettings';
import { SettingsSection } from '../settings/parts';

export default function DeliveryPaymentPage() {
    return (
        <div className="max-w-5xl">
            <PageHeader title="Delivery & payment" subtitle="Delivery charges on every new order, and the payment numbers customers see at checkout."
                actions={<PageGuide page="delivery" />} />
            <div className="space-y-9">
                <SettingsSection id="delivery" title="Delivery charge" description="Used on new orders as soon as you save.">
                    <BusinessSettings />
                </SettingsSection>
                <SettingsSection id="payment" title="Payment numbers" description="bKash, Nagad, Rocket and bank transfer — shown at checkout only while switched on.">
                    <PaymentSettings />
                </SettingsSection>
            </div>
        </div>
    );
}
