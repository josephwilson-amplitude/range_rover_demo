import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useBuild } from "@/context/BuildContext";

export default function EnquiryConfirmed() {
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const vehicleSlug = params.get("vehicle") || "";
  const total = params.get("total") || "";
  const { setBuild } = useBuild();

  useEffect(() => {
    setBuild(null);
  }, [setBuild]);

  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-[860px] px-5 py-24 text-center lg:px-10">
        <div className="eyebrow text-foreground/60">Enquiry Submitted</div>
        <h1 className="h-display mt-4 text-4xl lg:text-6xl">Thank you.</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Your enquiry has been received and forwarded to your nearest Range Rover retailer.
          You'll be contacted within one business day to finalise your reservation.
        </p>
        <div className="mx-auto mt-10 max-w-md border border-foreground/15 bg-background p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Enquiry ID</span>
            <span className="font-mono">{id}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-foreground/60">Vehicle</span>
            <span className="capitalize">{vehicleSlug.split("-").join(" ")}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-foreground/60">Total</span>
            <span>${Number(total).toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">Return Home</Link>
          <Link to="/builds" className="btn-ghost">View Saved Builds</Link>
        </div>
      </div>
    </div>
  );
}
