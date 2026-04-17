import { Link } from "react-router-dom";
import { VEHICLES } from "@/data/vehicles";

export default function SimplePage({ title, eyebrow, children }: { title: string; eyebrow: string; children?: React.ReactNode }) {
  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-[1100px] px-5 py-20 lg:px-10">
        <div className="eyebrow text-foreground/60">{eyebrow}</div>
        <h1 className="h-display mt-3 text-4xl lg:text-6xl">{title}</h1>
        <div className="mt-8 max-w-2xl text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function Owners() {
  return (
    <SimplePage eyebrow="Owners" title="Owner resources.">
      <p>Service, software updates, accessories, and concierge ownership tools — everything to keep your Range Rover at its best.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {["Service & Maintenance", "Software Updates", "Owner Handbooks", "Roadside Assistance"].map((t) => (
          <div key={t} className="border border-foreground/15 bg-background p-5">
            <div className="eyebrow text-foreground/55">Service</div>
            <div className="mt-2 text-base font-light">{t}</div>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}

export function Explore() {
  return (
    <SimplePage eyebrow="Explore" title="Stories from the brand.">
      <p>Editorial, films and journeys behind the next chapter of Range Rover.</p>
    </SimplePage>
  );
}

export function Shop() {
  return (
    <SimplePage eyebrow="Shop" title="Range Rover Collection.">
      <p>Discover Range Rover apparel and accessories — refined essentials inspired by the vehicles.</p>
    </SimplePage>
  );
}

export function Retailer() {
  return (
    <SimplePage eyebrow="Locate a Retailer" title="Find your nearest retailer.">
      <p>Use your postcode to find a Range Rover retailer for test drives, service and personal handovers.</p>
      <div className="mt-6 flex gap-2">
        <input
          placeholder="Enter your ZIP / postcode"
          className="w-full max-w-xs border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        />
        <button className="btn-primary">Search</button>
      </div>
    </SimplePage>
  );
}

export function Support() {
  return (
    <SimplePage eyebrow="Support" title="We're here to help.">
      <p>Reach our customer relationship centre 24/7. We're proud to support every Range Rover owner with the same care given to the vehicles themselves.</p>
    </SimplePage>
  );
}

export function Builds() {
  return (
    <SimplePage eyebrow="Builds" title="Your saved builds.">
      <p>Pick up where you left off, or start a new configuration.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {VEHICLES.slice(0, 2).map((v) => (
          <Link key={v.id} to={`/build/${v.slug}`} className="group block bg-background border border-foreground/15">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={v.image} alt={v.name} className="h-full w-full object-cover transition-transform group-hover:scale-[1.03] duration-700" />
            </div>
            <div className="p-5">
              <div className="display tracking-[0.12em]">{v.name.toUpperCase()}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Continue building →</div>
            </div>
          </Link>
        ))}
      </div>
    </SimplePage>
  );
}

export function Finance() {
  return (
    <SimplePage eyebrow="Finance" title="Tailored finance offers.">
      <p>Preferential APR, balloon and lease structures — quoted in minutes through your retailer.</p>
      <ul className="mt-6 space-y-3 text-sm">
        <li className="border border-foreground/15 bg-background p-4">2.9% APR — Range Rover Sport — qualifying buyers.</li>
        <li className="border border-foreground/15 bg-background p-4">$5,000 owner loyalty credit on Range Rover Velar.</li>
      </ul>
    </SimplePage>
  );
}

export function SearchPage() {
  return (
    <SimplePage eyebrow="Search" title="Find your Range Rover.">
      <p>Use the search in the header or browse the full vehicle range.</p>
      <Link to="/vehicles" className="btn-primary mt-6 inline-flex">Browse Vehicles</Link>
    </SimplePage>
  );
}
