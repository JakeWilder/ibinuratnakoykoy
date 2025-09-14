"use client";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/login", { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data?.ok) {
      setErr(data?.error || "Login failed");
      return;
    }
    window.location.href = data.redirect || "/dashboard";
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <input
            name="username"
            required
            className="border rounded px-3 py-2"
            placeholder="Username"
            autoComplete="username"
          />
          <input
            name="password"
            required
            className="border rounded px-3 py-2"
            placeholder="Password"
            type="password"
            autoComplete="current-password"
          />
          <button disabled={loading} className="rounded-xl border px-4 py-2">
            {loading ? "Signing in…" : "Continue"}
          </button>
          {err && <p className="text-red-500 text-sm">{err}</p>}
        </form>
      </div>
    </main>
  );
}
