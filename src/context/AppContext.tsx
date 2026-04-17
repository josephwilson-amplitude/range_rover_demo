import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateUserId, resetUser, setUserId, track } from "@/lib/amplitude";

interface SessionUser {
  name: string;
  demoNumber: number;
  userId: string;
  createdAt: string;
  loginCount: number;
}

interface AppCtx {
  user: SessionUser | null;
  isReturnVisit: boolean;
  hasPreviousBuild: boolean;
  setHasPreviousBuild: (v: boolean) => void;
  login: (name: string, demoNumber: number) => SessionUser;
  logout: () => void;
  setLoginOpen: (v: boolean) => void;
  loginOpen: boolean;
}

const Ctx = createContext<AppCtx | null>(null);

const todayKey = () => new Date().toISOString().split("T")[0];
const SESSION_KEY = `rr_session_${todayKey()}`;
const VISIT_KEY = "rr_has_visited";
const BUILD_KEY = "rr_has_saved_build";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isReturnVisit, setIsReturnVisit] = useState(false);
  const [hasPreviousBuild, setHasPreviousBuildState] = useState(false);

  // Bootstrap: restore session, detect return visit, fire Session Ended on unload.
  useEffect(() => {
    const visited = localStorage.getItem(VISIT_KEY) === "1";
    setIsReturnVisit(visited);
    localStorage.setItem(VISIT_KEY, "1");

    setHasPreviousBuildState(localStorage.getItem(BUILD_KEY) === "1");

    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SessionUser;
        setUser(parsed);
        setUserId(parsed.userId);
      }
    } catch {
      /* ignore */
    }

    const onUnload = () => {
      try {
        track("Session Ended", { is_return_visit: visited });
      } catch {
        /* noop */
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const login = useCallback((name: string, demoNumber: number) => {
    const id = generateUserId(name, demoNumber);
    const existingRaw = localStorage.getItem(SESSION_KEY);
    let loginCount = 1;
    if (existingRaw) {
      try {
        loginCount = (JSON.parse(existingRaw).loginCount || 0) + 1;
      } catch {
        /* noop */
      }
    }
    const u: SessionUser = {
      name: name.trim() || "Guest",
      demoNumber,
      userId: id,
      createdAt: new Date().toISOString(),
      loginCount,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    setUserId(id);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    resetUser();
  }, []);

  const setHasPreviousBuild = useCallback((v: boolean) => {
    setHasPreviousBuildState(v);
    if (v) localStorage.setItem(BUILD_KEY, "1");
    else localStorage.removeItem(BUILD_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isReturnVisit, hasPreviousBuild, setHasPreviousBuild, login, logout, loginOpen, setLoginOpen }),
    [user, isReturnVisit, hasPreviousBuild, setHasPreviousBuild, login, logout, loginOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
