import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function Account() {
  const { user, setLoginOpen, logout } = useApp();
  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-[960px] px-5 py-20 lg:px-10">
        <div className="eyebrow text-foreground/60">My Account</div>
        <h1 className="h-display mt-3 text-4xl lg:text-5xl">Account</h1>

        {user ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card label="Name" value={user.name} />
            <Card label="Demo Number" value={String(user.demoNumber)} />
            <Card label="Amplitude User ID" value={user.userId} mono />
            <Card label="Sessions Today" value={String(user.loginCount)} />
            <div className="md:col-span-2 flex gap-3">
              <button onClick={logout} className="btn-ghost">Sign out</button>
              <Link to="/builds" className="btn-primary">View Builds</Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-foreground/15 bg-background p-8 text-center">
            <p className="text-sm text-muted-foreground">You're browsing as a guest.</p>
            <button onClick={() => setLoginOpen(true)} className="btn-primary mt-5">
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border border-foreground/15 bg-background p-6">
      <div className="eyebrow text-foreground/60">{label}</div>
      <div className={`mt-2 text-lg ${mono ? "font-mono text-sm" : "font-light"}`}>{value}</div>
    </div>
  );
}
