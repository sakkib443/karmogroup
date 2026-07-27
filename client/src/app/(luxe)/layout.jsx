import "./livora.css";

import Header from "@/components/Home2/Header";
import Footer from "@/components/Home2/Footer";
import Preloader from "@/components/Home2/Preloader";
import Cursor from "@/components/Home2/Cursor";
import FloatingActions from "@/components/Home2/FloatingActions";
import PreviewMode from "@/components/Home2/PreviewMode";

/**
 * Home 02 runs outside (mainLayout).
 *
 * Its header is part of the design — announcement strip, mega panel, cart and
 * wishlist — and does not resemble the corporate navbar the other pages share.
 * A route group keeps the URL unchanged (`/home-2`) while giving this page its
 * own chrome.
 *
 * The `lv` class on the wrapper is load-bearing: every rule in livora.css is
 * nested inside `.lv`, which is the only thing keeping a stylesheet full of
 * names like `.container` and `.hero` from redecorating Home 01 and Home 03.
 * See the contract at the top of that file.
 */
export default function LuxeLayout({ children }) {
  return (
    <div className="lv">
      {/* Demo guard — links look live but go nowhere, so nothing on this page
          can drop a viewer onto a route that has not been built. Delete this
          line to make the page live. */}
      <PreviewMode />
      <Preloader />
      <Cursor />
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
