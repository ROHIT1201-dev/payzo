"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Send OTP logic
  const handleSendOtp = async () => {
    setError(null);
    if (!phone.startsWith("+")) {
      setError("Phone must be in international format (e.g. +919876543210).");
      return;
    }
    setLoadingOtp(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok && (data.status === "pending" || data.status === "sent")) {
        setOtpSent(true);
      } else {
        setError(data.error || "Unable to send OTP.");
      }
    } catch (e: any) {
      setError("Failed to send OTP. Check your connection.");
    }
    setLoadingOtp(false);
  };

  // Verify OTP logic
  const handleVerifyOtp = async () => {
    setError(null);
    setLoadingVerify(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (res.ok && data.status === "approved") {
        setOtpVerified(true);
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch (e: any) {
      setError("OTP verification failed. Try again.");
    }
    setLoadingVerify(false);
  };

  // Sign in logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingSignIn(true);
    const result = await signIn("credentials", {
      phone,
      password,
      otp,
      redirect: false,
    });
    console.log("hulluluu",result)
    if (result?.ok) {
      router.replace("/dashboard");
    } else {
      console.log("hulluluu3",result?.error)
      setError(result?.error || "Authentication failed. Wrong password or OTP.");
      
    }
    setLoadingSignIn(false);
  };

  return (
    <div className="h-[92vh] flex items-center justify-center bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-extrabold mb-6 text-center text-white">
          Sign In
        </h2>

        {/* Phone input + Send OTP */}
        <div className="mb-4">
          <label className="block mb-1 text-white font-medium">
            Phone number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +919876543210"
              required
              className="w-full px-3 py-2 rounded border border-neutral-600 bg-neutral-700 text-white"
              disabled={otpSent}
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent || loadingOtp || !phone}
              className="bg-blue-600 text-white px-3 py-2 rounded font-semibold disabled:opacity-70"
            >
              {loadingOtp
                ? "Sending..."
                : otpSent
                ? "OTP Sent"
                : "Send OTP"}
            </button>
          </div>
        </div>

        {/* OTP input + Verify */}
        {otpSent && (
          <div className="mb-4">
            <label className="block mb-1 text-white font-medium">OTP</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                disabled={otpVerified}
                className="w-full px-3 py-2 rounded border border-neutral-600 bg-neutral-700 text-white"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpVerified || loadingVerify || !otp}
                className="bg-green-600 text-white px-3 py-2 rounded font-semibold disabled:opacity-70"
              >
                {loadingVerify
                  ? "Verifying..."
                  : otpVerified
                  ? "Verified"
                  : "Verify"}
              </button>
            </div>
          </div>
        )}

        {/* Password input and Sign In */}
        {otpVerified && (
          <div className="mb-4">
            <label className="block mb-1 text-white font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 rounded border border-neutral-600 bg-neutral-700 text-white"
            />
            <button
              type="submit"
              disabled={loadingSignIn || !password}
              className="w-full mt-4 bg-purple-700 hover:bg-purple-800 text-white rounded py-2 font-bold disabled:opacity-70"
            >
              {loadingSignIn ? "Signing in…" : "Sign In"}
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="text-red-400 mt-2 text-center">{error}</div>
        )}
      </form>
    </div>
  );
}
