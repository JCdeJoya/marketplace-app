"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PasswordResetConfirm } from "@/types/passwordReset";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload: PasswordResetConfirm = { token: token || "", new_password: password };
    const res = await fetch("/api/v1/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) setDone(true);
    else setError("Invalid or expired token.");
  };

  if (!token) return <div>Invalid reset link.</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {done ? (
        <p className="text-green-600">Password reset! You can now log in.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Reset Password
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}