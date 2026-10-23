import type { Metadata } from 'next';
import LegalPageLayout from '@/components/shared/LegalPageLayout';

export const metadata: Metadata = {
    title: "Refund & Return Policy",
    description: "Understand Karmo Group's refund and return policy — how to request a refund, eligibility, and timelines for orders in Bangladesh.",
    alternates: { canonical: "/refund" },
};

const CONTENT = `
<p>We want you to be completely satisfied with your purchase. If something isn't right, here is how our refund and return process works.</p>

<h2>1. Eligibility for Returns &amp; Exchanges</h2>
<p>You may request a return or exchange within <strong>7 days</strong> of receiving your product in the following cases:</p>
<ul>
  <li><strong>Damaged or Defective:</strong> The item arrives physically damaged, torn, or defective.</li>
  <li><strong>Wrong Item:</strong> The product does not match your order — for example in size, thickness, colour, or model.</li>
  <li><strong>Warranty Defect:</strong> The item has a manufacturing defect covered by warranty (applies to mattresses and selected foam products).</li>
</ul>

<h2>2. Return Conditions</h2>
<ul>
  <li><strong>Original Condition:</strong> The product must be unused, unwashed, and in its original packaging with all tags, labels, and the original invoice intact.</li>
  <li><strong>Hygiene Items:</strong> Hygiene-sensitive items such as unsealed pillows, bedsheets, or duvets cannot be returned once unsealed, unless they are defective.</li>
</ul>

<h2>3. Refund Process</h2>
<ul>
  <li><strong>Inspection:</strong> Once your return reaches our warehouse and has been inspected, we will notify you whether the refund is approved or rejected.</li>
  <li><strong>Timeline:</strong> Approved refunds are issued to your original payment method (bKash, Nagad, credit card, or bank transfer) within <strong>7–10 working days</strong>.</li>
  <li><strong>Shipping Fees:</strong> Shipping fees are non-refundable unless the return is due to an error on our end.</li>
</ul>

<h2>4. How to Request a Return</h2>
<p>Contact our Customer Service team at <a href="mailto:support@karmogroup.com">support@karmogroup.com</a> or call our helpline. Please include your order number along with photo or video evidence of the issue so we can resolve it quickly.</p>
`;

export default function RefundPage() {
    return (
        <LegalPageLayout
            slug="refund"
            fallbackTitle="Refund & Return Policy"
            heading="Refund & Return Policy – Karmo Group"
            fallbackContent={CONTENT}
        />
    );
}
