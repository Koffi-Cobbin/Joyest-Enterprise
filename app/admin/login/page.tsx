import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-muted">
            Joyest Enterprise
          </p>
          <h1 className="mt-2 font-serif text-3xl">Admin sign in</h1>
        </div>
        <form
          method="post"
          action="/api/admin/login"
          className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-muted/20 bg-surface p-8"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-ui text-sm font-medium">
              Admin password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="rounded-md border border-muted/30 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-clay">
              Wrong password. Try again.
            </p>
          ) : null}
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2.5 font-ui text-sm font-medium text-background transition-colors hover:bg-primary-dark"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
