import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-rangerover.jpg";
import { VEHICLES, MODEL_CATEGORIES } from "@/data/vehicles";
import { track } from "@/lib/amplitude";
import { absolutizeAssetUrl } from "@/lib/assets";
import { useApp } from "@/context/AppContext";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const { isReturnVisit } = useApp();
  const heroImageUrl = useMemo(() => absolutizeAssetUrl(heroImg), []);

  useEffect(() => {
    track("Model Range Viewed", { is_return_visit: isReturnVisit });
  }, [isReturnVisit]);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-foreground">
        <img
          src={heroImageUrl}
          alt="Range Rover SUV at dusk on a wet mountain road"
          className="absolute inset-0 h-full w-full object-cover opacity-90 animate-slow-zoom"
          width={1920}
          height={1088}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 lg:px-10 lg:pb-28">
            <div className="eyebrow text-white/80 animate-fade-in">The New Range Rover</div>
            <h1 className="h-display mt-4 text-5xl text-white sm:text-6xl lg:text-8xl animate-fade-up">
              LEAD BY EXAMPLE
            </h1>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up">
              <Link to="/vehicles" className="btn-onhero">
                Explore the Range <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/vehicles/range-rover" className="btn-onhero">
                Build &amp; Reserve
              </Link>
            </div>
            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.2em] text-white/55">
              European Model Shown.
            </p>
          </div>
        </div>
      </section>

      {/* MODEL RANGE */}
      <section className="bg-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow text-foreground/60">The Range</div>
              <h2 className="h-display mt-3 text-4xl lg:text-5xl">A vehicle for every journey.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {MODEL_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/vehicles?category=${encodeURIComponent(cat)}`}
                  onClick={() =>
                    track("Model Category Browsed", {
                      model_range: cat,
                      vehicles_visible: VEHICLES.filter((v) => v.model_range === cat).length,
                    })
                  }
                  className="border border-foreground/20 bg-background px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {VEHICLES.map((v) => (
              <Link
                key={v.id}
                to={`/vehicles/${v.slug}`}
                className="group block bg-background"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-bone">
                  <img
                    src={v.image}
                    alt={v.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="display text-xl tracking-[0.12em]">{v.name.toUpperCase()}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.tagline}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-foreground/70">
                      Starting at ${v.base_price.toLocaleString()}*
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] underline-offset-4 group-hover:underline">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER */}
      <Offers />
    </div>
  );
}

function Offers() {
  const handleViewOffer = () => {
    track("Offer Viewed", {
      offer_type: "percentage_off",
      finance_discount_pct: 0.05,
      finance_discount_value: 5000,
    });
  };
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <div className="eyebrow text-background/60">Current Offers</div>
          <h2 className="h-display mt-3 text-4xl lg:text-5xl">Exceptional finance, exceptionally placed.</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-background/75">
            Discover preferential APR on selected models when you reserve through your local retailer this season.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/finance" onClick={handleViewOffer} className="btn-onhero">View Offers</Link>
            <Link to="/retailer" className="btn-onhero">Locate a Retailer</Link>
          </div>
        </div>
        <div className="border border-background/15 p-8">
          <div className="eyebrow text-background/60">Featured Offer</div>
          <div className="mt-4 text-3xl font-light tracking-[0.06em]">2.9% APR</div>
          <div className="mt-2 text-sm text-background/70">on Range Rover Sport, qualifying buyers.</div>
          <div className="mt-8 grid grid-cols-3 gap-6 text-xs">
            <div>
              <div className="text-background/55 uppercase tracking-[0.18em]">Term</div>
              <div className="mt-1">60 mo.</div>
            </div>
            <div>
              <div className="text-background/55 uppercase tracking-[0.18em]">Down</div>
              <div className="mt-1">$8,500</div>
            </div>
            <div>
              <div className="text-background/55 uppercase tracking-[0.18em]">Saving</div>
              <div className="mt-1">$5,000</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
