import type { Metadata } from 'next';
import LegalPageLayout from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description: "Read the Terms & Conditions for using Karmo Group's online marketplace and shopping services in Bangladesh.",
    alternates: { canonical: "/terms" },
};

const CONTENT = `
<p>Welcome to Karmo Group. By accessing or using our website and purchasing products from us, you agree to be bound by the following Terms and Conditions. Please read them carefully before placing an order.</p>

<h2>1. General Overview</h2>
<ul>
  <li><strong>Company Legacy:</strong> Established in 1965, Karmo Group is a pioneer and market leader in Bangladesh, manufacturing polyurethane foam, mattresses, home textiles, and industrial adhesives.</li>
  <li><strong>Policy Amendments:</strong> Karmo Group reserves the right to modify, update, or replace any part of these Terms and Conditions at any time without prior notice.</li>
</ul>

<h2>2. Orders &amp; Pricing</h2>
<ul>
  <li><strong>Product Availability:</strong> All orders are subject to product availability and confirmation of order details.</li>
  <li><strong>Pricing Updates:</strong> Prices for products are subject to change without prior notice.</li>
  <li><strong>Payment Methods:</strong> We accept Cash On Delivery (COD), Mobile Financial Services (bKash, Nagad), Credit/Debit Cards, and Direct Bank Transfers.</li>
</ul>

<h2>3. Shipping and Delivery Policy</h2>
<ul>
  <li><strong>Order Processing:</strong> Orders are processed within 24 to 48 hours of confirmation (excluding weekends and public holidays).</li>
  <li><strong>Custom Orders:</strong> Custom or made-to-order items (e.g., specialized foam cuts or custom mattress dimensions) require an additional 3–5 working days for production.</li>
  <li><strong>Delivery Timelines:</strong>
    <ul>
      <li><strong>Inside Dhaka:</strong> Delivered within 2 to 4 working days.</li>
      <li><strong>Outside Dhaka (Nationwide):</strong> Delivered within 4 to 7 working days through our nationwide dealer network and logistics partners.</li>
    </ul>
  </li>
  <li><strong>Shipping Charges:</strong> Shipping fees are calculated at checkout based on product weight, volume (especially for bulky items like mattresses and foam blocks), and the delivery destination.</li>
  <li><strong>Order Tracking:</strong> Upon dispatch, customers will receive an SMS/Email containing tracking details to monitor shipment progress in real time.</li>
</ul>

<h2>4. Delivery Inspection &amp; Acceptance</h2>
<ul>
  <li><strong>Inspect on Arrival:</strong> Please inspect the product's condition, quantity, and appearance in front of the delivery agent before signing.</li>
  <li><strong>After Acceptance:</strong> Claims regarding damage, missing items, or visible defects raised after the agent has left may not be eligible for return or replacement.</li>
  <li><strong>Damaged Packaging:</strong> If the packaging is visibly damaged, photograph it and notify both the delivery agent and our support team.</li>
</ul>

<h2>5. Return and Refund Policy</h2>
<ul>
  <li><strong>Return Window:</strong> Return or exchange requests must be made within 7 days of receiving the product — for damaged or defective items, wrong specifications, or warranty-covered defects.</li>
  <li><strong>Condition:</strong> Items must be unused, unwashed, and in their original packaging with tags and invoice. Unsealed hygiene items (pillows, bedsheets, comforters, duvets) cannot be returned unless there is a proven manufacturing defect.</li>
  <li><strong>Refunds:</strong> Approved refunds are issued to the original payment method within 7–10 working days after inspection. Original shipping fees are non-refundable unless the error was ours.</li>
</ul>

<h2>6. Privacy &amp; Data Protection</h2>
<ul>
  <li><strong>Data We Collect:</strong> We collect the personal details needed to process your orders and provide support.</li>
  <li><strong>Security:</strong> We do not store full card numbers or banking passwords, and we never sell or rent your data — it is shared only with our logistics and payment partners to fulfil your order.</li>
</ul>

<h2>7. Intellectual Property</h2>
<p>All website content — including logos, designs, text, and trademarks — belongs to Karmo Group. Unauthorised reproduction or use is strictly prohibited.</p>

<h2>8. Customer Support &amp; Contact</h2>
<ul>
  <li><strong>Head Office:</strong> Ibrahim Chamber, 4th Floor, 95 Motijheel, Dhaka-1000.</li>
  <li><strong>Factory:</strong> Konapara, Paradogair, Demra, Dhaka-1362.</li>
  <li><strong>Helpline:</strong> +88 01713-483284 (daily, 9:00 AM – 10:00 PM).</li>
  <li><strong>Email:</strong> <a href="mailto:support@karmogroup.com">support@karmogroup.com</a> or <a href="mailto:info@karmogroup.com">info@karmogroup.com</a>.</li>
</ul>
`;

export default function TermsPage() {
    return (
        <LegalPageLayout
            slug="terms"
            fallbackTitle="Terms & Conditions"
            heading="Terms and Conditions – Karmo Group"
            fallbackContent={CONTENT}
        />
    );
}
