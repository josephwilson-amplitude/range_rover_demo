export type ModelRange = "Range Rover" | "Range Rover Sport" | "Range Rover Velar" | "Range Rover Evoque";

export interface Vehicle {
  id: string; // ITEM_001
  slug: string;
  name: string;
  model_range: ModelRange;
  base_price: number;
  tagline: string;
  description: string;
  image: string;
  highlights: string[];
  owner_rating: number;
  reviews: { author: string; rating: number; title: string; body: string }[];
}

import rrImg from "@/assets/model-rangerover.jpg";
import sportImg from "@/assets/model-sport.jpg";
import velarImg from "@/assets/model-velar.jpg";
import evoqueImg from "@/assets/model-evoque.jpg";
import { absolutizeAssetUrl } from "@/lib/assets";

export const VEHICLES: Vehicle[] = [
  {
    id: "ITEM_001",
    slug: "range-rover",
    name: "Range Rover",
    model_range: "Range Rover",
    base_price: 113300,
    tagline: "New levels of luxury and refinement.",
    description:
      "The pinnacle of Land Rover design — a serene cabin, peerless capability and a presence that needs no introduction.",
    image: absolutizeAssetUrl(rrImg),
    highlights: ["Cabin Air Purification Pro", "Active Noise Cancellation", "Executive Class Rear Seats"],
    owner_rating: 4.8,
    reviews: [
      { author: "M. Hartwell", rating: 5, title: "Effortless luxury", body: "The most refined SUV I've ever driven. The cabin is a sanctuary." },
      { author: "J. Okafor", rating: 4.5, title: "Worth every detail", body: "Phenomenal presence and the ride quality is otherworldly." },
    ],
  },
  {
    id: "ITEM_002",
    slug: "range-rover-sport",
    name: "Range Rover Sport",
    model_range: "Range Rover Sport",
    base_price: 83700,
    tagline: "The most dynamic Range Rover Sport ever.",
    description:
      "Sculpted, composed and assertive. Range Rover Sport delivers exhilarating performance with the comfort of a flagship.",
    image: absolutizeAssetUrl(sportImg),
    highlights: ["Dynamic Air Suspension", "Twin-Turbo V8", "Stormer Handling Pack"],
    owner_rating: 4.7,
    reviews: [
      { author: "C. Devlin", rating: 5, title: "Performance & poise", body: "Handles like a sport saloon, looks like nothing else on the road." },
      { author: "R. Mendes", rating: 4, title: "A daily thrill", body: "Family practical with proper performance — best of both worlds." },
    ],
  },
  {
    id: "ITEM_003",
    slug: "range-rover-velar",
    name: "Range Rover Velar",
    model_range: "Range Rover Velar",
    base_price: 61600,
    tagline: "The avant-garde Range Rover.",
    description:
      "Reductive design and sculptural surfaces define Velar. A modernist statement, refined inside and out.",
    image: absolutizeAssetUrl(velarImg),
    highlights: ["Pivi Pro Curved Display", "Flush Deployable Door Handles", "Matrix LED Headlights"],
    owner_rating: 4.6,
    reviews: [
      { author: "A. Lindqvist", rating: 5, title: "Pure design", body: "Every line considered. Interior feels like a contemporary lounge." },
      { author: "T. Yamada", rating: 4, title: "Quietly bold", body: "Understated and elegant — turns heads without trying." },
    ],
  },
  {
    id: "ITEM_004",
    slug: "range-rover-evoque",
    name: "Range Rover Evoque",
    model_range: "Range Rover Evoque",
    base_price: 50975,
    tagline: "Distinctly Evoque.",
    description:
      "A compact luxury SUV with unmistakable presence — refined materials, intelligent technology, and city-ready capability.",
    image: absolutizeAssetUrl(evoqueImg),
    highlights: ["ClearSight Ground View", "Premium Textile Interior", "Wade Sensing"],
    owner_rating: 4.5,
    reviews: [
      { author: "K. Beaumont", rating: 5, title: "City-perfect", body: "Compact, gorgeous, and genuinely capable. The wade sensing is brilliant." },
      { author: "S. Parikh", rating: 4, title: "Exceptional fit and finish", body: "Feels like a much pricier vehicle. Love the materials." },
    ],
  },
];

export const MODEL_CATEGORIES: ModelRange[] = [
  "Range Rover",
  "Range Rover Sport",
  "Range Rover Velar",
  "Range Rover Evoque",
];

export function findVehicleBySlug(slug?: string) {
  return VEHICLES.find((v) => v.slug === slug);
}

export const EXTERIOR_COLORS = [
  { id: "santorini-black", name: "Santorini Black", price: 0, swatch: "#0a0a0a" },
  { id: "fuji-white", name: "Fuji White", price: 0, swatch: "#f4f4f2" },
  { id: "borasco-grey", name: "Borasco Grey", price: 1500, swatch: "#5a5d61" },
  { id: "carpathian-grey", name: "Carpathian Grey", price: 1850, swatch: "#7d7e80" },
  { id: "firenze-red", name: "Firenze Red", price: 2200, swatch: "#7a1a1f" },
];

export const WHEEL_OPTIONS = [
  { id: "21-style-1", name: "21\" Style 5145", price: 0 },
  { id: "22-style-2", name: "22\" Style 1075", price: 2400 },
  { id: "23-style-3", name: "23\" Style 5145 Diamond Turned", price: 4900 },
];

export const INTERIOR_OPTIONS = [
  { id: "ebony", name: "Ebony Windsor Leather", price: 0 },
  { id: "caraway", name: "Caraway / Ebony Semi-Aniline", price: 3200 },
  { id: "perlino", name: "Perlino / Ebony Semi-Aniline", price: 3200 },
];
