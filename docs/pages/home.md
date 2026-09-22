# হোম — `/`

ব্র্যান্ডের সদর দরজা। Karmo চারটা ডিভিশনে আলাদা ক্রেতাকে আলাদা জিনিস বেচে —
কারখানায় স্পেসিফিকেশন ধরে ফোম, খুচরায় ম্যাট্রেস আর বিছানার কাপড়, ড্রামে
কেমিক্যাল। হোমপেজের কাজ: এক স্ক্রলে এটা বোঝানো, আর প্রত্যেককে ঠিক তার তাকটায়
পৌঁছে দেওয়া।

এটা **দোকানের পেজ নয়**। এখানে কার্টে কিছু যায় না। প্রতিটা সেকশন শেষ হয় একটা
দরজায়; কেনাকাটা হয় সেই দরজার ওপাশে।

---

## কোড কোথায় থাকে (অর্গানাইজড)

লেআউট হেডার রাখে। পেজ শুধু সেকশন অ্যাসেম্বল করে। প্রত্যেক সেকশন আলাদা ফাইল।

```text
client/src/
  app/(karmo-2)/
    layout.tsx          ← Header + chrome (ThemeControl, snap)
    page.jsx            ← শুধু home/* সেকশনগুলোর ক্রম
  components/karmo/
    header/
      Header.jsx        ← TopHeader + Navbar একসাথে
      TopHeader.jsx     ← ব্র্যান্ড স্ট্রিপ (~৩২px)
      Navbar.jsx        ← লোগো, মেনু, টুলস (~৮০px)
    chrome/
      ThemeControl.jsx
      HomeTwoSectionSnap.jsx
    home/
      Hero.jsx
      StandardStrip.jsx
      DivisionEditorials.jsx
      ChemicalsBand.jsx
      ExploreSplit.jsx
      DivisionsStrip.jsx
      ShopByMaterial.jsx
      PromoTrio.jsx
      FoamPromise.jsx
      Reels.jsx
      LivingLookbook.jsx
      Partners.jsx
      PartnerPromoBand.jsx
      OrderAndContact.jsx
      CertifiedBy.jsx      ← পেজে নয়, লেআউট থেকে মাউন্ট (ফুটারের ঠিক ওপরে)
```

> **সিঙ্ক নোট:** `CertifiedBy` `page.jsx` এ নেই — `layout.tsx` এ `<main>` আর
> `<Footer>` এর মাঝে বসানো, তাই সব `(karmo-2)` পেজে ফুটারের ঠিক ওপরে দেখায়।

পরে **About** একই প্যাটার্নে: `components/karmo/about/` + `app/(karmo-2)/about/`।

হেডার মোটামুটি সব মার্কেটিং পেজে `(karmo-2)` লেআউট থেকে আসে — হোম সেকশনের ভেতরে নয়।

---

## ডিজাইন নিয়ম — হোমপেজ “লার্জ বার”

হোমপেজকে উপর থেকে নিচ পর্যন্ত **একটা টানা ভিজ্যুয়াল ব্যান্ড** হিসেবে শেষ করতে হবে।
এই তিনটা নিয়ম অপরিবর্তনীয়:

### ১. গ্যাপ = ৬px

| কোথায় | মান | Tailwind |
|---|---|---|
| সেকশনের **মধ্যে** (এক সেকশন থেকে পরের সেকশন) | **৬px** | `gap-1.5` / `mt-1.5` |
| সেকশনের **ভেতরে** ইমেজ–ইমেজ / টাইল–টাইল | **৬px** | `gap-1.5` |

একই সাদা গটার পুরো পেজ জুড়ে — ম্যাসনরি, দুই-প্যানেল, ট্রিপটিচ, প্রোমো — সব জায়গায়
এক মাপ। নতুন সেকশন বানালে আগে এই গ্যাপ দিয়ে শুরু করুন; বড় `gap-8` / `gap-10`
শুধু টেক্সট কলাম ↔ ইমেজ গ্রিডের মতো লেআউট শ্বাস-প্রশ্বাসের জায়গায়।

### ২. ফুল উইডথ

- সেকশনগুলো **কিনারা থেকে কিনারা** — হোমপেজে ইমেজ ব্যান্ড inset কার্ড / গোল কোণা /
  সাইড-প্যানেল হিরো নয়।
- হেডার কনটেন্ট `shell-home-two` (max **১৬০০px**); ইমেজ ব্যান্ডগুলো স্ক্রিন এজ
  পর্যন্ত যেতে পারে (এডিটোরিয়াল ম্যাসনরির ডান কিনারা, ExploreSplit প্যানেল)।
- লেখা যেখানে শেল-অ্যালাইন হয়, ছবি সেখানে ফুল-ব্লিড থাকতে পারে — দুটো একসাথে
  থাকলে গ্যাপ দিয়ে জোড়া।

### ৩. এক সেকশন = এক কাজ

প্রতিটা সেকশনে এক উদ্দেশ্য, এক হেডলাইন (বা ইমেজ-ফার্স্ট হলে হালকা কপি), একটা
প্রাইমারি CTA। হিরোতে স্ট্যাট স্ট্রিপ / প্রোমো চিপ / একাধিক কার্ড নয়।

---

## পুরো পেজ এক নজরে (লাইভ `/`)

ক্রম = [`page.jsx`](../../client/src/app/(karmo-2)/page.jsx)। ক্রম বদলালে এই
টেবিল আর `page.jsx` একসাথে আপডেট করুন।

| # | সেকশন | কম্পোনেন্ট | লাইভ কপি / নোট |
|---|---|---|---|
| — | টপ হেডার + ন্যাভ | `header/TopHeader` + `header/Navbar` | লেআউট থেকে, মোট ১১২px fixed (৩২ + ৮০) |
| ১ | হিরো | `home/Hero` | ফুল-উইডথ, ঘুরন্ত ভ্যারিয়েন্ট (Foam/Mattress/Chemicals); "We create the chemistry of comfort" |
| ২ | ট্রাস্ট স্ট্রিপ | `home/StandardStrip` | ছয়টা পিলার: A legacy of 60 years · Trusted By Million · Recognised By · Natural & Sustainable · Free Delivery · 5k+ Stores |
| ৩ | আইকনিক ব্র্যান্ডস | `home/DivisionEditorials` | বাঁ কপি + ডান ম্যাসনরি; "Iconic brands. Lasting craft." · Since 1965 |
| ৪ | কেমিক্যালস ব্যান্ড | `home/ChemicalsBand` | তিন দাবি: Largest raw material stock · International quality certified · Specialized polyurethanes & polymers |
| ৫ | এক্সপ্লোর | `home/ExploreSplit` | দুই প্যানেল (Mattress made for deep rest · HomeTex for every room) + ফ্ল্যাগশিপ ব্যান্ড (Foam crafted for comfort), গ্যাপ ৬px |
| ৬ | ডিভিশন কার্ড | `home/DivisionsStrip` | "One group, four crafts" — Foam · Mattress · HomeTex · Chemicals |
| ৭ | শপ বাই ম্যাটেরিয়াল | `home/ShopByMaterial` | চার ম্যাটেরিয়াল কার্ড: Rebonded Foam · Polyethylene Foam · Natural Coir · Pocket Spring |
| ৮ | প্রোমো ট্রিও | `home/PromoTrio` | "Our popular products" — Foam seating collection + HomeTex bedding + Mattress range |
| ৯ | ফোম প্রমিস | `home/FoamPromise` | ভিডিও ব্যাকগ্রাউন্ড; "Blending tradition with innovation" — Pure Quality · Long Lasting · Certified Comfort |
| ১০ | রিলস | `home/Reels` | "On screen. See comfort." কপি + ভিডিও ম্যাসনরি |
| ১১ | লিভিং লুকবুক | `home/LivingLookbook` | তিন টাইল + ফিল্ম ব্যান্ড ("Blending tradition") |
| ১২ | পার্টনার্স | `home/Partners` | "Trusted by 100+ makers" লোগো স্ট্রিপ |
| ১৩ | প্রোমো ব্যান্ড | `home/PartnerPromoBand` | All products 5% Discount + ১২ মাস EMI (ব্যাংক আর্টওয়ার্ক) |
| ১৪ | অর্ডার ও যোগাযোগ | `home/OrderAndContact` | "How to make an order" ৪ ধাপ + "Have any questions" কন্টাক্ট ফর্ম |
| — | সার্টিফাইড | `home/CertifiedBy` | **লেআউট থেকে** — ফুটারের ঠিক ওপরে; তিন সার্টিফিকেট |

ডানে ভাসমান: চ্যাট / WhatsApp / স্ক্রল-টু-টপ — `FloatingContact` (রুট লেআউট)।

---

## কীভাবে নতুন সেকশন যোগ / শেষ করবেন

1. **ফাইল** — `components/karmo/home/YourSection.jsx` (এক সেকশন = এক ফাইল)।
2. **পেজ** — `page.jsx` এ ইমপোর্ট করে সঠিক ক্রমে বসান।
3. **গ্যাপ** — আগের সেকশনের সাথে `mt-1.5` (৬px) বা প্যারেন্ট `gap-1.5`; ভেতরের
   ইমেজ গ্রিডেও `gap-1.5`।
4. **প্রস্থ** — ইমেজ ব্যান্ড ফুল-ব্লিড ডিফল্ট; শুধু টেক্সট কলাম শেল-অ্যালাইন।
5. **ডক** — এই ফাইলের টেবিলে এক সারি যোগ করুন (উদ্দেশ্য · গঠন সংক্ষেপে)।

সেকশন শেষ মানে: কপি ফাইনাল, অ্যাসেট হাই-রেজ, মোবাইল ঠিক, গ্যাপ নিয়ম মানা —
তারপর পরের সেকশনে যান। হোমকে **উপর থেকে নিচ এক লার্জ বার** হিসেবে ফিনিশ করুন,
মাঝে অন্য পেজে লাফ না দিয়ে।

---

## সেকশন নোট (সংক্ষেপ)

### হেডার (লেআউট)

**উদ্দেশ্য** — সব `(karmo-2)` পেজে একই পরিচয় ও নেভিগেশন।  
**গঠন** — TopHeader (ব্র্যান্ড বার) + Navbar (মেনু)। একসাথে `Header.jsx`।  
**প্রস্থ** — `shell-home-two` max ১৬০০px।

### ১. হিরো

**উদ্দেশ্য** — ব্র্যান্ড + এক হেডলাইন + CTA, এক কম্পোজিশন।  
**গঠন** — ফুল-উইডথ ইমেজ প্লেন, হেডার অফসেট `100svh - 112px`।

### ৩–৫. এডিটোরিয়াল + কেমিক্যালস + এক্সপ্লোর

**গঠন** — উপরের ইমেজ-ব্যান্ডের টানা অংশ (DivisionEditorials → ChemicalsBand →
ExploreSplit)। ইমেজ গ্রিডে সাদা গটার **৬px** (`gap-1.5`); সেকশনগুলোর ভেতরে ও
মাঝে একই মাপ, যাতে তিনটা মিলে এক টানা ব্যান্ড মনে হয়।

### ১০. লিভিং লুকবুক

**গঠন** — তিন সমান টাইল + নিচে ফিল্ম ব্যান্ড (`product-film`); হোম-২ FilmBand-এর
মতো বাঁয়ে SectionHeading, ডানে ঘুরন্ত ব্যাজ।

---

## পেছনের সিস্টেম

**রঙ** — ব্র্যান্ড `#D44348` (`config/brand.ts` → `BRAND_PRIMARY`, CSS ভেরিয়েবল)।  
**টাইপ** — লক করা (`config/brand.ts`): বডি **Poppins** (`BRAND_FONT`), হেডিং
**Plus Jakarta Sans** (`BRAND_FONT_HEADING`)। লেআউটের ThemeControl প্যানেলে ২৬টা
ফেস চেষ্টা করার জন্য লোড থাকে, কিন্তু ডিফল্ট এই দুটো।  
**নড়াচড়া** — `motion.js` rise / group / VIEWPORT; `prefers-reduced-motion` মানে।  
**স্ন্যাপ** — `HomeTwoSectionSnap` পূর্ণ-উচ্চতা ব্যান্ডে নরম স্ন্যাপ।

---

## বাকি কাজ (হোম ফিনিশিং)

1. প্রতিটা সেকশন উপর→নিচ ক্রমে রিভিউ: গ্যাপ কি সব জায়গায় ৬px?
2. লো-রেজ ইমেজ হাই-রেজ দিয়ে বদল (বিশেষ করে পুরনো ছোট সোর্স)।
3. Next Image `quality={90}` থাকলে `next.config` এ `images.qualities` এ ৯০ যোগ।
4. মোবাইলে ফুল-উইডথ ব্যান্ড ও টাইল স্ট্যাক চেক।
5. সেকশন শেষ হলে এই ডকের “বাকি কাজ” থেকে কেটে ফেলুন — ডকটাই টু-ডু।
