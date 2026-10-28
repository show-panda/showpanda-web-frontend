type NavLink = { label: string; href: string };

export const SITE = {
  name: "ShowPanda",
  tagline: "Book the movies you love.",
  description:
    "Discover the latest movie releases, browse theatres near you, and choose seats on ShowPanda.",
} as const;

export const PRIMARY_NAV: NavLink[] = [
  { label: "Movies", href: "/movies" },
];

export const MAX_SEATS = 10;
