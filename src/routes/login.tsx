import { Link, Navigate, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ParafLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const dest = "/esignature/all-inbox";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isPending && user) return <Navigate to="/esignature/$folder" params={{ folder: "all-inbox" }} />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({ name: name || email.split("@")[0]!, email, password });
        if (error) throw new Error(error.message);
      }
      const { error } = await authClient.signIn.email({ email, password, callbackURL: dest });
      if (error) throw new Error(error.message);
      window.location.href = dest;
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="px-6 py-5">
        <Link to="/">
          <ParafLogo />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-soft">
          <h1 className="text-center text-2xl font-semibold">{mode === "in" ? "Welcome to Paraf" : "Create your Paraf account"}</h1>
          {!mounted ? (
            <div className="mt-6 h-48 skeleton-shimmer rounded-lg" />
          ) : (
            <>
              {authEnabled ? (
                <div className="mt-6 space-y-2">
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => void signIn(p.providerId, { callbackURL: dest })}
                    >
                      Continue with {p.label}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Sign-in is disabled.</p>
              )}
              <form onSubmit={(e) => void submit(e)} className="mt-5 space-y-3">
                {mode === "up" ? (
                  <div>
                    <Label>Name</Label>
                    <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                ) : null}
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    className="mt-1"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                {err ? <p className="text-sm text-danger">{err}</p> : null}
                <Button className="w-full" disabled={busy} type="submit">
                  {mode === "in" ? "Log in" : "Sign up"}
                </Button>
              </form>
              {mode === "in" ? (
                <p className="mt-3 text-center text-sm">
                  <button type="button" className="text-brand hover:underline" onClick={() => toastHint()}>
                    Forgot password?
                  </button>
                </p>
              ) : null}
              <p className="mt-6 text-center text-sm text-muted">
                {mode === "in" ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="font-medium text-brand hover:underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
                  {mode === "in" ? "Sign up" : "Log in"}
                </button>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function toastHint() {
  window.alert("Ask your workspace owner to reset the password, or sign up with a new email.");
}
