"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginSuccess } from "@/redux/slices/authSlice";
import { clearWishlist } from "@/redux/slices/wishlistSlice";
import { useLoginMutation } from "@/redux/api/authApi";
import { useMergeWishlistMutation } from "@/redux/api/userApi";
import { toast } from "react-hot-toast";
import {
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuCircleAlert,
  LuUser,
} from "react-icons/lu";
import GoogleSignInButton from "@/components/shared/GoogleSignInButton";
import { API_URL } from "@/config/api";

const inputCls =
  "w-full pl-11 pr-4 py-3 rounded-none border border-ink/20 bg-white text-sm text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-brand";

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/55 mb-1.5";

const LoginPageInner = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [mergeWishlist] = useMergeWishlistMutation();
  const guestWishlistItems = useAppSelector((state) => state.wishlist.items);

  const isExpired = searchParams.get("expired") === "true";
  const redirectPath = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPhone = /^[0-9+\-\s()]{7,}$/.test(identifier.trim());
    const credentials = isPhone
      ? { phone: identifier.trim(), password }
      : { email: identifier.trim(), password };

    try {
      const res = await login(credentials).unwrap();
      const apiUser = res.data.user;
      const token = res.data.tokens.accessToken;
      const user = {
        id: apiUser._id || apiUser.id,
        name:
          apiUser.name ||
          `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim() ||
          apiUser.email,
        email: apiUser.email,
        phone: apiUser.phone || "",
        role: apiUser.role || "user",
        avatar: apiUser.avatar || "",
      };

      dispatch(loginSuccess({ user, token }));
      localStorage.setItem("token", token);
      toast.success("Welcome back! Login successful.", {
        style: {
          borderRadius: "0",
          background: "var(--color-brand)",
          color: "#fff",
        },
        icon: "✅",
      });

      try {
        const productIds = guestWishlistItems
          .map((item) => item.id)
          .filter((id): id is string => Boolean(id));
        if (productIds.length > 0) {
          await mergeWishlist(productIds).unwrap();
          dispatch(clearWishlist());
        }
      } catch (mergeErr) {
        console.error("Guest wishlist merge failed:", mergeErr);
      }

      const isStaff = user.role === "admin" || user.role === "superadmin";
      if (isStaff) {
        router.push(
          redirectPath && redirectPath.startsWith("/dashboard/admin")
            ? redirectPath
            : "/dashboard/admin"
        );
      } else if (redirectPath) {
        router.push(redirectPath);
      } else {
        try {
          const ordersRes = await fetch(`${API_URL}/orders/my?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const ordersData = await ordersRes.json();
          const hasOrders =
            ordersData?.data?.orders?.length > 0 ||
            ordersData?.data?.length > 0;
          router.push(hasOrders ? "/dashboard/user" : "/");
        } catch {
          router.push("/");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid email/phone or password.", {
        duration: 4000,
      });
    }
  };

  return (
    <div className="border border-ink/10 bg-white px-6 py-8 sm:px-8 sm:py-9">
      {isExpired && (
        <div className="mb-6 flex items-start gap-2.5 border border-brand/25 bg-brand/[0.06] px-4 py-3">
          <LuCircleAlert size={18} className="mt-0.5 shrink-0 text-brand" />
          <div>
            <p className="m-0 text-[13px] font-semibold text-ink">
              Session expired
            </p>
            <p className="m-0 text-[12px] text-ink/60">
              Please sign in again to continue.
            </p>
          </div>
        </div>
      )}

      <div className="mb-7 border-b border-ink/10 pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          Karmo
        </span>
        <h1 className="display mt-2 text-[1.55rem] font-light uppercase leading-[1.1] tracking-[0.01em] text-ink sm:text-[1.85rem]">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-ink/50">
          Sign in to continue to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>Email or phone number</label>
          <div className="relative group">
            <LuUser
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors group-focus-within:text-brand"
            />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={inputCls}
              placeholder="name@example.com or 01XXXXXXXXX"
              autoComplete="username"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/55">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <LuLock
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors group-focus-within:text-brand"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-11`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <LuEyeOff size={17} /> : <LuEye size={17} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/40"
        >
          {isLoading ? (
            <>
              <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in…
            </>
          ) : (
            <>
              Sign in <LuArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {!!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/35">
              or continue with
            </span>
            <div className="h-px flex-1 bg-ink/10" />
          </div>
          <GoogleSignInButton
            redirectPath={redirectPath}
            label="Continue with Google"
          />
        </>
      )}

      <div className="mt-7 border-t border-ink/10 pt-6 text-center">
        <p className="text-sm text-ink/50">
          Don&apos;t have an account?{" "}
          <Link
            href={
              redirectPath
                ? `/register?redirect=${encodeURIComponent(redirectPath)}`
                : "/register"
            }
            className="font-semibold text-brand underline-offset-2 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

const LoginPage = () => (
  <Suspense
    fallback={
      <div className="border border-ink/10 bg-white p-10 text-center text-sm text-brand">
        Loading…
      </div>
    }
  >
    <LoginPageInner />
  </Suspense>
);

export default LoginPage;
