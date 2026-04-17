import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { VEHICLES, MODEL_CATEGORIES } from "@/data/vehicles";
import { track } from "@/lib/amplitude";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function VehiclesIndex() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);

  const filtered = useMemo(() => {
    return VEHICLES.filter((v) => {
      const okCat = !category || v.model_range === category;
      const okQ = !q || `${v.name} ${v.model_range} ${v.tagline}`.toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [category, q]);

  useEffect(() => {
    if (category) {
      track("Model Category Browsed", {
        model_range: category,
        vehicles_visible: filtered.length,
      });
    }
  }, [category, filtered.length]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    track("Vehicle Searched", {
      search_term: term,
      results_count: filtered.length,
    });
    const next = new URLSearchParams(params);
    next.set("q", term);
    setParams(next);
  };

  return (
    <div className="bg-bone">
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="eyebrow text-foreground/60">Vehicles</div>
        <h1 className="h-display mt-3 text-4xl lg:text-6xl">The Range Rover Family.</h1>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const n = new URLSearchParams(params);
                n.delete("category");
                setParams(n);
              }}
              className={`border px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] transition-colors ${
                !category ? "border-foreground bg-foreground text-background" : "border-foreground/20 bg-background hover:bg-foreground hover:text-background"
              }`}
            >
              All
            </button>
            {MODEL_CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => {
                    const n = new URLSearchParams(params);
                    n.set("category", c);
                    setParams(n);
                  }}
                  className={`border px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] transition-colors ${
                    active ? "border-foreground bg-foreground text-background" : "border-foreground/20 bg-background hover:bg-foreground hover:text-background"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <form onSubmit={onSearch} className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search models, e.g. Sport, Velar"
              className="rounded-none border-foreground/20 bg-background pl-9 focus-visible:ring-foreground"
            />
          </form>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {filtered.map((v) => (
            <Link key={v.id} to={`/vehicles/${v.slug}`} className="group block bg-background">
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
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em]">
                  <span>${v.base_price.toLocaleString()}*</span>
                  <span>★ {v.owner_rating}</span>
                </div>
              </div>
            </Link>
          ))}
          {!filtered.length && (
            <div className="col-span-full border border-dashed border-foreground/20 p-12 text-center text-sm text-muted-foreground">
              No vehicles match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
