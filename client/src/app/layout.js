import { Plus_Jakarta_Sans, Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import ReduxProviderWrapper from "@/components/ReduxProviderWrapper";
import { LanguageProvider } from "@/context/LanguageContext";

// Primary face for headings, navigation and UI.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

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
        <ReduxProviderWrapper>
          <LanguageProvider>{children}</LanguageProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
