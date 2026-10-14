import type {
  City,
  FooterColumn,
  NavLink,
  SocialLink,
} from "@/lib/types";

export const SITE = {
  name: "ShowPanda",
  tagline: "Book the movies you love.",
  description:
    "Discover the latest movie releases, browse theatres near you, and choose seats on ShowPanda.",
} as const;

export const PRIMARY_NAV: NavLink[] = [
  { label: "Movies", href: "/#all-movies" },
];

export const CITIES: City[] = [
  { id: "mumbai", name: "Mumbai", popular: true },
  { id: "delhi-ncr", name: "Delhi-NCR", popular: true },
  { id: "bengaluru", name: "Bengaluru", popular: true },
  { id: "hyderabad", name: "Hyderabad", popular: true },
  { id: "chennai", name: "Chennai", popular: true },
  { id: "kolkata", name: "Kolkata", popular: true },
  { id: "pune", name: "Pune", popular: true },
  { id: "ahmedabad", name: "Ahmedabad", popular: true },
  { id: "jaipur", name: "Jaipur" },
  { id: "lucknow", name: "Lucknow" },
  { id: "chandigarh", name: "Chandigarh" },
  { id: "kochi", name: "Kochi" },
  { id: "indore", name: "Indore" },
  { id: "nagpur", name: "Nagpur" },
  { id: "bhopal", name: "Bhopal" },
  { id: "goa", name: "Goa" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Cancellation Policy", href: "/policies/cancellation" },
      { label: "Refund Policy", href: "/policies/refund" },
      { label: "Terms & Conditions", href: "/legal/terms" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Movies", href: "/#all-movies" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "instagram", label: "Instagram", href: "https://instagram.com" },
  { platform: "facebook", label: "Facebook", href: "https://facebook.com" },
  { platform: "x", label: "X (Twitter)", href: "https://x.com" },
  { platform: "youtube", label: "YouTube", href: "https://youtube.com" },
  { platform: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];

export const MAX_SEATS = 10;
