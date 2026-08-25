# Hage Reading Club

Landing website for **Hage Reading Club** — a community for reading, learning, sharing, and growth.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default language is Somali. Use **SO | EN | AR** in the navbar to switch languages (Arabic uses RTL).

## Replace before launch

Update placeholders in `src/lib/site.ts`:

- Email, phone, and social links
- Public site URL (`metadataBase` in `src/app/layout.tsx`, sitemap, and robots)
