import type {
  City,
  FooterColumn,
  Genre,
  Language,
  NavLink,
  SocialLink,
} from "@/lib/types";

export const SITE = {
  name: "ShowPanda",
  tagline: "Book the movies you love.",
  description:
    "Discover the latest movie releases, browse theatres and events near you, and book tickets in seconds — all on Cineplex.",
} as const;

export const PRIMARY_NAV: NavLink[] = [
  { label: "Movies", href: "/#now-showing" },
  { label: "Theatres", href: "/#theatres" },
  { label: "Events", href: "/#events" },
  { label: "Offers", href: "/#offers" },
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

export const LANGUAGES: Language[] = [
  { id: "hindi", name: "Hindi", native: "हिन्दी" },
  { id: "english", name: "English", native: "English" },
  { id: "tamil", name: "Tamil", native: "தமிழ்" },
  { id: "telugu", name: "Telugu", native: "తెలుగు" },
  { id: "malayalam", name: "Malayalam", native: "മലയാളം" },
  { id: "kannada", name: "Kannada", native: "ಕನ್ನಡ" },
  { id: "punjabi", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export const GENRES: Genre[] = [
  {
    id: "action",
    name: "Action",
    glyph: "💥",
    gradient: "from-orange-500/25 to-red-600/25",
  },
  {
    id: "comedy",
    name: "Comedy",
    glyph: "😂",
    gradient: "from-amber-400/25 to-yellow-500/25",
  },
  {
    id: "drama",
    name: "Drama",
    glyph: "🎭",
    gradient: "from-violet-500/25 to-fuchsia-600/25",
  },
  {
    id: "thriller",
    name: "Thriller",
    glyph: "🔪",
    gradient: "from-slate-500/25 to-zinc-700/25",
  },
  {
    id: "horror",
    name: "Horror",
    glyph: "👻",
    gradient: "from-emerald-600/25 to-green-900/25",
  },
  {
    id: "sci-fi",
    name: "Sci-Fi",
    glyph: "🚀",
    gradient: "from-cyan-500/25 to-blue-700/25",
  },
  {
    id: "romance",
    name: "Romance",
    glyph: "💞",
    gradient: "from-pink-500/25 to-rose-600/25",
  },
  {
    id: "adventure",
    name: "Adventure",
    glyph: "🧭",
    gradient: "from-lime-500/25 to-teal-600/25",
  },
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
      { label: "Movies", href: "#now-showing" },
      { label: "Theatres", href: "#theatres" },
      { label: "Events", href: "#events" },
      { label: "Offers", href: "#offers" },
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
