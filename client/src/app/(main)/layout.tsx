import Header from "@/components/layout/Header/Header";
import Footer from "@/components/karmo/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

/**
 * Every storefront route except the homepage.
 *
 * The header stays the shop one — search, cart, wishlist, account — because
 * these are the pages where those are the whole point. The footer is the Karmo
 * footer, the same as the homepage carries, so the page ends the same way
 * wherever the visitor is. NewFooter is left in place unused; it is the
 * storefront's own and worth keeping until the rebrand is finished.
 */
export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <main className="pb-[58px] sm:pb-0">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
        </>
    );
}
