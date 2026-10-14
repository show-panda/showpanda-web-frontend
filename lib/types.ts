/**
 * Domain types for the booking platform.
 *
 * Shared UI types for catalog, navigation, and marketing components.
 */

export type Certification = "U" | "UA" | "UA16+" | "A";

export interface Movie {
  id: string;
  slug: string;
  title: string;
  /** Poster artwork (portrait, ~2:3). */
  poster: string;
  /** Wide backdrop used by the hero (landscape, ~16:9). */
  backdrop?: string;
  genres: string[];
  languages: string[];
  /** Runtime in minutes. */
  durationMins: number;
  /** IMDb-style score out of 10. */
  rating: number;
  /** Total user votes, used for "x votes" social proof. */
  votes: number;
  certification: Certification;
  /** ISO date string (YYYY-MM-DD). */
  releaseDate: string;
  /** Short marketing line shown on the hero. */
  tagline?: string;
  formats?: string[];
  isPromoted?: boolean;
}

export interface ComingSoonMovie {
  id: string;
  slug: string;
  title: string;
  poster: string;
  genres: string[];
  languages: string[];
  /** ISO date string the title is expected to release on. */
  releaseDate: string;
  certification?: Certification;
  /** Whether the current user already opted into release reminders. */
  notifyDefault?: boolean;
}

export interface Theatre {
  id: string;
  name: string;
  image: string;
  locality: string;
  city: string;
  screens: number;
  /** Number of distinct shows available today. */
  showsToday: number;
  amenities: string[];
}

export type OfferKind = "bank" | "card" | "combo" | "festival";

export interface Offer {
  id: string;
  kind: OfferKind;
  title: string;
  description: string;
  code?: string;
  /** Short partner/brand label, e.g. "HDFC Bank". */
  partner: string;
  /** ISO date the offer expires. */
  expiresOn?: string;
}

export interface Genre {
  id: string;
  name: string;
  /** Emoji used as a lightweight, dependency-free genre glyph. */
  glyph: string;
  /** Tailwind gradient classes for the card background. */
  gradient: string;
}

export interface Language {
  id: string;
  name: string;
  /** Native-script label, e.g. "हिन्दी". */
  native: string;
}

export interface City {
  id: string;
  name: string;
  popular?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "x"
  | "youtube"
  | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

/** Categories used by the recommended/trending carousel. */
export type RecommendationRail = "trending" | "popular" | "topRated";
