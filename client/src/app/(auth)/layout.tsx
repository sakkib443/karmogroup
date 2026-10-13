import Header from "@/components/karmo/header/Header";
import CertifiedBy from "@/components/karmo/home/CertifiedBy";
import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import Link from "next/link";

/**
 * Auth routes (login, register, password reset, verify).
 * Same karmo Header + CertifiedBy + Footer chrome as the rest of the site.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-cream pt-[136px] sm:pt-[144px]">
        {/* Soft brand wash — atmosphere without the old purple aurora. */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-24 top-0 h-[360px] w-[360px] rounded-full opacity-[0.12] blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-brand) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -right-20 bottom-10 h-[320px] w-[320px] rounded-full opacity-[0.08] blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--color-ink) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(34,34,34,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,34,34,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(ellipse 70% 55% at 50% 35%, black 25%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 55% at 50% 35%, black 25%, transparent 75%)",
            }}
          />
        </div>

        <div className="shell relative z-10 flex justify-center py-10 lg:py-14">
          <div className="w-full max-w-[440px]">
            {children}
            <p className="mt-7 text-center text-[11px] uppercase tracking-[0.12em] text-ink/40">
              By continuing you agree to our{" "}
              <Link
                href="/terms"
                className="text-ink/55 underline-offset-2 hover:text-brand hover:underline"
              >
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link
                href="/privacy"
                className="text-ink/55 underline-offset-2 hover:text-brand hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <CertifiedBy />
      <Footer />
    </>
  );
}
