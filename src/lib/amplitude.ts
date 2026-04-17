// Lightweight Amplitude wrapper — Amplitude is loaded via CDN in index.html
// We never install via npm; we read it from window.

declare global {
  interface Window {
    amplitude?: {
      track: (event: string, props?: Record<string, unknown>) => void;
      setUserId: (id: string | undefined) => void;
      reset: () => void;
      add: (plugin: unknown) => void;
      init: (key: string, opts?: Record<string, unknown>) => void;
    };
    sessionReplay?: { plugin: (opts?: Record<string, unknown>) => unknown };
    engagement?: { plugin: () => unknown };
  }
}

export function track(event: string, props: Record<string, unknown> = {}) {
  try {
    if (typeof window !== "undefined" && window.amplitude) {
      window.amplitude.track(event, props);
    }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[amplitude]", event, props);
    }
  } catch (e) {
    console.warn("amplitude track error", e);
  }
}

export function setUserId(id: string | undefined) {
  try {
    window.amplitude?.setUserId(id);
  } catch {
    /* noop */
  }
}

export function resetUser() {
  try {
    window.amplitude?.reset();
  } catch {
    /* noop */
  }
}

export function generateUserId(name: string, demoNumber: number | string) {
  const clean = (name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "") || "user";
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `${clean}_${demoNumber}_${today}`;
}
