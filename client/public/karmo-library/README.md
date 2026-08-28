# Karmo Library — রেফারেন্স ও সোর্স অ্যাসেট

প্রজেক্টের সব **সোর্স / রেফারেন্স / কাঁচা** ফাইল এক জায়গায় (২৮ আগস্ট ২০২৬)।
আগে এগুলো রিপোর রুটে, `public/`-এর গোড়ায় আর `recource/` তে ছড়ানো ছিল।

> **সাইটে যা আসলে দেখায় সেটা এখানে নয়।** লাইভ অ্যাসেট থাকে
> `client/public/karmo/images/` আর `client/public/karmo/videos/` তে।
> এই লাইব্রেরি হলো **উৎস** — এখান থেকে বেছে, নাম দিয়ে, ওখানে কপি করা হয়।

## ফোল্ডার

| ফোল্ডার | কী আছে | git |
|---|---|---|
| `01-taglines/` | ক্লায়েন্ট-অনুমোদিত ট্যাগলাইন — **কপির সোর্স অব ট্রুথ**। Company / Website / Mattress — তিনটা PDF | ✅ ট্র্যাকড |
| `02-catalogues/` | Adhesive Catalog PDF · `mattress-brochure/` (২৮ পেজ + টেক্সট) · `source-ai-files/` (৩টা Illustrator মাস্টার) | ignored (ভারী) |
| `03-image-candidates/` | এখনো সাইটে বসেনি এমন ছবি — নিচে দেখুন | ignored |
| `04-website-reference/` | ক্লায়েন্টের পুরোনো স্ট্যাটিক সাইট · BluePrint PDF · Site Reference xlsx | ignored |
| `05-originals-masters/` | `karmo/images/`-এ ব্যবহৃত ছবিগুলোর হাই-রেজ মাস্টার | ignored |

`01-taglines/` ছাড়া সবই `.gitignore`-এ — একসাথে ~২ GB, GitHub-এর ১০০ MB
per-file সীমার অনেক বেশি। ট্যাগলাইন PDF তিনটা ছোট আর কপির ভিত্তি, তাই ট্র্যাকড।

## `03-image-candidates/` — ছবি দেখে নাম দেওয়া

**`mattress-banners/`** — লাইফস্টাইল ব্যানার (বেশিরভাগ ultra-wide, হিরো/ব্যান্ডের জন্য)

| ফাইল | কী দেখা যায় |
|---|---|
| `floral-purple-navy-bedroom-woman-cat.jpg` | নেভি বেডরুম, বেগুনি ফুলেল ম্যাট্রেস, নারী বই পড়ছেন + বিড়াল |
| `floral-lilac-navy-bedroom-woman-cat.jpg` | ওই দৃশ্য, লাইলাক ফুলেল টপ (উপর-নিচে কালো বার আছে) |
| `red-floral-navy-bedroom-woman-cat.jpg` | লাল ফুলেল ম্যাট্রেস, নারী + বিড়াল |
| `premium-red-navy-bedroom-woman-cat.jpg` | লাল Karmo Mattress "Premium" লেবেল |
| `metrol-red-navy-bedroom-woman-cat.jpg` | লাল "Karmo Metrol" লেবেল |
| `red-floral-navy-bedroom-product-only.jpg` | একই সেট, **মানুষ ছাড়া** — শুধু প্রোডাক্ট |
| `marnib-floral-navy-gold-cat-play.jpg` | নেভি+সোনালি ঘর, "MARNIB" ম্যাট্রেস, নারী বিড়ালের সাথে খেলছেন |
| `floral-lilac-woman-blue-suit-cat-play.png` | নীল স্যুট পরা নারী, বিড়ালের সাথে খেলা (ChatGPT) |
| `cooling-airflow-cat-snowy-window.jpg` | ঠান্ডা এয়ারফ্লো গ্রাফিক, ঘুমন্ত বিড়াল, বাইরে বরফ |
| `blue-floral-bed-in-clouds.jpg` | নীল ফুলেল ম্যাট্রেস, কাঠের খাট, মেঘের ওপর (স্কয়ার) |
| `ikat-outdoor-live-edge-platform.jpg` | ইকাত প্যাটার্ন, কাঠের স্ল্যাব প্ল্যাটফর্ম, খোলা আঙিনা |

**`mattress-technology/`** — টেকনিক্যাল / ইনফোগ্রাফিক

| ফাইল | কী দেখা যায় |
|---|---|
| `5-zone-orthopedic-diagram-blue.jpg` | "5 ZONE ORTHOPEDIC TECHNOLOGY", নীল ব্যাকগ্রাউন্ড, ৫ জোন লেবেল |
| `5-zone-orthopedic-diagram-cream-foam-wadding.jpg` | একই কিন্তু ক্রিম ব্যাকগ্রাউন্ড + "Foam Wadding Technology" ম্যাগনিফায়ার |
| `cutaway-layers-pocket-spring-banner.jpg` | ম্যাট্রেসের কাটা অংশ — লেয়ার + পকেট স্প্রিং, ultra-wide |
| `breathable-airflow-standard-sleeper.jpg` | সবুজ কম্ফোর্টারে ঘুমন্ত নারী, টিল এয়ারফ্লো লাইন |

**`partners-and-emi/`**
- `partners-and-clients-full-sheet.jpg` — ক্লায়েন্টের আসল "PARTNERS & CLIENTS" শিট (সব লোগো)। `karmo/images/partners/`-এর কাটা লোগোগুলোর উৎস।
- `emi-12-months-partner-banks-bn.png` — "১২ মাস পর্যন্ত ইএমআই সুবিধা" ব্যাংক প্যানেল।

**`icons/`**
- `free-delivery-scooter.png` — লাল/ধূসর ডেলিভারি স্কুটার আইকন।

## নতুন ছবি সাইটে বসাতে

1. এখান থেকে বাছুন।
2. `client/public/karmo/images/<category>/` তে **কনটেন্ট বলে দেয় এমন নামে** কপি করুন।
3. কোডে `/karmo/images/...` দিয়ে রেফার করুন।
4. হাই-রেজ মাস্টার থাকলে `05-originals-masters/` এ রাখুন।

কাঁচা ফাইল কখনো সরাসরি কোড থেকে রেফার করবেন না — এই ফোল্ডার git-ignored,
তাই ডিপ্লয়ে থাকবে না, আর সাইট ভেঙে যাবে।
