"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAdminAction, type AdminLoginState } from "@/lib/actions/auth";

const initialState: AdminLoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign in to admin"}
    </button>
  );
}

export function AdminLoginForm({ loggedOut = false }: { loggedOut?: boolean }) {
  const [state, formAction] = useActionState(loginAdminAction, initialState);

  return (
    <div className="card-surface mx-auto max-w-md p-8 sm:p-10">
      <div>
        <p className="eyebrow">Admin access</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Use an admin or staff account to manage routes, trips, operators, blog posts, and
          booking requests.
        </p>
      </div>

      {loggedOut ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          You have been signed out.
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            placeholder="admin@vnbus.com"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            placeholder="Enter your password"
            required
          />
        </label>

        <SubmitButton />
      </form>
    </div>
  );
}
