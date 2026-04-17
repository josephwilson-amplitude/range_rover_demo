import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBuild } from "@/context/BuildContext";
import { useApp } from "@/context/AppContext";
import { findVehicleBySlug } from "@/data/vehicles";
import { track } from "@/lib/amplitude";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NotFound from "@/pages/NotFound";

export default function Quote() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const vehicle = findVehicleBySlug(slug);
  const { build } = useBuild();
  const { user, hasPreviousBuild, setHasPreviousBuild } = useApp();

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; pct: number; value: number } | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");

  const configuredPrice = useMemo(() => {
    if (!build || !vehicle) return 0;
    return build.basePrice + build.exteriorColor.price + build.wheel.price + build.interior.price;
  }, [build, vehicle]);

  const deliveryCost = build?.homeDelivery ? 1495 : 0;
  const taxAmount = Math.round(configuredPrice * 0.0625);
  const subTotal = configuredPrice + deliveryCost + taxAmount;
  const discount = appliedPromo?.value || 0;
  const totalAmount = Math.max(0, subTotal - discount);

  useEffect(() => {
    if (!vehicle || !build) return;
    track("Finance Quote Requested", {
      vehicle_id: vehicle.id,
      model_range: vehicle.model_range,
      configured_price: configuredPrice,
      delivery_cost: deliveryCost,
      tax_amount: taxAmount,
      total_amount: subTotal,
      home_delivery_eligible: !!build.homeDelivery,
      previous_build: hasPreviousBuild,
    });
  }, [vehicle, build, configuredPrice, deliveryCost, taxAmount, subTotal, hasPreviousBuild]);

  if (!vehicle) return <NotFound />;
  if (!build) {
    return (
      <div className="mx-auto max-w-[800px] px-5 py-24 text-center">
        <h1 className="h-display text-3xl">No active build.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Start a configuration to request a finance quote.
        </p>
        <button onClick={() => navigate(`/vehicles/${slug}`)} className="btn-primary mt-6">
          Back to {vehicle.name}
        </button>
      </div>
    );
  }

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    const promoAttempted = true;
    if (!code) return;
    let applied = false;
    let pct = 0;
    let value = 0;
    if (code === "RR10") {
      pct = 0.1;
      value = Math.round(subTotal * pct);
      setAppliedPromo({ code, pct, value });
      applied = true;
    } else {
      setAppliedPromo(null);
    }
    track("Finance Promo Applied", {
      promo_attempted: promoAttempted,
      promo_applied: applied,
      finance_discount_pct: pct,
      finance_discount_value: value,
      vehicle_id: vehicle.id,
      model_range: vehicle.model_range,
    });
  };

  const submitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const enquiryId = `ORD_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${String(
      Math.floor(Math.random() * 900) + 100,
    )}`;
    const isFirst = !hasPreviousBuild;
    track("Retailer Enquiry Submitted", {
      enquiry_id: enquiryId,
      vehicle_id: vehicle.id,
      model_range: vehicle.model_range,
      configured_price: configuredPrice,
      delivery_cost: deliveryCost,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      home_delivery_eligible: !!build.homeDelivery,
      is_first_enquiry: isFirst,
      previous_build: hasPreviousBuild,
    });
    setHasPreviousBuild(true);
    navigate(`/enquiry/confirmed?id=${enquiryId}&vehicle=${vehicle.slug}&total=${totalAmount}`);
  };

  return (
    <div className="bg-bone">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 lg:grid-cols-[1.2fr,1fr] lg:px-10 lg:py-20">
        <div>
          <div className="eyebrow text-foreground/60">Finance Quote</div>
          <h1 className="h-display mt-3 text-3xl lg:text-5xl">Reserve {vehicle.name}.</h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Submit your details and your local retailer will be in touch within one business day to finalise your quote.
          </p>

          <form onSubmit={submitEnquiry} className="mt-10 space-y-5 bg-background p-7 border border-foreground/10">
            <div className="space-y-2">
              <Label className="eyebrow text-foreground/70">Full Name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-none border-foreground/20 focus-visible:ring-foreground" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="eyebrow text-foreground/70">Email</Label>
                <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none border-foreground/20 focus-visible:ring-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="eyebrow text-foreground/70">ZIP / Postcode</Label>
                <Input required value={zip} onChange={(e) => setZip(e.target.value)} className="rounded-none border-foreground/20 focus-visible:ring-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="eyebrow text-foreground/70">Promo Code</Label>
              <div className="flex gap-2">
                <Input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Try RR10" className="rounded-none border-foreground/20 focus-visible:ring-foreground" />
                <button type="button" onClick={applyPromo} className="btn-ghost">Apply</button>
              </div>
              {appliedPromo && (
                <p className="text-xs text-foreground/70">
                  Promo {appliedPromo.code} applied — saving ${appliedPromo.value.toLocaleString()}.
                </p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Submit Enquiry
            </button>
          </form>
        </div>

        <aside className="border border-foreground/15 bg-background p-7 self-start">
          <div className="eyebrow text-foreground/60">Summary</div>
          <h2 className="display mt-3 text-xl tracking-[0.12em]">{vehicle.name.toUpperCase()}</h2>
          <div className="mt-5 space-y-2 text-sm text-foreground/80">
            <Row label="Vehicle" value={`$${build.basePrice.toLocaleString()}`} />
            <Row label={`Colour — ${build.exteriorColor.name}`} value={`$${build.exteriorColor.price.toLocaleString()}`} />
            <Row label={`Wheels — ${build.wheel.name}`} value={`$${build.wheel.price.toLocaleString()}`} />
            <Row label={`Interior — ${build.interior.name}`} value={`$${build.interior.price.toLocaleString()}`} />
            <Row label="Delivery" value={`$${deliveryCost.toLocaleString()}`} />
            <Row label="Estimated Tax" value={`$${taxAmount.toLocaleString()}`} />
            {appliedPromo && <Row label={`Promo ${appliedPromo.code}`} value={`-$${discount.toLocaleString()}`} />}
            <div className="my-3 h-px bg-foreground/10" />
            <Row label="Total" value={`$${totalAmount.toLocaleString()}`} bold />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-medium text-foreground" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
