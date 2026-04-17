import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EXTERIOR_COLORS, INTERIOR_OPTIONS, WHEEL_OPTIONS, findVehicleBySlug } from "@/data/vehicles";
import { track } from "@/lib/amplitude";
import { useBuild } from "@/context/BuildContext";
import { useApp } from "@/context/AppContext";
import { ChevronDown, Check } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { toast } from "@/hooks/use-toast";

export default function Configure() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const vehicle = findVehicleBySlug(slug);
  const { setBuild, abandonIfDirty } = useBuild();
  const { user, setHasPreviousBuild } = useApp();

  const [exterior, setExterior] = useState(EXTERIOR_COLORS[0]);
  const [wheel, setWheel] = useState(WHEEL_OPTIONS[0]);
  const [interior, setInterior] = useState(INTERIOR_OPTIONS[0]);
  const [homeDelivery, setHomeDelivery] = useState(true);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [breakdownFired, setBreakdownFired] = useState(false);

  const configuredPrice = useMemo(() => {
    if (!vehicle) return 0;
    return vehicle.base_price + exterior.price + wheel.price + interior.price;
  }, [vehicle, exterior, wheel, interior]);

  const deliveryCost = homeDelivery ? 1495 : 0;
  const taxAmount = Math.round(configuredPrice * 0.0625);
  const totalAmount = configuredPrice + deliveryCost + taxAmount;

  // Abandon if user navigates away with unsaved configuration
  useEffect(() => {
    return () => {
      // If they leave without saving — Note: abandon also triggers on BuildContext if a build exists
      // We treat unfinished sessionStorage build as abandoned on unmount of configurator
      // but only when not navigating to /quote (handled by the user's own button flow).
    };
  }, []);

  if (!vehicle) return <NotFound />;

  const openBreakdown = () => {
    setBreakdownOpen((v) => !v);
  };

  const saveBuild = () => {
    // Logged-in users can successfully save — fires the success event.
    if (user) {
      track("Build Saved", {
        vehicle_id: vehicle.id,
        model_range: vehicle.model_range,
        configured_price: configuredPrice,
      });
      toast({
        title: "Build saved",
        description: `Your ${vehicle.name} configuration has been saved to your account.`,
      });
      setHasPreviousBuild(true);
      return;
    }

    // Guest users hit the friction event — Range Rover's key drop-off moment.
    // Simulated failure surfaces a real console error so it shows up in
    // browser devtools and Amplitude session replay.
    console.error(
      "[BuildSave] Failed to persist build configuration:",
      new Error("AuthError: 401 Unauthorized — sign in required to save builds"),
      {
        vehicle_id: vehicle.id,
        model_range: vehicle.model_range,
        configured_price: configuredPrice,
      },
    );

    track("Build Save Failed", {
      vehicle_id: vehicle.id,
      model_range: vehicle.model_range,
      configured_price: configuredPrice,
      delivery_cost: deliveryCost,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      home_delivery_eligible: homeDelivery,
    });
    toast({
      title: "We couldn't save your build",
      description: "Sign in to save your configuration and pick it up on any device.",
      variant: "destructive",
    });
  };



  const continueToQuote = () => {
    setBuild({
      vehicleId: vehicle.id,
      modelRange: vehicle.model_range,
      basePrice: vehicle.base_price,
      exteriorColor: exterior,
      wheel,
      interior,
      homeDelivery,
    });
    navigate(`/quote/${vehicle.slug}`);
  };

  const abandon = () => {
    abandonIfDirty();
    navigate("/vehicles");
  };

  return (
    <div className="bg-background">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 lg:grid-cols-[1.4fr,1fr] lg:px-10 lg:py-16">
        {/* Configurator */}
        <div>
          <div className="eyebrow text-foreground/60">Build &amp; Reserve</div>
          <h1 className="h-display mt-3 text-3xl lg:text-5xl">{vehicle.name}</h1>

          <div className="mt-8 aspect-[16/10] overflow-hidden bg-bone">
            <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
          </div>

          <Section title="Exterior Colour">
            <div className="flex flex-wrap gap-3">
              {EXTERIOR_COLORS.map((c) => {
                const active = c.id === exterior.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setExterior(c)}
                    className={`flex items-center gap-3 border px-3 py-2 text-xs uppercase tracking-[0.18em] ${
                      active ? "border-foreground" : "border-foreground/20 hover:border-foreground/50"
                    }`}
                  >
                    <span className="h-5 w-5 border border-foreground/30" style={{ background: c.swatch }} />
                    <span>{c.name}</span>
                    {c.price > 0 && <span className="text-foreground/55">+${c.price}</span>}
                    {active && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Wheels">
            <div className="grid gap-3 sm:grid-cols-3">
              {WHEEL_OPTIONS.map((w) => {
                const active = w.id === wheel.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setWheel(w)}
                    className={`border p-4 text-left ${active ? "border-foreground" : "border-foreground/20 hover:border-foreground/50"}`}
                  >
                    <div className="text-sm font-light">{w.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/55">
                      {w.price ? `+$${w.price.toLocaleString()}` : "Included"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Interior">
            <div className="grid gap-3 sm:grid-cols-3">
              {INTERIOR_OPTIONS.map((i) => {
                const active = i.id === interior.id;
                return (
                  <button
                    key={i.id}
                    onClick={() => setInterior(i)}
                    className={`border p-4 text-left ${active ? "border-foreground" : "border-foreground/20 hover:border-foreground/50"}`}
                  >
                    <div className="text-sm font-light">{i.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/55">
                      {i.price ? `+$${i.price.toLocaleString()}` : "Included"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Delivery">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={homeDelivery}
                onChange={(e) => setHomeDelivery(e.target.checked)}
                className="h-4 w-4 accent-foreground"
              />
              Home delivery — concierge handover at your address (+$1,495)
            </label>
          </Section>
        </div>

        {/* Sticky summary */}
        <aside className="lg:sticky lg:top-24 self-start border border-foreground/15 bg-bone">
          <div className="border-b border-foreground/10 p-6">
            <div className="eyebrow text-foreground/60">Your Configuration</div>
            <div className="mt-3 text-3xl font-light tracking-[0.04em]">
              ${configuredPrice.toLocaleString()}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/55">
              {vehicle.name} — {exterior.name}
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={openBreakdown}
              className="flex w-full items-center justify-between border border-foreground/20 px-4 py-3 text-[0.7rem] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
            >
              <span>View Cost Breakdown</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${breakdownOpen ? "rotate-180" : ""}`} />
            </button>

            {breakdownOpen && (
              <div className="mt-4 space-y-2 border border-foreground/10 bg-background p-4 text-sm animate-fade-in">
                <Row label="Vehicle" value={`$${vehicle.base_price.toLocaleString()}`} />
                <Row label={`Colour — ${exterior.name}`} value={`$${exterior.price.toLocaleString()}`} />
                <Row label={`Wheels — ${wheel.name}`} value={`$${wheel.price.toLocaleString()}`} />
                <Row label={`Interior — ${interior.name}`} value={`$${interior.price.toLocaleString()}`} />
                <Row label="Delivery" value={`$${deliveryCost.toLocaleString()}`} />
                <Row label="Estimated Tax" value={`$${taxAmount.toLocaleString()}`} />
                <div className="my-2 h-px bg-foreground/10" />
                <Row label="Total" value={`$${totalAmount.toLocaleString()}`} bold />
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button onClick={continueToQuote} className="btn-primary w-full justify-center">
                Request Finance Quote
              </button>
              <button onClick={saveBuild} className="btn-ghost w-full justify-center">
                {user ? "Save This Build" : "Save This Build (as guest)"}
              </button>
              <button onClick={abandon} className="w-full text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
                Discard &amp; return
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="eyebrow text-foreground/60">{title}</div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-medium" : "text-foreground/80"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
