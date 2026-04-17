import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bookmark, MapPin, MessageCircle, Menu, User, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function Header() {
  const { user, setLoginOpen, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/60">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <div className="flex items-center gap-8">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink to="/vehicles" className="nav-link">Vehicles</NavLink>
            <NavLink to="/owners" className="nav-link">Owners</NavLink>
            <NavLink to="/explore" className="nav-link">Explore</NavLink>
            <NavLink to="/shop" className="nav-link">Shop Now</NavLink>
          </nav>
        </div>

        <Link to="/" className="display text-[1.05rem] tracking-[0.32em] font-light">
          RANGE&nbsp;ROVER
        </Link>

        <div className="flex items-center gap-5 lg:gap-7">
          <Link to="/retailer" className="hidden md:flex items-center gap-2 nav-link">
            <MapPin className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Locate a Retailer</span>
          </Link>
          <Link to="/builds" className="hidden md:flex items-center gap-2 nav-link">
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Builds</span>
          </Link>
          <Link to="/support" className="hidden md:flex items-center gap-2 nav-link">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Support</span>
          </Link>
          <button
            onClick={() => navigate("/search")}
            className="text-foreground/85 hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/account" className="nav-link hidden sm:inline">{user.name}</Link>
              <button onClick={logout} className="nav-link">Sign out</button>
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-2 nav-link"
              aria-label="Sign in"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <nav className="flex flex-col px-5 py-4 gap-4">
            {[
              ["/vehicles", "Vehicles"],
              ["/owners", "Owners"],
              ["/explore", "Explore"],
              ["/shop", "Shop Now"],
              ["/retailer", "Locate a Retailer"],
              ["/builds", "Builds"],
              ["/support", "Support"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className="nav-link">
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
