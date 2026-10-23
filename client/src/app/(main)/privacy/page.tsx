import type { Metadata } from 'next';
import LegalPageLayout from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how Karmo Group collects, uses, and protects your personal data when you use our online marketplace.",
    alternates: { canonical: "/privacy" },
};

const CONTENT = `
<p>Karmo Group respects your privacy and is committed to protecting your personal information. This Privacy Policy explains what we collect, how we use it, and the choices you have when you visit or shop at karmogroup.com.</p>

<h2>1. Information We Collect</h2>
<ul>
  <li><strong>Personal Details:</strong> Your name, email address, phone number, and shipping and billing addresses, provided when you place an order or create an account.</li>
  <li><strong>Transaction Details:</strong> Payment confirmations for your orders. We do not store full card numbers or banking passwords.</li>
  <li><strong>Technical Data:</strong> IP address, browser type, device information, and browsing activity collected through cookies.</li>
</ul>

<h2>2. How We Use Your Information</h2>
<ul>
  <li><strong>Order Fulfilment:</strong> To process and deliver your orders, including shipping and returns.</li>
  <li><strong>Communication:</strong> To send order updates, customer-service replies, and — for subscribers — promotional offers.</li>
  <li><strong>Improvement:</strong> To improve our website and your overall shopping experience.</li>
  <li><strong>Security:</strong> To prevent fraud and keep our systems secure.</li>
</ul>

<h2>3. Data Sharing &amp; Security</h2>
<ul>
  <li><strong>No Selling:</strong> We do not sell, rent, or trade your personal information to third parties.</li>
  <li><strong>Trusted Partners:</strong> We share only the essential details needed to fulfil your order with trusted partners such as payment gateways and delivery services.</li>
  <li><strong>Protection:</strong> We apply appropriate security measures to protect your data against unauthorised access.</li>
</ul>

<h2>4. Cookies</h2>
<ul>
  <li><strong>Purpose:</strong> Cookies help us remember your preferences and the items in your cart.</li>
  <li><strong>Your Control:</strong> You can disable cookies in your browser settings, though some features of the site may then be limited.</li>
</ul>

<h2>5. Contact Us</h2>
<p>If you have any questions about this Privacy Policy or your personal data, please email us at <a href="mailto:info@karmogroup.com">info@karmogroup.com</a>.</p>
`;

export default function PrivacyPage() {
    return (
        <LegalPageLayout
            slug="privacy"
            fallbackTitle="Privacy Policy"
            heading="Privacy Policy – Karmo Group"
            fallbackContent={CONTENT}
        />
    );
}
