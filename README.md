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

Copy `.env.example` to `.env.local` and fill in values.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site, used for OpenGraph and `metadataBase`. |

## Project layout

```
app/        — routes, layouts, pages
components/ — shared UI (shadcn primitives in components/ui)
lib/        — utilities
public/     — static assets
```
