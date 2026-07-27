import { Plus_Jakarta_Sans, Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import ReduxProviderWrapper from "@/components/ReduxProviderWrapper";
import DemoGuard from "@/components/DemoGuard";
import { LanguageProvider } from "@/context/LanguageContext";

// Primary face for headings, navigation and UI.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

// Display face for the hero headline. A warm, soft-terminalled serif rather
// than another geometric sans — a group that has been making comfort since
// 1965 should read as crafted, not as a startup. `opsz` is pinned to the
// display end of the optical-size axis, which is what makes the thin strokes
// and tight joins read correctly at 5rem+.
// Poppins stays on running copy, so just the weights body text actually uses.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

// Neither Google Sans nor Helvetica carries Bengali.
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata = {
  title: "Karmo Group — Foam, Mattress, HomeTex & Chemicals since 1965",
  description:
    "Karmo Group manufactures foam for furniture, footwear and automotive use, mattresses, HomeTex bedding, and adhesives and polymers from Dhaka, Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${poppins.variable} ${hindSiliguri.variable}`}
    >
      <body className="antialiased">
        {/* Blocks every link and form while the site is being shown to the
            client, so nothing can land on one of the pages that is still
            empty. See the component for how to switch it off at launch. */}
        <DemoGuard />
        <ReduxProviderWrapper>
          <LanguageProvider>{children}</LanguageProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
