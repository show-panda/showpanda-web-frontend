# Movie

An online movie ticket booking app, in the style of BookMyShow.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com) — `radix-nova` style
- `next-themes`, `sonner`

## Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Environment

Create `.env.local` and set the following values:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Booking API origin used for movie data and Google sign-in. |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site, used for OpenGraph and `metadataBase`. |

## Pages and routes

| URL | Source | Purpose |
| --- | --- | --- |
| `/` | `app/(marketing)/page.tsx` | Home page with featured, current, and recommended movies. |
| `/movies` | `app/(marketing)/movies/page.tsx` | Full movie listing; optional `genre` and `lang` query parameters filter the results. |
| `/movies/[slug]` | `app/movies/[slug]/page.tsx` | Cinemas and showtimes for a movie. The URL segment is the movie ID. |
| `/seat-layout/[slug]` | `app/seat-layout/[slug]/page.tsx` | Seat availability and selection for a show. The URL segment is the show ID. |
| `/sign-in` | `app/sign-in/page.tsx` | Google sign-in entry and error messages; `next` can specify the return page. |
| `/auth/callback` | `app/auth/callback/page.tsx` | Completes Google sign-in after the API redirects back. |
| `/api/auth/[action]` | `app/api/auth/[action]/route.ts` | Same-origin proxy for `me`, `refresh`, and `logout` auth requests. |

The `(marketing)` folder groups pages under the shared header and footer; it does not appear in URLs. The root layout supplies the theme, authentication state, and notifications. The seat layout currently stops at seat selection; there is no checkout page in this repo.

## Project layout

```
app/        — routes, layouts, pages
components/ — shared UI (shadcn primitives in components/ui)
lib/        — utilities
```
