import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findVehicleBySlug, VEHICLES } from "@/data/vehicles";
import { track } from "@/lib/amplitude";
import NotFound from "@/pages/NotFound";

export default function VehicleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const vehicle = findVehicleBySlug(slug);
  const [readReviewIdx, setReadReviewIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!vehicle) return;
    track("Vehicle Detail Explored", {
      vehicle_id: vehicle.id,
      model_range: vehicle.model_range,
      base_price: vehicle.base_price,
    });
  }, [vehicle]);

  if (!vehicle) return <NotFound />;

  const similar = VEHICLES.filter((v) => v.id !== vehicle.id).slice(0, 3);

  const startBuild = () => {
    track("Build Started", {
      vehicle_id: vehicle.id,
      model_range: vehicle.model_range,
      base_price: vehicle.base_price,
      configured_price: vehicle.base_price,
    });
    navigate(`/build/${vehicle.slug}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-bone">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <div className="eyebrow text-foreground/60">{vehicle.model_range}</div>
            <h1 className="h-display mt-3 text-5xl lg:text-7xl">{vehicle.name}</h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              {vehicle.description}
            </p>
            <div className="mt-8 flex items-baseline gap-4">
              <span className="text-3xl font-light tracking-[0.06em]">
                ${vehicle.base_price.toLocaleString()}
              </span>
              <span className="eyebrow text-foreground/60">Starting MSRP*</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={startBuild} className="btn-primary">Build &amp; Reserve</button>
              <Link to="/retailer" className="btn-ghost">Locate a Retailer</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-background">
            <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <div className="eyebrow text-foreground/60">Highlights</div>
          <h2 className="h-display mt-3 text-3xl lg:text-4xl">Engineered without compromise.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {vehicle.highlights.map((h, i) => (
              <div key={h} className="border-t border-foreground/15 pt-6">
                <div className="eyebrow text-foreground/50">0{i + 1}</div>
                <div className="mt-3 text-lg font-light">{h}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow text-foreground/60">Owner Reviews</div>
              <h2 className="h-display mt-3 text-3xl lg:text-4xl">★ {vehicle.owner_rating} average</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {vehicle.reviews.map((r, idx) => {
              const open = readReviewIdx === idx;
              return (
                <article key={r.author} className="bg-background p-7 border border-foreground/10">
                  <div className="flex items-center justify-between">
                    <div className="display tracking-[0.1em]">{r.author}</div>
                    <div className="text-sm">★ {r.rating.toFixed(1)}</div>
                  </div>
                  <h3 className="mt-3 text-lg font-light">{r.title}</h3>
                  <p className={`mt-2 text-sm text-muted-foreground transition-all ${open ? "" : "line-clamp-2"}`}>
                    {r.body}
                  </p>
                  <button
                    onClick={() => {
                      setReadReviewIdx(open ? null : idx);
                      if (!open) {
                        track("Owner Review Read", {
                          vehicle_id: vehicle.id,
                          model_range: vehicle.model_range,
                          owner_rating: r.rating,
                        });
                      }
                    }}
                    className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] underline-offset-4 hover:underline"
                  >
                    {open ? "Show less" : "Read review"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Similar */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <div className="eyebrow text-foreground/60">You may also like</div>
          <h2 className="h-display mt-3 text-3xl lg:text-4xl">Explore similar models.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {similar.map((v) => (
              <Link
                key={v.id}
                to={`/vehicles/${v.slug}`}
                onClick={() =>
                  track("Similar Model Clicked", {
                    vehicle_id: v.id,
                    model_range: v.model_range,
                    base_price: v.base_price,
                  })
                }
                className="group block bg-bone"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={v.image} alt={v.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="p-5">
                  <div className="display tracking-[0.12em]">{v.name.toUpperCase()}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    From ${v.base_price.toLocaleString()}*
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
