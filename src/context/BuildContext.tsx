import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/amplitude";

export interface BuildConfig {
  vehicleId: string;
  modelRange: string;
  basePrice: number;
  exteriorColor: { id: string; name: string; price: number };
  wheel: { id: string; name: string; price: number };
  interior: { id: string; name: string; price: number };
  homeDelivery: boolean;
}

interface BuildCtx {
  build: BuildConfig | null;
  setBuild: (b: BuildConfig | null) => void;
  abandonIfDirty: () => void;
}

const Ctx = createContext<BuildCtx | null>(null);
const KEY = "rr_active_build";

export function BuildProvider({ children }: { children: React.ReactNode }) {
  const [build, setBuildState] = useState<BuildConfig | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setBuildState(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const setBuild = useCallback((b: BuildConfig | null) => {
    setBuildState(b);
    if (b) sessionStorage.setItem(KEY, JSON.stringify(b));
    else sessionStorage.removeItem(KEY);
  }, []);

  const abandonIfDirty = useCallback(() => {
    if (build) {
      const configured =
        build.basePrice + build.exteriorColor.price + build.wheel.price + build.interior.price;
      track("Build Abandoned", {
        vehicle_id: build.vehicleId,
        model_range: build.modelRange,
        configured_price: configured,
      });
    }
  }, [build]);

  const value = useMemo(() => ({ build, setBuild, abandonIfDirty }), [build, setBuild, abandonIfDirty]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBuild() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBuild outside provider");
  return ctx;
}
