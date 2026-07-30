# Karmo Group — E-Commerce Platform
## Project Requirements Specification

| | |
|---|---|
| **Client** | Karmo Group (foam, mattress, HomeTex, chemicals — manufacturing since 1965) |
| **Prepared by** | *[Your company name]* |
| **Version** | 1.0 — Draft for client review |
| **Status** | Awaiting client sign-off |
| **Language of site** | English only |

> **How to read this document.** Everything listed under *Functional Requirements* is
> what will be built. Everything under *Out of Scope* will not be, unless it is added
> later in writing as a change request. Everything under *Client Responsibilities* is
> what Karmo Group must supply, and by when — the delivery date moves if those are late.
> Section 15 lists decisions that must be made before development can begin.

---

## 1. Project Overview

Karmo Group manufactures foam, mattresses, HomeTex bedding and chemicals, and sells
through dealers and outlets. This project delivers a complete website and e-commerce
platform: a public site covering every division and product, an online store serving two
distinct types of buyer, and a back office run day to day by a staff team with separate,
restricted roles.

**Three things are being delivered:**

1. **A complete public website** — every division, every product, company pages, media.
2. **An e-commerce store** — serving both retail customers and wholesale buyers, with
   separate pricing for each.
3. **An operations back office** — a multi-role admin panel where Karmo staff manage
   products, confirm orders, process them, and record delivery, with each person seeing
   and doing only what their role allows.

### 1.1 Objectives

- Sell directly to retail customers online, nationwide.
- Take wholesale orders online, at wholesale pricing, from approved trade buyers.
- Give Karmo staff a controlled system to run orders end to end.
- Present ~60 products with professional, consistent imagery and motion.

---

## 2. Scope Summary

### 2.1 In Scope

| # | Area | Summary |
|---|---|---|
| 1 | Public website | Homepage, 4 division sections, ~15 sub-pages, company pages, media, blog |
| 2 | Product catalogue | ~60 products, categories, variants, search, filtering |
| 3 | Accounts | Retail self-registration; wholesale registration with admin approval |
| 4 | Pricing | Separate retail and wholesale price lists, quantity tiers, minimum order quantity |
| 5 | Cart and checkout | Cart, address book, delivery charge, order placement |
| 6 | Payments | Online payment gateway plus cash on delivery |
| 7 | Order workflow | Multi-stage order lifecycle with separate staff roles per stage |
| 8 | Admin panel | Products, orders, customers, staff, roles, reports |
| 9 | Notifications | Email and SMS at defined order stages |
| 10 | Creative | 1,000 images and 60 product motion videos |
| 11 | Launch | Deployment, testing, staff training, documentation |

### 2.2 Out of Scope

The following are **not** included and will be quoted separately if required:

- Mobile applications (iOS / Android)
- Bengali or any second language (site is English only — see 7.6)
- Integration with any existing ERP, accounting or inventory system
- Barcode / warehouse scanning hardware
- Multi-warehouse or branch-level stock management
- Automated courier / delivery-partner API integration (delivery is recorded manually)
- Loyalty points, referral schemes, gift cards, subscriptions
- Live chat or chatbot
- SEO campaigns, paid advertising, social media management
- Content writing beyond what is listed in Client Responsibilities
- Product photography of physical goods (images are digitally produced — see 6.1)
- Migration of data from any existing system
- Ongoing hosting fees, gateway transaction fees, SMS credits (see section 9)

---

## 3. User Roles

Nine roles in total. Three are customer-facing, six are staff.

### 3.1 Customer-facing roles

| Role | Who | How they get access |
|---|---|---|
| **Guest** | Anyone browsing | No account needed |
| **Retail Customer** | General public | Self-registration, instant |
| **Wholesale Customer** | Trade buyers, dealers, project buyers | Registration + **manual admin approval** |

### 3.2 Staff roles

| Role | Purpose |
|---|---|
| **Super Admin** | Full control including staff, roles and system settings. Karmo's owner/IT lead. |
| **Admin** | Everything operational — products, orders, customers, reports. Cannot change roles or system settings. |
| **Manager** | Oversight — sees all orders and reports, can intervene, but does not run day-to-day stages. |
| **Order Confirmer** | Reviews new orders and confirms or cancels them. |
| **Order Processor** | Picks, packs and prepares confirmed orders for dispatch. |
| **Delivery Agent** | Records dispatch and delivery outcome. |

> Roles are **assignable per person**. One employee may hold more than one role — for
> example a small branch where the same person confirms and processes orders.

### 3.3 Permission Matrix

`✔` = allowed  ·  `—` = not allowed  ·  `👁` = view only

| Capability | Super Admin | Admin | Manager | Confirmer | Processor | Delivery |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **Products** | | | | | | |
| Create / edit / delete product | ✔ | ✔ | 👁 | — | 👁 | — |
| Manage categories | ✔ | ✔ | 👁 | — | — | — |
| Update stock quantity | ✔ | ✔ | ✔ | — | ✔ | — |
| Set retail price | ✔ | ✔ | — | — | — | — |
| Set wholesale price / tiers | ✔ | ✔ | — | — | — | — |
| **Orders** | | | | | | |
| View all orders | ✔ | ✔ | ✔ | ✔ | ✔ | 👁 own assigned |
| Confirm an order | ✔ | ✔ | ✔ | ✔ | — | — |
| Cancel an order | ✔ | ✔ | ✔ | ✔ | — | — |
| Move to Processing / Packed | ✔ | ✔ | ✔ | — | ✔ | — |
| Mark Dispatched | ✔ | ✔ | ✔ | — | ✔ | ✔ |
| Mark Delivered / Failed | ✔ | ✔ | ✔ | — | — | ✔ |
| Record payment received | ✔ | ✔ | ✔ | — | — | ✔ (COD only) |
| Approve refund / return | ✔ | ✔ | — | — | — | — |
| Edit order contents | ✔ | ✔ | — | — | — | — |
| **Customers** | | | | | | |
| View customer list | ✔ | ✔ | ✔ | 👁 | — | — |
| **Approve wholesale account** | ✔ | ✔ | ✔ | — | — | — |
| Suspend a customer | ✔ | ✔ | — | — | — | — |
| **Content** | | | | | | |
| Edit site pages / banners | ✔ | ✔ | — | — | — | — |
| Publish blog posts | ✔ | ✔ | ✔ | — | — | — |
| **Staff and system** | | | | | | |
| Create staff account | ✔ | — | — | — | — | — |
| Assign / change roles | ✔ | — | — | — | — | — |
| View activity / audit log | ✔ | ✔ | 👁 | — | — | — |
| Change system settings | ✔ | — | — | — | — | — |
| **Reports** | | | | | | |
| Sales reports | ✔ | ✔ | ✔ | — | — | — |
| Stock reports | ✔ | ✔ | ✔ | — | 👁 | — |

---

## 4. Order Lifecycle

Every order moves through defined stages. Only the roles listed may make each move, and
**every change is recorded with who did it and when** (audit log).

```
                 ┌──────────────┐
   Customer ───► │   PENDING    │  order placed, awaiting review
                 └──────┬───────┘
                        │  Order Confirmer
            ┌───────────┴───────────┐
            ▼                       ▼
     ┌─────────────┐         ┌─────────────┐
     │  CONFIRMED  │         │  CANCELLED  │ ◄── stock released
     └──────┬──────┘         └─────────────┘
            │  Order Processor
            ▼
     ┌─────────────┐
     │ PROCESSING  │  picking and packing
     └──────┬──────┘
            │  Order Processor
            ▼
     ┌──────────────────┐
     │ READY FOR        │
     │ DISPATCH         │
     └──────┬───────────┘
            │  Delivery Agent
            ▼
     ┌──────────────────┐
     │ OUT FOR DELIVERY │
     └──────┬───────────┘
            │  Delivery Agent
   ┌────────┴────────┐
   ▼                 ▼
┌───────────┐  ┌──────────────────┐
│ DELIVERED │  │ DELIVERY FAILED  │ ──► retry or return
└─────┬─────┘  └──────────────────┘
      │  Customer requests, Admin approves
      ▼
┌──────────────────┐     ┌──────────┐
│ RETURN REQUESTED │ ──► │ REFUNDED │
└──────────────────┘     └──────────┘
```

### 4.1 Rules

- Stock is **reserved** when an order is placed and **deducted** when confirmed.
- A cancelled order releases its reserved stock automatically.
- An order cannot skip a stage. Backward moves are allowed only for Admin and above.
- Cash-on-delivery payment is recorded by the Delivery Agent at the Delivered step.
- Online payments are recorded automatically by the gateway callback.
- Every stage change writes to the audit log: order, old stage, new stage, user, timestamp.

---

## 5. Functional Requirements

### 5.1 Public Website

| Ref | Requirement |
|---|---|
| PW-01 | Homepage — hero, featured products, divisions, company story, gallery, video, blog |
| PW-02 | Four division landing pages: Foam, Mattress, HomeTex, Chemicals |
| PW-03 | Division sub-pages — Foam (5), HomeTex (4), Chemicals (3), Mattress (1) |
| PW-04 | Company pages: About, History, Board, Awards, Partners |
| PW-05 | Contact pages: Contact, Address, FAQs, Catalogues, Bulk Order enquiry |
| PW-06 | Media: Blog listing and post pages, Video ads, Static ads, Memories |
| PW-07 | Store locator listing Karmo dealers and outlets |
| PW-08 | All pages responsive: mobile, tablet, desktop |
| PW-09 | Contact and enquiry forms with validation, stored in admin and emailed |

### 5.2 Product Catalogue

| Ref | Requirement |
|---|---|
| PC-01 | ~60 products across four divisions |
| PC-02 | Category and sub-category structure, products can sit in multiple categories |
| PC-03 | Product variants — size, thickness, density, colour as applicable |
| PC-04 | Each product: name, description, full specification table, up to 10 images, 1 motion video, price, stock, SKU |
| PC-05 | Listing pages with filters: division, category, price range, size, availability |
| PC-06 | Sorting: newest, price low→high, price high→low, best selling |
| PC-07 | Keyword search across product name, SKU and description |
| PC-08 | Related / recommended products on the product page |
| PC-09 | Stock states: in stock, low stock, out of stock, made to order |

### 5.3 Accounts and Registration

| Ref | Requirement |
|---|---|
| AC-01 | Retail registration: name, mobile, email, password — active immediately |
| AC-02 | Wholesale registration: business name, trade licence number, address, contact person — **held for admin approval** |
| AC-03 | Wholesale applicant sees "pending approval" and cannot see wholesale prices until approved |
| AC-04 | Login by email or mobile number, with password reset |
| AC-05 | Customer account area: profile, address book, order history, order tracking, downloadable invoices |
| AC-06 | Guest checkout permitted for retail only — wholesale requires an approved login |

### 5.4 Pricing

| Ref | Requirement |
|---|---|
| PR-01 | Every product carries a retail price and a separate wholesale price |
| PR-02 | Wholesale prices are visible only to logged-in, approved wholesale customers |
| PR-03 | Quantity tiers for wholesale — e.g. 10–49 units at one rate, 50+ at another |
| PR-04 | Minimum order quantity (MOQ) settable per product for wholesale buyers |
| PR-05 | Discounts: percentage or fixed amount, per product or per category, with start and end dates |
| PR-06 | Delivery charge rules by area — configurable in admin, free above a set order value |
| PR-07 | VAT / tax shown as a separate line if required *(see open decision OD-04)* |

### 5.5 Cart and Checkout

| Ref | Requirement |
|---|---|
| CO-01 | Cart persists for logged-in users across devices |
| CO-02 | Cart shows per-line price, quantity, subtotal, delivery, total |
| CO-03 | MOQ enforced at cart level for wholesale buyers |
| CO-04 | Checkout: delivery address, billing address, delivery method, payment method, order review |
| CO-05 | Order confirmation page and confirmation email/SMS |
| CO-06 | Stock re-validated at the moment of payment; clear message if an item ran out |

### 5.6 Payments

| Ref | Requirement |
|---|---|
| PY-01 | Online payment gateway — bKash / Nagad / cards via a single aggregator *(see OD-02)* |
| PY-02 | Cash on delivery, with the option to restrict it by area or order value |
| PY-03 | Wholesale credit terms — **only if decided** *(see OD-03)* |
| PY-04 | Payment status recorded against every order: unpaid, paid, partially paid, refunded |
| PY-05 | Failed payments leave the order recoverable, not lost |

### 5.7 Admin Panel

| Ref | Module | Contents |
|---|---|---|
| AD-01 | Dashboard | Today's orders, revenue, pending confirmations, low stock, recent activity |
| AD-02 | Products | List, create, edit, bulk stock update, image and video upload, category management |
| AD-03 | Orders | Filterable list, order detail, stage actions, printable invoice and packing slip |
| AD-04 | Customers | Retail and wholesale lists, wholesale approval queue, customer order history |
| AD-05 | Staff & Roles | Create staff, assign roles, deactivate — Super Admin only |
| AD-06 | Content | Edit page banners, homepage sections, blog posts, FAQs |
| AD-07 | Enquiries | Contact form and bulk-order enquiry inbox |
| AD-08 | Reports | Sales by period, by product, by division, by customer type; stock report |
| AD-09 | Settings | Delivery charges, tax, payment methods, notification templates — Super Admin only |
| AD-10 | Audit log | Every staff action with user and timestamp |

### 5.8 Notifications

| Event | Customer | Staff |
|---|---|---|
| Order placed | Email + SMS | Order Confirmer notified |
| Order confirmed | Email + SMS | Order Processor notified |
| Order dispatched | Email + SMS | Delivery Agent notified |
| Order delivered | Email + SMS | — |
| Order cancelled | Email + SMS | Manager notified |
| Wholesale account approved | Email + SMS | — |
| Low stock reached | — | Admin notified |

---

## 6. Creative Deliverables

### 6.1 Images — 1,000 total

| Group | Count | Notes |
|---|---|---|
| Product images | 600 | 10 per product × 60 products |
| Page images | ~400 | Homepage, About, Contact, division pages, blog, banners — approx. 10 per page |

- All images are **digitally produced and composited** — this is not photography of
  physical goods. Karmo Group must confirm they accept digitally produced imagery
  representing their products (see CR-06).
- Delivered web-optimised in modern formats, correctly sized for each placement.
- **Revisions: two rounds per image.** Further revisions are chargeable.

### 6.2 Motion — 60 videos

- One motion video per product.
- Consistent treatment across the range, built from a template established on the first
  few, so the set reads as one family.
- Delivered web-optimised, muted-autoplay safe, with a poster frame.
- **Revisions: two rounds per video.**

### 6.3 UI/UX Design

- Storefront screens: catalogue, filters, product detail, cart, checkout, account,
  order tracking, wholesale-specific views — approx. 18 screens.
- Admin panel screens: approx. 20 screens.
- All delivered as responsive designs working to a single design system, so the store
  and the back office feel like one product.

---

## 7. Non-Functional Requirements

| Ref | Requirement |
|---|---|
| NF-01 | **Performance** — product and listing pages load within 3 seconds on a normal Bangladeshi mobile connection |
| NF-02 | **Responsive** — fully usable on mobile, tablet and desktop |
| NF-03 | **Browsers** — latest two versions of Chrome, Firefox, Safari, Edge; Android Chrome; iOS Safari |
| NF-04 | **Security** — passwords hashed, HTTPS throughout, role checks enforced on the server not just in the interface, protection against common web attacks |
| NF-05 | **Payment security** — no card details ever stored on Karmo's servers; all handled by the gateway |
| NF-06 | **SEO** — clean URLs, page titles and descriptions, sitemap, structured data for products |
| NF-07 | **Backups** — automated daily database backup |
| NF-08 | **Availability** — target 99% uptime, excluding scheduled maintenance |
| NF-09 | **Audit** — all staff actions on orders and products logged and viewable |

### 7.6 Language

The site is **English only**. Bengali is not included. Adding Bengali later means
translating every page, product description and email template, and is a separate project.

---

## 8. Technical Approach

- **Frontend:** Next.js (App Router) with React and Tailwind CSS.
- **Backend:** REST API with a relational database. *Final stack in OD-01.*
- **Hosting:** cloud hosting with a CDN for images and video.
- **Media:** object storage plus CDN. 1,000 images and 60 videos is substantial —
  storage and bandwidth are ongoing costs (see section 10).

---

## 9. Third-Party Services — Paid Directly by Karmo Group

These are **not** included in the project price and are billed to Karmo Group directly,
either as their own accounts or passed through at cost:

| Service | Notes |
|---|---|
| Domain name | Annual |
| Hosting / server | Monthly or annual |
| SSL certificate | Often included with hosting |
| Media storage and CDN | Scales with traffic — significant with 1,000 images and 60 videos |
| Payment gateway | Setup fee plus a percentage of every transaction |
| SMS gateway | Per-message credits |
| Transactional email | Monthly, based on volume |

---

## 10. Client Responsibilities

The project cannot proceed without these. **Each item has a deadline, and the delivery
date moves by the same number of days that any item is late.**

| Ref | Karmo Group must supply | Needed by |
|---|---|---|
| CR-01 | Final list of ~60 products with names, categories and variants | Before design starts |
| CR-02 | Complete specification for every product — size, density, material, warranty | Week 2 |
| CR-03 | Retail price and wholesale price (with tiers and MOQ) for every product | Week 3 |
| CR-04 | Official logo files in vector format | Week 1 |
| CR-05 | Dealer and outlet list for the store locator | Week 4 |
| CR-06 | **Written confirmation that digitally produced imagery is acceptable** | Before design starts |
| CR-07 | Payment gateway merchant account — approved and credentials issued. *This can take several weeks and is outside our control.* | Week 4 |
| CR-08 | SMS gateway account and sender ID | Week 5 |
| CR-09 | Company content — history, board, awards, partners | Week 4 |
| CR-10 | Delivery charge rules by area, and return/refund policy text | Week 5 |
| CR-11 | Named staff members and which role each should hold | Week 8 |
| CR-12 | A single named person empowered to approve work and sign off each stage | Immediately |

### 10.1 Items requiring Karmo Group's written confirmation

The following arise from materials supplied by Karmo Group and must be settled in
writing, because Karmo Group is responsible for the accuracy and legality of its own
claims:

| Ref | Issue |
|---|---|
| CR-13 | A video supplied in Karmo's own materials (`reel-2.mp4`) shows equipment branded **"durfi"**, a competing mattress brand. It has been removed. A replacement is needed, or the slot stays empty. |
| CR-14 | A supplied video presents the **CertiGuard** antimicrobial certification mark. Karmo Group must confirm it genuinely holds this certification before it appears on the site. |
| CR-15 | Trust claims in the supplied materials — *"Market leader in foam"*, *"Recommended by doctors"*, *"Trusted by families"* — came from a layout originally belonging to another company. Karmo Group must confirm each claim it wishes to keep, and supply evidence where a regulator could ask for it. |
| CR-16 | Several supplied product photographs have promotional overlays burned in (prices, "20% off", hotline numbers). Clean versions are required. |
| CR-17 | The archive foam commercial is 352×288 pixels and will look poor at any usable size. A higher-resolution master is needed, or it is dropped. |
| CR-18 | Two different WhatsApp numbers appear in Karmo's materials (…3254 and …3284). One must be confirmed. |
| CR-19 | Karmo Group is responsible for the accuracy of all product specifications, prices and claims published on the store. |

---

## 11. Acceptance Criteria

Each stage is accepted when:

1. Every requirement in the relevant section performs as written.
2. It works correctly on mobile, tablet and desktop, on the browsers in NF-03.
3. Role permissions behave exactly as the matrix in 3.3 states, tested per role.
4. The full order lifecycle runs end to end, including a live test payment and refund.
5. No known defect remains that blocks a customer from completing a purchase.
6. Karmo's named approver (CR-12) signs off in writing within **5 working days** of
   delivery. If no response is received in that time, the stage is treated as accepted.

---

## 12. Assumptions

1. Product count is approximately 60. A material increase changes image count, timeline and price.
2. Ten images per product, one motion video per product — as requested by the client.
3. English only.
4. One currency: Bangladeshi Taka.
5. Delivery is within Bangladesh only.
6. Stock is managed at a single location, not per branch.
7. Karmo Group has, or will obtain, its own hosting and gateway accounts.

---

## 13. Risks

| Risk | Impact | How it is handled |
|---|---|---|
| Payment gateway approval delayed | Launch slips | Flagged as CR-07, with the delivery date moving day for day |
| Product data arrives late or incomplete | Everything downstream stalls | CR-01 to CR-03 have dated deadlines |
| Image revisions exceed the agreed rounds | Cost and time overrun | Two rounds per image are included; further rounds are chargeable |
| Scope grows during build | Cost and time overrun | Anything not in section 6 is a written change request |
| Wholesale rules turn out to be more complex than described | Rework | Settled before build via OD-03 |

---

## 14. Delivery Approach

Work is delivered in three stages so Karmo Group can start selling before everything
is finished, rather than waiting for the whole platform.

| Stage | Contents | Outcome |
|---|---|---|
| **Stage 1** | UI/UX design, public website complete, product catalogue browsable, first 20 products fully imaged | Full website live, products visible, enquiries working |
| **Stage 2** | Retail accounts, cart, checkout, payments, order placement, next 20 products | **Karmo can take and be paid for retail orders online** |
| **Stage 3** | Wholesale accounts and pricing, full multi-role admin panel, order workflow, remaining 20 products, all motion videos, staff training | Complete platform handed over |

---

## 15. Open Decisions — Required Before Development Starts

Development cannot begin until these are answered. Each one changes what gets built.

| Ref | Decision needed | Why it matters |
|---|---|---|
| **OD-01** | Backend technology stack and hosting provider | Determines architecture, cost and who can maintain it later |
| **OD-02** | Which payment gateway — bKash, Nagad, SSLCommerz, or an aggregator covering several | Each is separate integration work; an aggregator is usually cheaper overall |
| **OD-03** | **How wholesale actually works:** Is approval required for every trade account? Are there fixed quantity tiers, or negotiated per-customer prices? Is there credit / pay-later? Is there a minimum order value as well as MOQ? | This is the single largest source of scope disagreement in e-commerce projects. It must be written down before build. |
| **OD-04** | Is VAT charged, and shown separately? Is a BIN number to be displayed? | Affects checkout, invoices and reports |
| **OD-05** | Return and refund policy — window, who pays return delivery, refund method | Affects order states and customer-facing text |
| **OD-06** | Does Karmo want customers to see live stock numbers, or only in/out of stock? | Affects the product page and stock handling |
| **OD-07** | Who at Karmo Group is the single approver (CR-12)? | Without one named person, sign-off stalls |

---

## 16. Sign-Off

By signing, Karmo Group confirms that this document describes the system to be built,
that anything not listed in section 5 is outside the agreed scope, and that the
responsibilities in section 10 are accepted.

| | Karmo Group | *[Your company]* |
|---|---|---|
| **Name** | | |
| **Position** | | |
| **Signature** | | |
| **Date** | | |
