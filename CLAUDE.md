# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup

```bash
# Install dependencies
pnpm install

# Start development server (runs on http://localhost:37572)
pnpm run dev

# Development with watch mode (runs tests + type checking alongside server)
pnpm run dev:watch
```

### Building

```bash
# Production build
pnpm run build

# Development build (without minification)
pnpm run build:dev

# Preview production build
pnpm run preview
```

### Testing & Checking

```bash
# Run all checks (tests + type checking)
pnpm check

# Run checks in watch mode
pnpm check:watch

# Run tests once
pnpm test
```

### Linting & Formatting

```bash
# Check formatting and linting
pnpm lint

# Apply formatting
pnpm format
```

## Architecture Overview

### Content Management System

This is a SvelteKit-based website with Markdown-powered content. Content files live in `src/posts/` and are processed by mdsvex.

**Key Content Concepts:**

- General articles go in `src/posts/` and are accessible via `/:slug` routes
- "Dangers" section articles go in `src/posts/dangers/` with special layout/navigation
- The `getPosts()` function in `src/lib/api.ts` uses Vite's `import.meta.glob` to dynamically load all Markdown files
- Frontmatter in Markdown files provides metadata (title, description, date, optional original source for translations)

### Routing Structure

#### Page Routes

| Route                | Purpose                                        | Implementation                                                                  |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `/`                  | Homepage                                       | `src/routes/+page.svelte`                                                       |
| `/posts`             | Blog posts list                                | `src/routes/posts/+page.svelte`                                                 |
| `/[slug]`            | General content pages (dynamic)                | `src/routes/[slug]/+page.ts` - loads from `src/posts/{slug}.md`                 |
| `/dangers`           | Redirects to first danger article              | `src/routes/dangers/+page.server.ts` - 307 redirect                             |
| `/dangers/[slug]`    | Individual danger articles                     | `src/routes/dangers/[slug]/+page.ts` - loads from `src/posts/dangers/{slug}.md` |
| `/qui-sommes-nous`   | About page                                     | `src/routes/qui-sommes-nous/+page.svelte`                                       |
| `/dons`              | Donation page (HelloAsso card + bank transfer) | `src/routes/dons/+page.svelte`                                                  |
| `/merci`             | Thank you / success page                       | `src/routes/merci/+page.svelte`                                                 |
| `/rejoindre`         | Join / participation page                      | `src/routes/rejoindre/+page.svelte`                                             |
| `/recrutement`       | Quick recruitment guide                        | `src/routes/recrutement/+page.svelte`                                           |
| `/guide-recrutement` | Full recruitment guide (markdown)              | `src/routes/guide-recrutement/+page.md`                                         |
| `/senat2025`         | Senate 2025 campaign page                      | `src/routes/senat2025/+page.svelte`                                             |
| `/declaration`       | PauseAI statement (French form, CiviCRM)       | `src/routes/[lang=lang]/declaration/+page.svelte`                               |

**Special Routing Patterns:**

- Dangers section has custom ordering defined in `PAGE_ORDER` array (`src/routes/dangers/+layout.ts`):
  1. `dangers/economiques-et-materiels`
  2. `dangers/pour-les-individus`
  3. `dangers/pour-la-societe`
  4. `dangers/pour-l'humanite`
- Dangers layout (`src/routes/dangers/+layout.svelte`) provides sidebar navigation and prev/next links
- Root layout (`src/routes/+layout.ts`) has `prerender = true` for static site generation

#### API Endpoints

| Endpoint            | Method   | Purpose                                     | Key Details                        |
| ------------------- | -------- | ------------------------------------------- | ---------------------------------- |
| `/api/posts`        | GET      | Returns all blog posts                      | Uses `getPosts()` from `$lib/api`  |
| `/api/dangers`      | GET      | Returns all danger articles                 | Uses `getPosts('/dangers')`        |
| `/api/subscribe`    | POST     | Newsletter subscription via CiviCRM         | See CiviCRM Integration below      |
| `/api/wise-webhook` | POST     | Wise webhook for bank transfer confirmation | See Wise Webhook Integration below |
| `/api/declaration`  | GET/POST | PauseAI statement: stats / sign             | CiviCRM groups, see below          |
| `/sitemap.xml`      | GET      | XML sitemap for SEO                         | Prerendered, includes all posts    |
| `/sitemap.txt`      | GET      | Text sitemap                                | Alternative format                 |

### External Integrations

#### CiviCRM Integration (`/api/subscribe`)

Handles newsletter and mailing list subscriptions with full contact management.

**Request Body:**

```typescript
{
  email: string                        // Required, validated
  subscribeNewsletter: boolean         // Main newsletter
  subscribeSubstack: boolean           // Substack blog
  subscribeConferenceReport?: boolean  // Senate conference updates
  subscribePolicyProposals?: boolean   // Policy proposal updates
  firstName?: string                   // Optional
  lastName?: string                    // Optional
  source?: string                      // Optional source tracking
}
```

**Functionality:**

- Validates email and ensures at least one subscription selected
- Searches for existing contact via Email entity (API v4)
- Creates new contact if needed (Individual type, Sympathisant sub-type)
- Handles orphaned emails and reassigns them to new contacts
- Updates contact names if provided
- Manages group memberships via GroupContact entity
- **Newsletter subscription automatically adds to both Newsletter group (gid=3) AND Call to Action group (gid=22)**
- Logs activity with customized subject based on selections
- Returns clear success/already-subscribed messages

**Required Environment Variables:**

- `CIVICRM_BASE_URL`
- `CIVICRM_API_KEY`
- `CIVICRM_SITE_KEY`
- `CIVICRM_NEWSLETTER_GROUP_ID` - Newsletter group (gid=3)
- `CIVICRM_CALL_TO_ACTION_GROUP_ID` - Call to Action group (gid=22), auto-added with newsletter
- `CIVICRM_SUBSTACK_GROUP_ID` - Substack group (gid=7), legacy - no longer used via website
- `CIVICRM_CONFERENCE_GROUP_ID`
- `CIVICRM_POLICY_GROUP_ID`
- `CIVICRM_NEWSLETTER_API_CONTACT_ID`

#### PauseAI statement (`/api/declaration`)

The PauseAI Global statement, translated, with our own French form. Signatures are stored in **our** CiviCRM (no dependency on pauseai.info to sign), with **email double opt-in**:

1. `POST /api/declaration` finds/creates the contact (never overwrites an existing name), puts it in group **73** as `Pending` and emails a signed confirmation link (`/[lang]/declaration/confirmer?t=…`, valid 30 days). At most one email per address every 10 minutes: the send time is written in UTC in the details of the « e-mail de confirmation envoyé » activity (`sent_at=…`), never compared with `activity_date_time`, which CiviCRM stores in Paris time. When no new email is sent, the response says so (`resent: false`, `retryInMinutes`) and the page tells the user.
2. The confirm page calls `POST /api/declaration/confirm` on a button click (not on link open: mail scanners open links). Only then: group 73 → `Added` (counted), group **74** → `Added` if the person asked to be listed, Newsletter + Call to Action groups if they opted in.

- Groups: `CIVICRM_DECLARATION_GROUP_ID` (73, all confirmed signatories) and `CIVICRM_DECLARATION_PUBLIC_GROUP_ID` (74, listed publicly with name + `job_title`); defaults 73/74, overridable. Remove someone from 74 to hide them (moderation), from 73 to cancel the signature.
- Email: `src/lib/server/mailer.ts` (nodemailer, SMTP / AWS SES). Same variables as the membership reminder bot (Romain-Deleglise/bot-relance-hello-asso): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_USE_SSL`, `MAIL_FROM`, `MAIL_FROM_NAME`, `MAIL_REPLY_TO`, `MAIL_BCC`, `MAIL_REDIRECT_TO` (test mode). Without SMTP, signing returns 503.
- Token: `src/lib/server/declarationToken.ts` (HMAC, `DECLARATION_TOKEN_SECRET`, falls back to a key derived from `CIVICRM_API_KEY`). Template: `src/lib/server/declarationEmail.ts`.
- `GET` returns `{ local, global }`: our CiviCRM data and PauseAI Global's signatories (pauseai.info/api/signatories, read server-side via `src/lib/server/declarationGlobal.ts`). Each source can fail independently. If Global is down, the last known list is kept in memory, and the page falls back to `/api/declaration/global.json`, a snapshot prerendered at each deploy. Our signatures are not in Global's count, so the page adds both. The list must match pauseai.info/statement exactly: every Global signatory is kept, untruncated, anonymous ones shown as « Anonyme » with country and message (like Global does); our own non-public signatories appear as « Anonyme · France », so the list total equals the counter. Live check: `node scripts/verifier-declaration.mjs [site]` (tests: `tests/declarationMatch.test.ts`).
- `/fr|en/declaration/confirmer` and `/api/declaration/global.json` are listed in `prerender.entries` (nothing links to them): removing them breaks the build.
- Optional comment (« pourquoi c'est important pour vous », 500 chars): stored as a CiviCRM activity « Déclaration PauseAI : commentaire », `Scheduled` until the email is confirmed (activity id carried in the token), then `Completed`. Only confirmed comments of publicly listed signatories are shown. Moderation: edit or delete the activity. A failure to store the comment never blocks the signature.
- Signing latency: contact + email are created in one chained API4 call, and the independent reads run in parallel.
- Page uses the charter components (`PageHero`, `Card`, `SectionTitle`, `FilterChips`, `Button`). Country filter: the most represented countries as chips (`src/lib/countries.ts` maps Global's free-text English names to ISO codes, labels via `Intl.DisplayNames`); any other country is found through the search box. Tests: `tests/declaration.test.ts`, `tests/mailer.test.ts`, `tests/countries.test.ts`.

#### Wise Webhook Integration (`/api/wise-webhook`)

Receives Wise balance credit notifications to automatically confirm bank transfer donations.

**Flow:**

1. Donor submits the donation form (`/api/don-virement`) → CiviCRM contribution created as **Pending** with `trxn_id = DON-XXXXXX`
2. Donor sends bank transfer with reference `DON-XXXXXX` in the payment description
3. Wise receives the transfer → sends a `balances#update` webhook to `https://pauseia.fr/api/wise-webhook`
4. Webhook finds the Pending contribution in CiviCRM by `trxn_id` and marks it **Completed**

**Signature Verification:**
Each request is signed by Wise using RSA-SHA256. The signature is in the `X-Signature-SHA256` header. Wise's production public key is hardcoded in the endpoint. If Wise rotates their key, update `WISE_PUBLIC_KEY` in `src/routes/api/wise-webhook/+server.ts`.

**Reference Field:**
The payment reference (`DON-XXXXXX`) is read from `data.transfer_reference` in the webhook payload. Note: for SEPA incoming transfers, verify this field actually carries the remittance information by checking the Netlify function logs after the first real donation.

**Setup (one-time):**
Run `scripts/create-wise-webhook.sh <profile_id>` on the Hetzner server to register the webhook subscription with Wise. This endpoint does **not** require SCA — it bypasses the SCA issue with the old polling approach.

**No new environment variables required** — uses existing CiviCRM credentials.

### Custom Markdown Processing

#### French Typography Plugin (`src/lib/typographyPlugin.js`)

Applies French typography rules automatically to all Markdown text.

**Rules Applied:**

- Thin non-breaking space (`\u202F`) before: `;`, `?`, `!`, `%`, units (m, kg, Hz, etc.), currency symbols
- Regular non-breaking space (`\u00A0`) before: `:`
- French quotes with spaces: `« text »` (converts English quotes)

**Build-time Features:**

- Exports both a remark plugin (`remarkFrenchTypography`) and Vite plugin (`viteTypographyPlugin`)
- During builds, tracks all changes and generates visual diff HTML at `build/logs/typography-diff.html`
- Uses diff2html for side-by-side comparison

**Testing:** `tests/typographyPlugin.test.js`

#### Wait But Why Plugins (`src/lib/rehypeWBWPlugins.js`)

Special formatting for Wait But Why-style content:

**Popup System:**

- Blue popups: `((1))` in text triggers popup, `(1): content` defines content
- Gray popups: `{(1)}` in text triggers popup, `{1}: content` defines content
- Multiline content: `(1):@(` ... `)` or `{1}:@(` ... `)`
- Injects content into `window.popupContent.blue` or `window.popupContent.gray` maps

**Color Box System:**

- Blue boxes: `bluebox-start` ... `colorbox-end`
- Blue boxes (variant 2): `bluebox2-start` ... `colorbox-end`
- Gray boxes: `graybox-start` ... `colorbox-end`
- Supports nesting with depth tracking

**Layout:** Special layout at `src/lib/layouts/waitbutwhy.svelte` can be applied via frontmatter

#### FAQ Accordion Plugin (`src/lib/faqPlugin.js`)

Transforms `faq.md` files into accordion UI:

- Detects files named `faq.md`
- Converts `h3` headings → accordion titles
- Groups following content → accordion details
- Uses `<Accordion>` component with Svelte fragment slots

### Type System

Core types defined in `src/lib/types.ts`:

```typescript
interface Post {
	title: string
	slug: string // Path in URL from root
	description: string // Meta description for SEO
	date: string // YYYY-MM-DD format
	categories: Categories[]
}

interface Person {
	id: string
	name: string
	image: string // URL to image file
	bio: string
	title?: string
	privacy?: boolean // Hide from /people page
}

interface Team {
	id: string
	name: string
	description: string
	leadName: string
	leadEmail: string
}
```

### Component Organization

**Layout Components:**

- `src/lib/layouts/mdsvex.svelte` - Default layout for markdown content
- `src/lib/layouts/waitbutwhy.svelte` - Special layout for Wait But Why-style posts
- `src/lib/components/Header.svelte` - Site header
- `src/lib/components/Footer.svelte` - Site footer

**Home Page Components:**

- `src/lib/components/home/hero.svelte` - Hero section
- `src/lib/components/home/lead.svelte` - Lead section
- `src/lib/components/home/articles.svelte` - Articles display
- `src/lib/components/home/risks.svelte` - Risks section
- `src/lib/components/home/videos.svelte` - Video embeds
- `src/lib/components/home/faq.svelte` - FAQ section
- `src/lib/components/home/newsletter.svelte` - Newsletter signup
- `src/lib/components/home/who.svelte` - Team section
- `src/lib/components/home/inserts.svelte` - Insert cards

**Reusable UI Components:**

- `src/lib/components/Accordion.svelte` - Accordion for FAQ
- `src/lib/components/ArticleCard.svelte` - Article preview card
- `src/lib/components/Banner.svelte` - Banner component
- `src/lib/components/Button.svelte` - Button component
- `src/lib/components/Callout.svelte` - Callout/highlight box
- `src/lib/components/Logo.svelte` - Site logo
- `src/lib/components/Mark.svelte` - Highlighted text
- `src/lib/components/Navlink.svelte` - Navigation link
- `src/lib/components/PdfViewer.svelte` - PDF viewer
- `src/lib/components/PostMeta.svelte` - Post metadata display
- `src/lib/components/Socials.svelte` - Social media links
- `src/lib/components/TabList.svelte` - Tab navigation
- `src/lib/components/UnderlinedTitle.svelte` - Styled title
- `src/lib/components/WhoCard.svelte` - Team member card
- `src/lib/components/YouTubeEmbed.svelte` - YouTube video embed

**Custom Markdown Components:**

- `src/lib/components/custom/a.svelte` - Enhanced anchor tag
- `src/lib/components/custom/img.svelte` - Enhanced image tag
- `src/lib/components/custom/index.ts` - Exports for markdown use

**Icon Components:**

- `src/lib/components/icons/` - Social media icons (facebook, x, youtube, instagram, linkedin, discord, tiktok, substack, threads)
- `src/lib/components/icons/move-left.svelte` - Previous arrow
- `src/lib/components/icons/move-right.svelte` - Next arrow

**Hero Components:**

- `src/lib/components/hero/LeftCorner.svelte` - Hero left corner decoration
- `src/lib/components/hero/RightCorner.svelte` - Hero right corner decoration

### Utilities

**Routes Utility (`src/lib/routes.ts`):**

- `getStaticRoutes()` - Enumerates public static routes for sitemap generation
- Excludes API endpoints, dynamic routes, and non-page files
- Uses `import.meta.glob` to discover all `+page.svelte` files

**API Utility (`src/lib/api.ts`):**

- `getPosts(subpath)` - Fetches posts from `src/posts/` directory
- Uses `import.meta.glob` with eager loading
- Extracts metadata from frontmatter
- Sorts by date (newest first)
- Can filter by subpath (e.g., `/dangers`)

### Configuration & Aliases

**Path Aliases (defined in `svelte.config.js`):**

- `$assets` → `./src/assets`
- `$posts` → `./src/posts`
- `$components` → `./src/lib/components`
- `$config` → `./src/lib/config.ts`
- `$routes` → `./src/routes`

**Site Config (`src/lib/config.ts`):**

```typescript
export const title = 'Pause IA'
export const description = 'Nous devons, de toute urgence, mettre en pause...'
export const url = dev ? 'http://localhost:37572' : 'https://pauseia.fr'
export const botName = 'RogueGPT'
```

**MDSvex Config (`svelte.config.js`):**

- Extensions: `.md`
- Syntax highlighting: Shiki with 'poimandres' theme
- Remark plugins: `remarkUnwrapImages`, `remarkToc`, `remarkFrenchTypography`
- Rehype plugins: `rehypeWBWColorBoxes`, `rehypeWBWPopups2`, `rehypeSlug`, `faqPlugin`
- Layouts:
  - Default: `./src/lib/layouts/mdsvex.svelte`
  - Wait But Why: `./src/lib/layouts/waitbutwhy.svelte`

**Vite Config (`vite.config.ts`):**

- Development server port: 37572
- Plugins: `enhancedImages`, `sveltekit`, `viteTypographyPlugin`
- Test config with Vitest

### Pre-commit Hooks

Husky runs before each commit (`.husky/pre-commit`):

1. `pnpm lint-staged` - Formats staged files with Prettier (config: `.lintstagedrc.json`)
2. `bash translation-info.sh && git add TRANSLATIONS.md` - Updates translation tracking

### Important Development Notes

**Type Checking:**
VSCode's ESLint TypeScript plugin may show false positives due to a [known issue](https://github.com/sveltejs/eslint-plugin-svelte/issues/413). Always use `pnpm check` for accurate type checking.

**Adding New Dangers Articles:**

1. Create markdown in `src/posts/dangers/{slug}.md`
2. Update `PAGE_ORDER` array in `src/routes/dangers/+layout.ts`

**Translation Tracking:**
When translating articles, add `original` block to frontmatter:

```yaml
---
title: Article Title
original:
  title: Original Title
  url: https://source.com/original
---
```

The pre-commit hook will automatically update `TRANSLATIONS.md`.

**Environment Variables:**
Copy `template.env` to `.env` and configure:

- CiviCRM credentials for subscription API
- `PUBLIC_UNDER_CONSTRUCTION` - Set to 'true' to disable prerendering

### Deployment

- Platform: Netlify
- Build command: `pnpm build`
- Adapter: `@sveltejs/adapter-netlify` (edge: false)
- Redirects: Managed in `static/_redirects`
- Prerendering: Enabled by default (all routes) unless `PUBLIC_UNDER_CONSTRUCTION=true`

## Important Files Reference

- `svelte.config.js` - SvelteKit config, mdsvex setup, remark/rehype plugins
- `vite.config.ts` - Vite config, dev server port, test setup
- `src/lib/api.ts` - Content fetching logic with `getPosts()`
- `src/lib/types.ts` - TypeScript type definitions
- `src/lib/config.ts` - Site configuration constants
- `src/lib/routes.ts` - Static route enumeration for sitemaps
- `src/lib/typographyPlugin.js` - French typography transformation (remark + Vite plugin)
- `src/lib/faqPlugin.js` - FAQ accordion transformation
- `src/lib/rehypeWBWPlugins.js` - Wait But Why popup and box plugins
- `src/routes/dangers/+layout.ts` - Page ordering for Dangers section
- `src/routes/api/subscribe/+server.ts` - CiviCRM newsletter subscription
- `translation-info.sh` - Script to track translated content
- `tests/typographyPlugin.test.js` - Tests for typography rules
