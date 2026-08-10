"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useRegisterMutation } from "@/redux/api/authApi";
import { toast } from "react-hot-toast";
import {
  LuUser,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuMapPin,
  LuMail,
  LuPhone,
  LuCircleCheck,
} from "react-icons/lu";
import GoogleSignInButton from "@/components/shared/GoogleSignInButton";

const inputCls =
  "w-full pl-11 pr-4 py-3 rounded-none border border-ink/20 bg-white text-sm text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-brand";

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/55 mb-1.5";

const RegisterPageInner = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });
  const [verifyNotice, setVerifyNotice] = useState<{
    email: string;
    role: string;
    devVerifyLink?: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const redirectPath = searchParams.get("redirect");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const goNext = (role: string) => {
    if (redirectPath) {
      router.push(redirectPath);
    } else if (role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      firstName: formData.name.trim().split(" ")[0] || formData.name.trim(),
      lastName: formData.name.trim().split(" ").slice(1).join(" ") || "",
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      password: formData.password,
    };
    try {
      const res = await register(payload).unwrap();
      const apiUser = res.data.user;
      const token = res.data.tokens.accessToken;
      const devVerifyLink = res?.data?.dev?.verifyLink as string | undefined;
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
      toast.success("Account created! Please verify your email 🎉", {
        duration: 4000,
        style: {
          borderRadius: "0",
          background: "var(--color-brand)",
          color: "#fff",
        },
      });

      setVerifyNotice({
        email: user.email,
        role: user.role,
        devVerifyLink,
      });
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Registration failed. Please try again.",
        { duration: 4000 }
      );
    }
  };

  if (verifyNotice) {
    return (
      <div className="border border-ink/10 bg-white px-6 py-8 sm:px-8 sm:py-9">
        <div className="mb-6 border-b border-ink/10 pb-5 text-center sm:text-left">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-brand/20 bg-brand/[0.06] sm:mx-0">
            <LuMail size={22} className="text-brand" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Karmo
          </span>
          <h1 className="display mt-2 text-[1.45rem] font-light uppercase leading-[1.1] tracking-[0.01em] text-ink sm:text-[1.7rem]">
            Verify your email
          </h1>
          <p className="mt-1.5 text-sm text-ink/50">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-ink">{verifyNotice.email}</span>.
            Open it to confirm your account.
          </p>
        </div>

        <div className="flex items-start gap-2.5 border border-ink/12 bg-cream/60 px-4 py-3">
          <LuCircleCheck size={18} className="mt-0.5 shrink-0 text-brand" />
          <p className="m-0 text-[12.5px] text-ink/65">
            Your account is ready — you can keep shopping now and verify any
            time from the email.
          </p>
        </div>

        {verifyNotice.devVerifyLink && (
          <div className="mt-4 border border-ink/15 bg-cream px-4 py-3">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/70">
              Dev mode — verification link
            </p>
            <a
              href={verifyNotice.devVerifyLink}
              className="mt-1 break-all text-[12px] text-brand underline"
            >
              {verifyNotice.devVerifyLink}
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => goNext(verifyNotice.role)}
          className="mt-6 flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand"
        >
          Continue <LuArrowRight size={16} />
        </button>

        <div className="mt-5 border-t border-ink/10 pt-5 text-center">
          <Link
            href="/verify-email"
            className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brand hover:underline"
          >
            Didn&apos;t get the email? Resend
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-ink/10 bg-white px-6 py-8 sm:px-8 sm:py-9">
      <div className="mb-6 border-b border-ink/10 pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          Karmo
        </span>
        <h1 className="display mt-2 text-[1.55rem] font-light uppercase leading-[1.1] tracking-[0.01em] text-ink sm:text-[1.85rem]">
          Create account
        </h1>
        <p className="mt-1.5 text-sm text-ink/50">
          Join Karmo for foam, mattress and HomeTex shopping.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Full name</label>
          <div className="relative group">
            <LuUser
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors group-focus-within:text-brand"
            />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={inputCls}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Email address</label>
          <div className="relative group">
            <LuMail
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors group-focus-within:text-brand"
            />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputCls}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Phone</label>
            <div className="relative group">
              <LuPhone
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors group-focus-within:text-brand"
              />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={inputCls}
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <div className="relative group">
              <LuMapPin
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors group-focus-within:text-brand"
              />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. Dhaka, Mirpur"
                autoComplete="address-level2"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>Password</label>
          <div className="relative group">
            <LuLock
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 transition-colors group-focus-within:text-brand"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className={`${inputCls} pr-11`}
              placeholder="At least 6 characters"
              autoComplete="new-password"
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
          className="mt-1 flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/40"
        >
          {isLoading ? (
            <>
              <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account…
            </>
          ) : (
            <>
              Create account <LuArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {!!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/35">
              or sign up with
            </span>
            <div className="h-px flex-1 bg-ink/10" />
          </div>
          <GoogleSignInButton
            redirectPath={redirectPath}
            label="Sign up with Google"
          />
        </>
      )}

      <div className="mt-6 border-t border-ink/10 pt-5 text-center">
        <p className="text-sm text-ink/50">
          Already have an account?{" "}
          <Link
            href={
              redirectPath
                ? `/login?redirect=${encodeURIComponent(redirectPath)}`
                : "/login"
            }
            className="font-semibold text-brand underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const RegisterPage = () => (
  <Suspense
    fallback={
      <div className="border border-ink/10 bg-white p-10 text-center text-sm text-brand">
        Loading…
      </div>
    }
  >
    <RegisterPageInner />
  </Suspense>
);

export default RegisterPage;
