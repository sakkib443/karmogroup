# 📊 Karmo Group — Comprehensive Technical Documentation & Complete Page/Section Analysis

Frontend web application for **Karmo Group of Industries** — Bangladesh's premier conglomerate and pioneer in polyurethane manufacturing since 1965, specializing in Foam, Mattress, HomeTex, and Industrial Chemicals.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Redux Toolkit / RTK Query**, and **Framer Motion**.

---

## 📑 সূচিপত্র (Table of Contents)
1. 🚀 [Getting Started & Environment Setup](#-getting-started--environment-setup)
2. 🏗️ [Project Architecture & Directory Structure](#️-project-architecture--directory-structure)
3. 📌 [১. বর্তমান পেজসমূহ ও সেকশন সমূহের বিস্তারিত ব্যাকডাউন (Existing Pages & Sections Breakdown)](#-১-বর্তমান-পেজসমূহ-ও-সেকশন-সমূহের-বিস্তারিত-ব্যাকডাউন-existing-pages--sections-breakdown)
   - 🏡 [১.১ হোম পেজসমূহ (Home Variations: Home 1, Home 2, Home 3)](#-১১-হোম-পেজসমূহ-home-variations-home-1-home-2-home-3)
   - 🏢 [১.২ কোম্পানি ও ক্যাটালগ পেজসমূহ (About, Foam, Portfolio)](#-১২-কোম্পানি-ও-ক্যাটালগ-পেজসমূহ-about-foam-portfolio)
   - 📦 [১.৩ ই-কমার্স ও প্রোডাক্ট পেজসমূহ (Shop, Product Detail, Cart, Checkout, Wishlist)](#-১৩-ই-কমার্স-ও-প্রোডাক্ট-পেজসমূহ-shop-product-detail-cart-checkout-wishlist)
   - 📞 [১.৪ কন্টাক্ট ও সার্ভিস পেজসমূহ (Contact, Services, Cost Calculator, Ship For Me, Quotations)](#-১৪-কন্টাক্ট-ও-সার্ভিস-পেজসমূহ-contact-services-cost-calculator-ship-for-me-quotations)
   - 🔐 [১.৫ অথেন্টিকেশন পেজসমূহ (Login, Register, Password Recovery, Verification)](#-১৫-অথেন্টিকেশন-পেজসমূহ-login-register-password-recovery-verification)
   - 📊 [১.৬ ইউজার ড্যাশবোর্ড (User Portal & Sub-Pages)](#-১৬-ইউজার-ড্যাশবোর্ড-user-portal--sub-pages)
   - 🛡️ [১.৭ এডমিন ড্যাশবোর্ড (Admin Control Panel & Sub-Pages)](#-১৭-এডমিন-ড্যাশবোর্ড-admin-control-panel--sub-pages)
   - ⚖️ [১.৮ পলিসি ও ইউটিলিটি পেজসমূহ (Privacy, Terms, Refund, Track, Auto-login)](#-১৮-পলিসি-ও-ইউটিলিটি-পেজসমূহ-privacy-terms-refund-track-auto-login)
4. 🚀 [২. ওয়েবসাইটের জন্য নতুন প্রস্তাবিত সেকশনসমূহ (Comprehensive New Recommended Sections)](#-২-ওয়েবসাইটের-জন্য-নতুন-প্রস্তাবিত-সেকশনসমূহ-comprehensive-new-recommended-sections)
   - 🎯 [২.১ হোম পেজের জন্য নতুন সেকশন (New Homepage Sections)](#-২১-হোম-পেজের-জন্য-নতুন-সেকশন-new-homepage-sections)
   - 🏛️ [২.২ অ্যাবাউট আস পেজের জন্য নতুন সেকশন (New About Page Sections)](#-২২-অ্যাবাউট-আস-পেজের-জন্য-নতুন-সেকশন-new-about-page-sections)
   - 🛒 [২.৩ প্রোডাক্ট ডিটেইলস পেজের জন্য নতুন সেকশন (New Product Detail Sections)](#-২৩-প্রোডাক্ট-ডিটেইলস-পেজের-জন্য-নতুন-সেকশন-new-product-detail-sections)
   - 🏭 [২.৪ ক্যাটালগ ও বিটুবি পেজের জন্য নতুন সেকশন (New B2B & Industrial Sections)](#-২৪-ক্যাটালগ-ও-বিটুবি-পেজের-জন্য-নতুন-সেকশন-new-b2b--industrial-sections)
   - 🛍️ [২.৫ ই-কমার্স ও চেকআউট সেকশন (New E-Commerce & Conversion Boosters)](#-২৫-ই-কমার্স-ও-চেকআউট-সেকশন-new-e-commerce--conversion-boosters)
   - 🔔 [২.৬ সাইট-ওয়াইড গ্লোবাল উইজেট (Global System Enhancements)](#-২৬-সাইট-ওয়াইড-গ্লোবাল-উইজেট-global-system-enhancements)
5. 🛠️ [Tech Stack & State Management Guide](#-tech-stack--state-management-guide)

---

## 🚀 Getting Started & Environment Setup

### Installation & Local Server

```bash
# Repository ক্লোন করার পর ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন (Default Port: 3000)
npm run dev

# নির্দিষ্ট পোর্টে চালনার জন্য:
npm run dev -- -p 3005
```

> **Environment Configuration (`.env.local`):**
> ```env
> NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
> NEXT_PUBLIC_SITE_URL=http://localhost:3000
> ```

---

## 🏗️ Project Architecture & Directory Structure

```files
client/
├── src/
│   ├── app/                    # Next.js App Router Structure
│   │   ├── (auth)/             # Login, Register, Forgot Password, Reset Password, Verify Email
│   │   ├── (karmo)/            # Home 2 Route Variant (/home-2)
│   │   ├── (karmo-2)/          # Primary Public Routes (/, /about, /foam, /portfolio, /product-detail)
│   │   ├── (karmo-3)/          # Home 3 Route Variant (/home-3)
│   │   ├── (main)/             # Shop, Services, Contact, Cart, Checkout, Wishlist, Calculator, Ship-For-Me
│   │   ├── dashboard/          # Nested User & Admin Portals
│   │   │   ├── admin/          # Products, Bulk Upload, Orders, Scanner, Offers, Shipping, CMS
│   │   │   └── user/           # Orders, Profile, Wishlist, Invoices, Payments, Reviews, Returns
│   │   ├── track/              # Order Tracking Page
│   │   └── auto-login/         # One-click Admin/Token Auto Authenticator
│   ├── components/             # Reusable & Modular Components
│   │   ├── karmo/              # Karmo Design System Components (Home2, About, Foam, Portfolio, Product)
│   │   ├── ui/                 # Core UI Elements (Modals, Badges, Loaders, Sliders)
│   │   └── shared/             # Header, Footer, Navigation, Floating Contact Action Bar
│   ├── redux/                  # Centralized Redux Store & RTK Query APIs
│   │   ├── api/                # Products, Categories, Orders, Auth, Site Content RTK Queries
│   │   └── features/           # Cart Slice, Wishlist Slice, User Session Slice
│   └── utils/                  # Helper Functions, Currency Formatters, Image Optimization
```

---

## 📌 ১. বর্তমান পেজসমূহ ও সেকশন সমূহের বিস্তারিত ব্যাকডাউন (Existing Pages & Sections Breakdown)

---

### 🏡 ১.১ হোম পেজসমূহ (Home Variations: Home 1, Home 2, Home 3)

ওয়েবসাইটে মূল ব্র্যান্ড ল্যান্ডিংয়ের জন্য ৩টি বিশেষ ভ্যারিয়েন্ট ডিজাইন করা রয়েছে। বর্তমান মূল হোমপেজ হিসেবে `Home 2` (`src/app/(karmo-2)/page.jsx`) সক্রিয় আছে।

#### 📍 Home 2 (Primary Homepage — `/`)
* **উপাদানকারী কম্পোনেন্টসমূহ (Components):** `HeroTwo`, `StandardStrip`, `DivisionsStrip`, `CollectionsShowcase`, `ShoppableScene`, `FoamStory`, `FoamPromise`, `PopularProductsGrid`, `Reels`, `CertifiedBy`, `OrderAndContact`.
* **বর্তমান সেকশনসমূহের বিস্তারিত তথ্য:**
  1. **Hero Banner Section (`HeroTwo`):** 
     - ফুল-উইডথ প্রিমিয়াম ইমেজ ব্যানার, ব্র্যান্ড স্লোগান ("Made in Bangladesh since 1965")।
     - প্রাইমারি কল-টু-অ্যাকশন বাটন ("Explore Foam Catalogue", "Contact Sales")।
  2. **Standard & Heritage Strip (`StandardStrip`):**
     - ১৯৬৫ সালে যাত্রা শুরুর ঐতিহাসিক রেকর্ড, ৪টি ইন্ডাস্ট্রিয়াল ডিভিশন এবং ৭৪৭+ ডিলার পয়েন্টের কাউন্টার কার্ড।
  3. **Divisions Overview Strip (`DivisionsStrip`):**
     - ৪টি প্রধান ডিভিশন: Foam, Mattress, HomeTex, Chemicals এর হাই-রেজোলিউশন ভিজ্যুয়াল ও ডাইরেক্ট নেভিগেশন লিঙ্ক।
  4. **Collections Showcase (`CollectionsShowcase` - Toggleable):**
     - সেরা বিক্রিত, নতুন আগত প্রোডাক্ট এবং স্পেশাল ডিসকাউন্ট কালেকশন স্লাইডার।
  5. **Shoppable Scene (`ShoppableScene`):**
     - ইন্টারঅ্যাক্টিভ রুমে প্রোডাক্ট প্লেসমেন্ট পয়েন্টার। পিন-পয়েন্টে ক্লিক করলে সরাসরি প্রোডাক্ট কার্ড ভেসে ওঠে।
  6. **Brand / Material Story (`FoamStory`):**
     - কারমো ফোমের কাঁচামালের বিশুদ্ধতা (Pure Rubber Grade), ডিউরেবিলিটি এবং ইকো-ফ্রেন্ডলি ম্যানুফ্যাকচারিং প্রসেসের গল্প।
  7. **Product Promise Video Parallax (`FoamPromise`):**
     - ভিউপোর্টে পিন করা প্রোডাক্ট ফিল্ম ব্যাকগ্রাউন্ড, যার ওপর দিয়ে টেক্সট স্ক্রল হয়। ফোমের রিবাউন্ড ও ইলাস্টিসিটি প্রদর্শন করে।
  8. **Popular Products Grid (`PopularProductsGrid`):**
     - মেট্রেস ও ফোম প্রোডাক্টের গ্রিড ক্যাটালগ। সাইজ সিলেক্টর, ডিসকাউন্ট প্রাইস ও কার্ট বাটন্স যুক্ত।
  9. **Reels & Editorial Video Strip (`Reels`):**
     - ইনস্টাগ্রাম/ইউটিউব রিলস ফরম্যাটে প্রোডাক্ট টেস্ট এবং ফ্যাক্টরি মেকিং ভিডিও ফিড।
  10. **Certifications & Testing Accreditation (`CertifiedBy`):**
      - ISO ৯০০১, ISO ১৪০০০ এবং আন্তর্জাতিক ল্যাব টেস্টিং অ্যাপ্রুভাল ব্যাজ ও সার্টিফিকেট কার্ড।
  11. **Order Pathway & Direct Contact Banner (`OrderAndContact`):**
      - অর্ডার করার ৩টি ধাপ (Choose -> Sample/Quote -> Delivery) এবং সরাসরি হোয়াটসঅ্যাপ/মতিঝিল অফিসের কন্টাক্ট লিঙ্ক।

---

### 🏢 ১.২ কোম্পানি ও ক্যাটালগ পেজসমূহ (About, Foam, Portfolio)

#### 📍 About Us Page (`/about` — `src/app/(karmo-2)/about/page.jsx`)
* **উপাদানকারী কম্পোনেন্টসমূহ:** `AboutBanner`, `AboutFigures`, `AboutStory`, `ChairmanMessage`, `AboutDivisions`, `AboutStrength`, `AboutFacilities`, `AboutReach`, `CertifiedBy`, `OrderAndContact`.
* **বর্তমান সেকশনসমূহের বিস্তারিত তথ্য:**
  1. **About Hero Banner (`AboutBanner`):** গ্রুপের কর্পোরেট পরিচয় ও মূল লক্ষ্য।
  2. **Key Metrics & Statistics (`AboutFigures`):** ৬০ বছরের ইতিহাস, কারখানা সংখ্যা, বার্ষিক উৎপাদন ক্ষমতা ও ডিলার কভারেজ কার্ড।
  3. **Karmo Origin Story (`AboutStory`):** বাংলাদেশে প্রথম পলিউরেথেন ফোম ফ্যাক্টরি প্রতিষ্ঠার ঐতিহাসিক বিবরণ।
  4. **Chairman's Vision & Message (`ChairmanMessage`):** চেয়ারম্যান মহোদয়ের ভিশন সম্পর্কিত প্রিমিয়াম ডার্ক থিমড মেসেজ কার্ড।
  5. **Industrial Divisions (`AboutDivisions`):** ফোম, মেট্রেস, হোম-টেক্সটাইল ও ক্যামিক্যাল ফ্যাক্টরির বিস্তারিত তথ্য।
  6. **R&D and Industrial Strength (`AboutStrength`):** জার্মান ও জাপানি প্রযুক্তির ব্যবহার এবং ল্যাব রিসার্চ টেকনোলজি।
  7. **Manufacturing Facilities (`AboutFacilities`):** ফ্যাক্টরির ভৌগোলিক অবস্থান, পরিবেশ বান্ধব বর্জ্য ব্যবস্থাপনা ও প্ল্যান্ট ক্যাপাসিটি।
  8. **Nationwide Distribution Network (`AboutReach`):** ৬৪ জেলায় বিস্তৃত ডিলারশিপ ও ডেলিভারি নেটওয়ার্ক।

#### 📍 Foam Division Catalogue (`/foam` — `src/app/(karmo-2)/foam/page.jsx`)
* **উপাদানকারী কম্পোনেন্টসমূহ:** `FoamBanner`, `FoamFeatures`, `FoamCategories`, `FoamProducts`, `OrderAndContact`.
* **বর্তমান সেকশনসমূহের বিস্তারিত তথ্য:**
  1. **Foam Banner:** ক্যাটালগ হেডার ও ইন্ডাস্ট্রিয়াল ফোম হাইলাইটার।
  2. **Foam Features:** ডেনসিটি গ্রেড (Soft, Medium, High Density, Rebonded), রিবাউন্ড রেট ও ফায়ার-রেজিস্ট্যান্ট বৈশিষ্ট্য।
  3. **Category Tabs:** Furniture, Footwear, Automotive, Soundproof & Specialty Foam ক্যাটাগরি ফিল্টার।
  4. **Product Grid:** পছন্দকৃত ফোমের স্পেসিফিকেশন ও কাস্টম অর্ডার বাটন।

#### 📍 Portfolio & Project Showcase (`/portfolio` — `src/app/(karmo-2)/portfolio/page.jsx`)
* **উপাদানকারী কম্পোনেন্টসমূহ:** `PortfolioBanner`, `PortfolioGallery`, `CertifiedBy`, `OrderAndContact`.
* **বর্তমান সেকশনসমূহের বিস্তারিত তথ্য:**
  1. **Portfolio Header Banner:** প্রজেক্ট গ্যালারি হেডার।
  2. **Filterable Photo Gallery:** ৪টি শিল্প প্রতিষ্ঠানের বাস্তব প্রজেক্ট ছবি ও ফিল্টারিং পোর্টফোলিও।

---

### 📦 ১.৩ ই-কমার্স ও প্রোডাক্ট পেজসমূহ (Shop, Product Detail, Cart, Checkout, Wishlist)

#### 📍 Product Detail Page (`/product-detail` / `/product/[slug]`)
* **উপাদানকারী কম্পোনেন্টসমূহ:** `ProductHero`, `ProductPromiseStrip`, `ProductLifestyle`, `ProductFirmnessGuide`, `ProductLayers`, `ProductVideoFeatures`, `CertifiedBy`, `OrderAndContact`.
* **বর্তমান সেকশনসমূহের বিস্তারিত তথ্য:**
  1. **Product Hero & Buy Box:** ইমেজ গ্যালারি (Zoom enabled), দাম, ডিসকাউন্ট, সাইজ ভ্যারিয়েন্ট (Single, Double, Queen, King), থিকনেস, ডেনসিটি সিলেক্টর ও কার্ট বাটন।
  2. **Promise Badges:** ১৫ বছরের ওয়ারেন্টি, ফ্রি ডেলিভারি ও ১০০% রাবার গ্রেড গ্যারান্টি ব্যাজ।
  3. **Lifestyle Room Setting:** বাস্তব বেডরুম ও ফার্নিচারে প্রোডাক্ট ভিজ্যুয়ালাইজেশন।
  4. **Firmness Scale Guide:** মেট্রেসের নরম বা শক্ত মাত্রা নির্দেশক ভিজ্যুয়াল স্কেল (Soft -> Medium -> Firm)।
  5. **Layer Breakdown Diagram:** মেট্রেসের ভেতরের প্রতিটি লেয়ারের (Memory Foam, High Density Foam, HR Foam) ৩ডি আর্কিটেকচার।
  6. **Video Feature Demonstration:** ফোমের প্রেস-রিকভারি ও এয়ারফ্লো টেস্ট ভিডিও।

#### 📍 Shop Page (`/shop` / `/products`)
* **বর্তমান সেকশনসমূহ:** সার্চ বার, ক্যাটাগরি সাইডবার, প্রাইস ফিল্টার স্লাইডার, মেট্রেস/ফোম সাইজ ফিল্টার, সোর্টিং (Price Low to High, Newest) এবং প্রোডাক্ট কার্ড গ্রিড।

#### 📍 Shopping Cart (`/cart`) & Checkout (`/checkout`)
* **Cart Page:** প্রোডাক্টের তালিকা, সাইজ/ভ্যারিয়েন্ট সংশোধন, পরিমাণ বৃদ্ধি/হ্রাস, কুপন ইনপুট এবং প্রাইস সামারি।
* **Checkout Page:** শিপিং অ্যাড্রেস ইনপুট, সিটি/জোন সিলেকশন, মেথড (Cash on Delivery / Online Payment Gateway) এবং অর্ডার রিভিউ।

---

### 📞 ১.৪ কন্টাক্ট ও সার্ভিস পেজসমূহ (Contact, Services, Cost Calculator, Ship For Me, Quotations)

#### 📍 Contact Us Page (`/contact` — `src/app/(main)/contact/page.tsx`)
* **উপাদানকারী কম্পোনেন্টসমূহ:** `ContactBanner`, `ContactChannels`, `ContactFormSection`.
* **বর্তমান সেকশনসমূহের বিস্তারিত তথ্য:**
  1. **Contact Header Banner:** কন্টাক্ট ইনফো হেডার।
  2. **Direct Contact Cards:** ফোন কল অপশন, হোয়াটসঅ্যাপ চ্যাট লিঙ্ক, কর্পোরেট ইমেইল ও মতিঝিল হেড অফিস লোকেশন।
  3. **Interactive Inquiry Form:** সাবজেক্ট সিলেক্টর (General Inquiry, Wholesale/Dealer, Export), ফর্ম ইনপুট ফিল্ড ও অফিস সময়সূচি।

#### 📍 Global Services Page (`/services` — `src/app/(main)/services/page.tsx`)
* **বর্তমান সেকশনসমূহ:** Product Sourcing, Shipping & Logistics, Freight Forwarding, Customs Clearance, Warehousing, 24/7 Support সার্ভিস কার্ড গ্রিড এবং কাস্টম বিটুবি কনসালট্যান্ট কল-টু-অ্যাকশন।

#### 📍 Shipping Cost Calculator (`/cost-calculator`) & Ship For Me (`/ship-for-me`)
* **বর্তমান সেকশনসমূহ:** পার্সেল ওয়েট/ভলিউম ইস্টিমেটর, ওরিজিন/ডেস্টিনেশন ক্যালকুলেটর এবং শিপিং রিকোয়েস্ট ফর্ম।

---

### 🔐 ১.৫ অথেন্টিকেশন পেজসমূহ (Login, Register, Password Recovery, Verification)

* **Login Page (`/login`):** মোবাইল/ইমেইল ও পাসওয়ার্ড দিয়ে সাইন-ইন, সোশ্যাল লগইন, রিমেম্বার মি ডাইনামিক অপশন।
* **Register Page (`/register`):** নাম, ইমেইল, মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট তৈরি ও টার্মস এগ্রিমেন্ট।
* **Forgot Password (`/forgot-password`) & Reset Password (`/reset-password`):** ইমেইল/এসএমএস ওটিপি ভেরিফিকেশন ও নতুন পাসওয়ার্ড সেটআপ।
* **Verify Email (`/verify-email`):** ইমেইল লিঙ্ক কনফার্মেশন ও অ্যাকাউন্ট এক্টিভেশন।

---

### 📊 ১.৬ ইউজার ড্যাশবোর্ড (User Portal & Sub-Pages)

গ্রাহকদের জন্য তৈরি নিজস্ব ম্যানেজমেন্ট প্যানেল (`/dashboard/user`):
1. **Overview (`/dashboard/user/page.tsx`):** সাম্প্রতিক অর্ডার স্ট্যাটাস, মোট খরচ, সেভ করা অ্যাড্রেস ও রিসেন্ট নোটিফিকেশন।
2. **My Orders (`/dashboard/user/orders`):** সকল অর্ডারের তালিকা, অর্ডার ডেট, টোটাল অ্যামাউন্ট, ট্র্যাকিং আইডি এবং ফিল্টারিং।
3. **Order Details (`/dashboard/user/orders/[id]`):** অর্ডারের আইটেম ব্রেকডাউন, শিপিং অ্যাড্রেস, ইনভয়েস এবং ট্র্যাকিং টাইমলাইন।
4. **Wishlist (`/dashboard/user/wishlist`):** সেভ করা পছন্দের প্রোডাক্ট লিস্ট ও সরাসরি কার্টে যোগ করার বাটন।
5. **My Profile (`/dashboard/user/profile`):** নাম, ফোন নম্বর, ইমেইল ও প্রোফাইল ছবি এডিট অপশন।
6. **Address Book (`/dashboard/user/addresses`):** হোম ও অফিস শিপিং অ্যাড্রেস যুক্তকরণ ও প্রাইমারি সেট করার সুবিধা।
7. **Invoices (`/dashboard/user/invoices`):** ডিজিটাল ক্যাশ মেমো/ইনভয়েস দেখা ও পিডিএফ ডাউনলোড অপশন।
8. **Payments (`/dashboard/user/payments`):** সেভ করা পেমেন্ট মেথড ও লেনদেনের ইতিহাস।
9. **Returns & Refunds (`/dashboard/user/returns`):** প্রোডাক্ট রিটার্ন বা ওয়ারেন্টি ক্লেইম রিকোয়েস্ট ফর্ম।
10. **Reviews & Ratings (`/dashboard/user/reviews`):** কুপন বোনাস পাওয়ার জন্য কেনা প্রোডাক্টের রিভিউ ও ছবি আপলোড।
11. **Notifications (`/dashboard/user/notifications`):** অফার ও অর্ডার ট্র্যাকিং অ্যালার্ট।

---

### 🛡️ ১.৭ এডমিন ড্যাশবোর্ড (Admin Control Panel & Sub-Pages)

সাইটের সকল ডেটা ও ই-কমার্স কন্ট্রোলের জন্য এডমিন প্যানেল (`/dashboard/admin`):
1. **Analytics Dashboard (`/dashboard/admin/page.tsx`):** সেলস চার্ট, দৈনিক অর্ডার, মোট কাস্টমার, রেভিনিউ সামারি।
2. **Products Management (`/dashboard/admin/products`):** প্রোডাক্ট লিস্ট, স্টক আপডেট, এডিট, ডিলিট এবং সার্চ।
3. **Bulk Product Upload (`/dashboard/admin/products/BulkUploadModal.tsx`):** Excel/CSV ফাইলের মাধ্যমে একসাথে শত শত প্রোডাক্ট আপলোড।
4. **Add New Product (`/dashboard/admin/products/new`):** প্রোডাক্ট টাইটেল, এসকেইউ, ডেনসিটি, ভ্যারিয়েন্ট, প্রাইস ও ইমেজ আপলোড ফর্ম।
5. **Orders Management (`/dashboard/admin/orders`):** সকল কাস্টমার অর্ডার দেখা, স্ট্যাটাস পরিবর্তন (Pending -> Processing -> Shipped -> Delivered)।
6. **Order Detail & Invoice Print (`/dashboard/admin/orders/[id]`):** মেমো প্রিন্ট ও ডেলিভারি লেবেল জেনারেট।
7. **Offers & Promotions (`/dashboard/admin/offers`):** ডিসকাউন্ট কুপন তৈরি, ব্যানার অফার সেটআপ ও ফ্ল্যাশ সেল ম্যানেজমেন্ট।
8. **Site Content CMS (`/dashboard/admin/site-content`):** হোমপেজ ব্যানার, টেক্সট, কন্টাক্ট ইনফো ও নোটিশ বোর্ড এডমিন থেকেই পরিবর্তন করার সুবিধা।
9. **Shipping Rates & Zones (`/dashboard/admin/shipping`):** জেলা ভিত্তিক ডেলিভারি চার্জ ও ফ্রি-শিপিং থ্রেশহোল্ড সেটআপ।
10. **Barcode & Package Scanner (`/dashboard/admin/scanner`):** কিউআর/বারকোড স্ক্যান করে দ্রুত পার্সেল হ্যান্ডওভার ও ট্র্যাকিং স্ট্যাটাস আপডেট।
11. **User Roles & Permissions (`/dashboard/admin/roles`):** স্টাফ, প্রোডাক্ট ম্যানেজার ও সাপোর্ট এডমিনদের রোল অ্যাসাইন।
12. **Customer Reviews Management (`/dashboard/admin/reviews`):** কাস্টমারদের রিভিউ এপ্রুভ বা রিজেক্ট করা।
13. **Returns Management (`/dashboard/admin/returns`):** কাস্টমার রিটার্ন রিকোয়েস্ট প্রসেস করা।

---

### ⚖️ ১.৮ পলিসি ও ইউটিলিটি পেজসমূহ (Privacy, Terms, Refund, Track, Auto-login)

* **Privacy Policy (`/privacy`):** কাস্টমার ডেটা প্রাইভেসি ও সিকিউরিটি পলিসি।
* **Terms of Service (`/terms`):** ই-কমার্স ও ওয়ারেন্টি ব্যবহার বিধি।
* **Refund & Return Policy (`/refund`):** পণ্য ফেরত ও রিফান্ড নীতি।
* **Order Tracking (`/track` — `src/app/track/page.tsx`):** পাবলিক ট্র্যাকিং পেজ যেখানে ইনভয়েস নম্বর দিলেই পার্সেল স্ট্যাটাস দেখা যায়।
* **Auto Login System (`/auto-login`):** সিস্টেম টেস্ট ও এডমিন কুইক অ্যাক্সেসের জন্য নিরাপত্তা এনক্রিপ্টেড অটো-লগইন টেস্ট পেজ।

---

---

## 🚀 ২. ওয়েবসাইটের জন্য নতুন প্রস্তাবিত সেকশনসমূহ (Comprehensive New Recommended Sections)

কারমো গ্রুপকে একটি বিশ্বমানের ই-কমার্স ও শিল্প প্রতিষ্ঠানের ডিজিটাল অভিজ্ঞতায় উন্নীত করতে নিচের **নতুন সেকশনগুলো** যোগ করার জোরালো সুপারিশ করা হচ্ছে:

---

### 🎯 ২.১ হোম পেজের জন্য নতুন সেকশন (New Homepage Sections)

1. 🎯 **Interactive Smart Foam/Mattress Finder Quiz (এআই মেট্রেস ফাইন্ডার সেকশন):**
   * **বিবরণ:** গ্রাহকরা সাধারণত বুঝতে পারেন না তাদের কোন ডেনসিটি বা থিকনেসের মেট্রেস দরকার।
   * **ফিচার:** ৪টি সহজ স্টেপ উইজার্ড (ঘুমানোর পজিশন: ব্যাক/সাইড, পিঠে ব্যথা আছে কিনা, শরীরের ওজন, বাজেট)। উত্তর দেওয়ার সাথে সাথে সঠিক মেট্রেস সাজেস্ট করবে।

2. 🤝 **Corporate Clients & B2B Partners Logo Carousel:**
   * **বিবরণ:** দেশের বড় বড় ফার্নিচার ব্র্যান্ড, ফাইভ-স্টার হোটেল, হাসপাতাল ও অটোমোটিভ কোম্পানি যারা কারমো ফোম ব্যবহার করে তাদের লোগো স্লাইডার।
   * **ইমপ্যাক্ট:** ক্লায়েন্টদের মধ্যে তাৎক্ষণিক ট্রাস্ট ও ব্র্যান্ড ভ্যালু ১০ গুণ বাড়াবে।

3. 🧮 **Foam Density & Quality Comparison Visualizer (কোয়ালিটি তুলনা সেকশন):**
   * **বিবরণ:** বাজারে প্রচলিত কম দামি সাধারণ ফোম বনাম কারমো হাই-ডেনসিটি পিওর রাবার ফোমের লাইভ স্লাইডার তুলনা।
   * **ফিচার:** সগিং (Sagging Test), এয়ারফ্লো টেকনোলজি, ওয়ারেন্টি বছর এবং পিউরিটি টেস্ট রিপোর্ট।

4. 💬 **Customer Video Testimonials & Verified Unboxing Carousel:**
   * **বিবরণ:** টেক্সট রিভিউর চেয়ে সন্তুষ্ট গ্রাহকদের বাস্তব ভিডিও রিভিউ ও বেডরুম আনবক্সিং রিলস।

5. 📍 **Interactive Dealer & Showroom Locator (৭৪৭+ ডিলার ম্যাপ সেকশন):**
   * **বিবরণ:** বিভাগ, জেলা ও থানা সিলেক্ট করার সাথে সাথে নিকটস্থ ডিলার শো-রুমের নাম, ফোন নম্বর, সময়সূচি এবং গুগল ম্যাপ ডিরেকশন।

---

### 🏛️ ২.২ অ্যাবাউট আস পেজের জন্য নতুন সেকশন (New About Page Sections)

1. ⏳ **Interactive Historical Timeline (১৯৬৫ - ২০২৬ মিলস্টোন সেকশন):**
   * **বিবরণ:** ১৯৬৫ সালের ভিত্তিপ্রস্তর স্থাপন থেকে শুরু করে বর্তমান প্রযুক্তির আধুনিকায়ন পর্যন্ত একটি টাইমলাইন স্লাইডার।

2. 🌿 **Sustainability & Zero-VOC Eco-Friendly Banner:**
   * **বিবরণ:** কারমো ফোমের পরিবেশবান্ধব উৎপাদন প্রক্রিয়া, বিষাক্ত কেমিক্যালমুক্ত তৈরি এবং রিসাইক্লিং ইনিশিয়েটিভ সম্পর্কিত তথ্যচিত্র।

3. 👔 **Board of Directors & Management Leadership Grid:**
   * **বিবরণ:** পরিচালনা পর্ষদ ও এক্সিকিউটিভ লিডারশিপ টিমের প্রাতিষ্ঠানিক ছবি ও দিকনির্দেশনামূলক বায়োগ্রাফি।

4. 🏆 **Awards, Export Excellence & Media Highlights:**
   * **বিবরণ:** জাতীয় রপ্তানি ট্রফি, শিল্প সম্মাননা ও খবরের কাগজের ফিচার হেডলাইন প্রদর্শন।

---

### 🛒 ২.৩ প্রোডাক্ট ডিটেইলস পেজের জন্য নতুন সেকশন (New Product Detail Sections)

1. 🔄 **360-Degree Product View / Exploded Interior View:**
   * **বিবরণ:** ইউজার মাউস ঘুরিয়ে মেট্রেস বা ফোমকে ৩৬০ ডিগ্রি কোণে ঘোরাতে পারবেন এবং মেট্রেসের ইনসাইড লেয়ার থ্রি-ডি ভিউতে দেখতে পাবেন।

2. 🌙 **100-Night Risk-Free Trial & Warranty Calculator:**
   * **বিবরণ:** ১০০ নাইট ট্রায়াল পলিসি কীভাবে কাজ করে এবং ১৫ বছরের ওয়ারেন্টির শর্তাবলী কত সহজে পাওয়া যায় তার স্পেসিফিকেশন।

3. 🛍️ **"Frequently Bought Together" Bundle Cross-Sell Box:**
   * **বিবরণ:** মেট্রেসের সাথে ওয়াটারপ্রুফ মেট্রেস প্রোটেক্টর ও সাইড বালিশের বাণ্ডেল অফার (১৫% ছাড়) যা এভারেজ অর্ডার ভ্যালু (AOV) বহুগুণ বাড়ায়।

4. ❓ **Verified Customer Q&A Section:**
   * **বিবরণ:** সম্ভাব্য কাস্টমাররা প্রোডাক্ট পেজেই সরাসরি প্রশ্ন করতে পারবেন এবং কারমো টেকনিক্যাল এক্সপার্ট টিম উত্তর দেবে।

---

### 🏭 ২.৪ ক্যাটালগ ও বিটুবি পেজের জন্য নতুন সেকশন (New B2B & Industrial Sections)

1. 📄 **Downloadable Technical Datasheets & ISO Test Reports:**
   * **বিবরণ:** শিল্পপ্রতিষ্ঠান ও বাল্ক বায়ারদের জন্য ডেনসিটি টেস্ট পিডিএফ, ফায়ার-রিটার্ডেন্ট সার্টিফিকেশন এবং ISO কোয়ালিটি শীট ডাউনলোডের বাটন।

2. ⚙️ **B2B Custom Foam Dimension & Bulk Price Calculator:**
   * **বিবরণ:** পাইকারি বায়াররা কাস্টম দৈর্ঘ্য (Length), প্রস্থ (Width), উচ্চতা (Thickness) এবং ডেনসিটি টাইপ ইনপুট দিলে সিস্টেম আনুমানিক ইউনিট প্রাইজ ও ডিসকাউন্ট কোটেশন জেনারেট করবে।

---

### 🛍️ ২.৫ ই-কমার্স ও চেকআউট সেকশন (New E-Commerce & Conversion Boosters)

1. ⏱️ **Flash Sale & Limited Time Offer Countdown Timer:**
   * **বিবরণ:** বিশেষ উৎসবের (যেমন: ঈদ অফার বা উইন্টার মেট্রেস সেল) জন্য কাউন্টডাউন টাইমার ব্যানার।

2. 🚚 **Free Shipping Progress Meter Bar:**
   * **বিবরণ:** কার্ট পেজে "আর মাত্র ৫০০ টাকার কেনাকাটা করলেই ফ্রী ডেলিভারি!" নোটিফিকেশন বার।

3. 🎁 **Gift Card & Loyalty Points Redeem Box:**
   * **বিবরণ:** প্রতি কেনাকাটায় অর্জিত পয়েন্ট পরবর্তী অর্ডারে ডিসকাউন্ট হিসেবে রিডিম করার সুবিধা।

---

### 🔔 ২.৬ সাইট-ওয়াইড গ্লোবাল উইজেট (Global System Enhancements)

1. 💬 **Floating Sticky Quick Action Dock:**
   * স্ক্রিনের নিচে বা পাশে ডাইরেক্ট হোয়াটসঅ্যাপ চ্যাট বাটন, হটলাইন ডায়াল এবং বাল্ক ইনকোয়ারি ফর্মের ভাসমান আইকন।

2. ⚡ **Real-Time Purchase Social Proof Toast:**
   * স্ক্রিনের নিচে ছোট রিয়েল-টাইম নোটিফিকেশন: *"রাজশাহী থেকে একজন ক্রেতা ৩ মিনিট আগে Karmo Orthopedic Mattress অর্ডার করেছেন।"* (ক্রেতার আস্থা বহুগুণ বাড়ায়)।

---

## 🛠️ Tech Stack & State Management Guide

* **Framework:** Next.js 16 (App Router with TypeScript/JSX)
* **Styling:** Tailwind CSS, Custom CSS Design System with CSS Variables
* **State Management & Data Fetching:** Redux Toolkit & RTK Query (`@/redux/api/*`)
* **Icons & Animation:** React Icons (Lucide/Feather), Framer Motion
* **Image Engine:** Next/Image with CDN Optimization
* **Database & Backend API Connection:** Node.js/Express Backend via JSON RESTful API
