"use client";
import { useState } from "react";
import { PasswordResetRequest } from "@/types/passwordReset";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: PasswordResetRequest = { email };
    await fetch("/api/v1/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {sent ? (
        <p className="text-green-600">If your email exists, a reset link has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}