import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { generateUserId } from "@/lib/amplitude";

export default function LoginModal() {
  const { loginOpen, setLoginOpen, login } = useApp();
  const [name, setName] = useState("");
  const [demoNumber, setDemoNumber] = useState<number>(1);

  useEffect(() => {
    if (!loginOpen) {
      setName("");
      setDemoNumber(1);
    }
  }, [loginOpen]);

  const previewId = useMemo(() => generateUserId(name || "guest", demoNumber), [name, demoNumber]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name || "Guest", demoNumber);
    setLoginOpen(false);
  };

  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent className="max-w-md rounded-none border-foreground/10 p-0">
        <div className="p-8">
          <DialogHeader>
            <div className="eyebrow text-foreground/60">Member Sign In</div>
            <DialogTitle className="display mt-2 text-2xl font-light tracking-[0.06em]">
              Save your build.
            </DialogTitle>
            <DialogDescription className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Sign in to save quotes, sync across devices and pick up your configuration where you left off.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label className="eyebrow text-foreground/70">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-none border-foreground/20 focus-visible:ring-foreground"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label className="eyebrow text-foreground/70">Demo Number</Label>
              <Input
                type="number"
                min={1}
                value={demoNumber}
                onChange={(e) => setDemoNumber(Math.max(1, parseInt(e.target.value || "1", 10)))}
                className="rounded-none border-foreground/20 focus-visible:ring-foreground"
              />
            </div>
            <div className="border border-dashed border-foreground/20 bg-bone p-4">
              <div className="eyebrow text-foreground/60">Your Amplitude User ID</div>
              <div className="mt-1 font-mono text-xs text-foreground">{previewId}</div>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Sign in</button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
