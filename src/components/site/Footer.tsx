import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-foreground text-background">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-4 lg:px-10">
        <div>
          <div className="display text-base tracking-[0.32em]">RANGE ROVER</div>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-background/70">
            Lead by example. Discover the Range Rover family — refined, capable and unmistakable.
          </p>
        </div>
        {[
          { title: "Vehicles", links: [["/vehicles/range-rover", "Range Rover"], ["/vehicles/range-rover-sport", "Range Rover Sport"], ["/vehicles/range-rover-velar", "Velar"], ["/vehicles/range-rover-evoque", "Evoque"]] },
          { title: "Owners", links: [["/owners", "Owner Resources"], ["/support", "Support"], ["/account", "My Account"]] },
          { title: "Build", links: [["/builds", "Saved Builds"], ["/retailer", "Locate a Retailer"], ["/finance", "Finance Offers"]] },
        ].map((col) => (
          <div key={col.title}>
            <div className="eyebrow text-background/60">{col.title}</div>
            <ul className="mt-4 space-y-2.5 text-xs">
              {col.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-background/85 hover:text-background transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 text-[0.65rem] uppercase tracking-[0.18em] text-background/55 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <span>© {new Date().getFullYear()} Range Rover. Demo for Amplitude.</span>
          <span>European Models Shown.</span>
        </div>
      </div>
    </footer>
  );
}
