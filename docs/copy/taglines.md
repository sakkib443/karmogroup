# ট্যাগলাইন — ক্লায়েন্টের অনুমোদিত তালিকা

ক্লায়েন্টের দেওয়া ট্যাগলাইন। **হুবহু যেভাবে দেওয়া হয়েছে সেভাবেই রাখা** — বানান,
বড়-ছোট হাতের অক্ষর, যতিচিহ্ন কিছুই বদলানো হয়নি, কারণ এটাই মূল উৎস।

পেজে বসানোর সময় বড়-ছোট হাতের সমন্বয় করা হয় (সাইটের হেডিং সব বড় হাতের), কিন্তু
**শব্দ বদলানো যাবে না** — বদলাতে হলে ক্লায়েন্টের অনুমতি লাগবে।

---

## সাধারণ (Generic)

| # | ট্যাগলাইন |
|---|---|
| 1 | The Journey Since 1965 |
| 2 | Largest Raw Material Stock |
| 3 | International Quality Certified |
| 4 | A Legacy of Comfort |
| 5 | Bedding Excellence since 1965 |
| 6 | Timeless comfort since 1965 |
| 7 | Your Perfect Partner For Complete Bedding Solution |
| 8 | An Experience Of A Life Time |
| 9 | We Create The Chemistry Of Comfort |
| 10 | Specialized Polyurethanes & Polymers |
| 11 | The World of Polyurethane |
| 12 | Where Comfort meets Elegance |
| 13 | Where Signature comfort lies |
| 14 | Luxury Woven into every thread |
| 15 | Iconic Brands- Storied History- Industry Leading innovation |
| 16 | Decades of Craft, Designed for Today |
| 17 | Moments that makes a House feel like Home |
| 18 | Blending Tradition with Innovation |
| 19 | Redefining Everyday Comfort |
| 20 | Home Begins Here |
| 21 | Lasting Comfort to your Doorstep |
| 22 | Rooted in Heritage |

## ম্যাট্রেস (Mattress)

| # | ট্যাগলাইন |
|---|---|
| 1 | We Test Every Mattress, Every Single One |
| 2 | We Sell Emotions |
| 3 | Steam Pressed Rebonded from the freshest foam chips |
| 4 | Everyone Assures Quality, But Not Everyone Can Promise Experiences |
| 5 | Sleep Well, Live Well |
| 6 | Experience you can feel |
| 7 | Crafted to perfection |
| 8 | Crafted to Last |
| 9 | Elevate your sleep |
| 10 | Comfort that lasts beyond the night |

## এবাউট আস (About Us)

| # | ট্যাগলাইন |
|---|---|
| 1 | Iconic Brands, Storied History , Industry Leading innovation |

---

## এখন সাইটে কোনগুলো ব্যবহার হচ্ছে

কোড থেকে মিলিয়ে দেখা:

| ট্যাগলাইন | কোথায় | ফাইল |
|---|---|---|
| Mattress 1 — *We Test Every Mattress, Every Single One* | হোম ০১, স্পটলাইট সেকশনের হেডলাইন | `components/karmo/Spotlights.jsx` |
| Generic 7 — *Your Perfect Partner For Complete Bedding Solution* | ওই একই সেকশনের সমর্থনের লাইন | `components/karmo/Spotlights.jsx` |
| Generic 4 — *A Legacy of Comfort* (রূপ: "A legacy of 60 years") | ট্রাস্ট স্ট্রিপের প্রথম টাইল | `components/karmo/Capabilities.jsx` |

আর যেগুলো **কাছাকাছি কিন্তু হুবহু নয়** — তালিকা থেকে নেওয়া হয়নি, আলাদাভাবে লেখা:

- হিরোর তিনটা হেডলাইন: *Where comfort / settles in* · *Rest, built / to last* ·
  *Comfort that / starts within*
- WhyKarmo: *Where comfort begins, and quality lives on*
- ফুটার: *Six decades of comfort* · *Bring Karmo comfort into your home*

> এগুলো ট্যাগলাইনের তালিকা আসার আগে লেখা হয়েছিল। ক্লায়েন্ট চাইলে তালিকার শব্দে
> বদলে দেওয়া যাবে — যেমন হিরোর তিনটার বদলে Generic 6, 20, 19 বা Mattress 5।

---

## এখনো যেগুলো ব্যবহার হয়নি, কিন্তু জায়গা তৈরি আছে

| ট্যাগলাইন | সম্ভাব্য জায়গা |
|---|---|
| Generic 1 — The Journey Since 1965 | ক্লায়েন্টের পুরোনো সাইটে হিরো স্লাইডারের লেখা। ঐতিহ্যের সেকশনে |
| Generic 9 — We Create The Chemistry Of Comfort | Chemicals ডিভিশন পেজ / ফিল্ম ব্যান্ড |
| Generic 11 — The World of Polyurethane | Chemicals ডিভিশন পেজ |
| Generic 12 — Where Comfort meets Elegance | HomeTex ডিভিশন পেজ |
| Generic 2, 3 — Largest Raw Material Stock · International Quality Certified | ট্রাস্ট স্ট্রিপ, যদি টাইল বাড়ে |
| About Us 1 | এবাউট পেজের হেডলাইন |

---

## যে তিনটা জিনিস ক্লায়েন্টকে জিজ্ঞেস করা দরকার

1. **Generic 15 আর About Us 1 প্রায় একই কথা**, শুধু যতিচিহ্ন আলাদা —
   `Iconic Brands- Storied History- Industry Leading innovation` আর
   `Iconic Brands, Storied History , Industry Leading innovation`।
   কোনটা আসল? (দ্বিতীয়টায় "History" আর কমার মাঝে একটা বাড়তি স্পেস আছে।)
2. **Generic 17** — *Moments that makes a House feel like Home*। ব্যাকরণে
   "makes" নয়, "make" হওয়ার কথা। ইচ্ছাকৃত, নাকি টাইপো?
3. **বড়-ছোট হাতের অক্ষর অসামঞ্জস্য** — কোনোটায় প্রতিটা শব্দ বড় হাতে
   (*Your Perfect Partner For Complete Bedding Solution*), কোনোটায় নয়
   (*Timeless comfort since 1965*)। সাইটের হেডিং যেহেতু সব বড় হাতের, দেখতে
   পার্থক্য হবে না — কিন্তু ছাপার কাজে বা মেটা ট্যাগে হবে।

> এগুলো নিজে থেকে ঠিক করিনি। ক্লায়েন্টের দেওয়া লেখা ক্লায়েন্টের সিদ্ধান্ত ছাড়া
> বদলানো উচিত নয় — বিশেষ করে ট্যাগলাইন, যেটা ব্র্যান্ডের সম্পত্তি।
