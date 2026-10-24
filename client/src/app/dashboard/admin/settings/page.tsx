import { redirect } from 'next/navigation';

// Store settings became "Delivery & payment" (its logo / name lived in Site content and its
// password form in My profile already).
export default function SettingsPage() {
    redirect('/dashboard/admin/delivery-payment');
}
