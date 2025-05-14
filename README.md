# PauseIA.fr Website

This repository contains the source code for the [PauseIA.fr](https://pauseia.fr/) website, built with SvelteKit. It serves as the online platform for Pause IA in France, providing information, articles, and resources related to AI safety and advocacy.

## Key Features

- **SvelteKit Framework**: Modern, fast, and flexible web development with Svelte.
- **Markdown-based Content**: Articles and pages are written in Markdown, processed by `mdsvex`.
- **Internationalization Support**: Manages translations with clear attribution via `TRANSLATIONS.md` and an automated script (`translation-info.sh`).
- **Client-Side Search (Pagefind)**: The build process includes Pagefind to generate a client-side search index. _Note: A search bar interface for this functionality is not currently implemented on the live website._
- **Custom Typography**: Implements French typography rules using a custom `remark` plugin.
- **Custom Components**: Includes reusable Svelte components for UI elements and enhanced Markdown rendering.
- **CI/CD**: Continuous deployment to Netlify.
- **Development Tools**: Integrated linting (ESLint), formatting (Prettier), and pre-commit hooks (Husky, lint-staged).

## Project Structure

Here's an overview of the main directories and files:

```
.
├── .github/                  # GitHub Actions workflows, CODEOWNERS, funding info
│   ├── workflows/
│   │   └── check-and-build.yml # CI workflow for checking and building the project
│   ├── CODEOWNERS            # Defines code ownership for review processes
│   └── FUNDING.yml           # Funding links for the project
├── .husky/                   # Husky pre-commit hooks
│   └── pre-commit            # Script run before commits (linting, translation updates)
├── src/                      # Main application source code
│   ├── lib/                  # Core SvelteKit library code
│   │   ├── components/       # Reusable Svelte components
│   │   │   ├── custom/       # Custom components for Markdown (e.g., <a>, <img>)
│   │   │   ├── hero/         # Components for the homepage hero section
│   │   │   ├── home/         # Components specific to the homepage layout
│   │   │   └── icons/        # SVG icon components
│   │   ├── api.ts            # Logic for fetching and processing posts
│   │   ├── config.ts         # Site-wide configuration (title, URL, etc.)
│   │   ├── faqPlugin.js      # Custom mdsvex plugin for FAQ accordion functionality
│   │   ├── types.ts          # TypeScript type definitions for the project
│   │   └── typographyPlugin.js # Custom remark plugin for French typography rules
│   ├── posts/                # Markdown content for articles and general pages
│   │   └── dangers/          # Specific section for "Dangers of AI" articles
│   ├── routes/               # SvelteKit directory-based routing
│   │   ├── [slug]/           # Dynamic routes for general posts
│   │   ├── api/              # API endpoints (e.g., for fetching posts, dangers)
│   │   ├── dangers/          # Routes and layout specific to the "Dangers" section
│   │   │   └── [slug]/       # Dynamic routes for individual "Dangers" articles
│   │   └── ...               # Other page routes (e.g., home, qui-sommes-nous)
│   ├── app.css               # Global CSS styles
│   ├── app.d.ts              # TypeScript ambient declarations for SvelteKit
│   ├── app.html              # Main HTML template
│   ├── hooks.server.ts       # SvelteKit server hooks
│   └── mdsvex.svelte         # Default layout for mdsvex-processed Markdown content
├── static/                   # Static assets (images, redirects, Pagefind index)
│   ├── _redirects            # Netlify redirect rules
│   └── logo.svg              # Site logo
├── tests/                    # Unit and integration tests
│   └── typographyPlugin.test.js # Tests for the custom typography plugin
├── .eslintignore             # Files/directories to ignore for ESLint
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Files/directories to ignore for Git
├── .lintstagedrc.json        # lint-staged configuration (run on staged files)
├── .npmrc                    # PNPM configuration (e.g., engine-strict)
├── .nvmrc                    # Specifies the Node.js version for the project
├── .prettierignore           # Files/directories to ignore for Prettier
├── .prettierrc               # Prettier configuration
├── create-pagefind-index.js  # Script to generate the Pagefind search index
├── LICENSE                   # Project license (CC-BY 4.0)
├── package.json              # Project dependencies, scripts, and metadata
├── README.md                 # This file
├── svelte.config.js          # SvelteKit configuration (adapters, preprocessors, aliases)
├── template.env              # Template for environment variables
├── translation-info.sh       # Script to update TRANSLATIONS.md
├── TRANSLATIONS.md           # Lists translated articles and their originals
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration (dev server, plugins)
```

## Getting Started

### Running locally (Linux)

1. [install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script).
2. [install pnpm with corepack](https://pnpm.io/installation#using-corepack).
3. Run:

```sh
# Clone the repository if you haven't already
git clone git@github.com:moiri-gamboni/pauseai-france.git
cd pauseai-france

# Install and use the correct Node.js version specified in .nvmrc
nvm install

# Copy the environment variables template. Create a .env file and set variables if needed.
# (This step is optional if default environment variables are sufficient for local development)
cp template.env .env

# Install project dependencies using pnpm
pnpm install

# Start the development server
pnpm run dev

# Open http://localhost:37572 in your browser to view the site
```

**Note on Type Safety in VSCode:**
While SvelteKit implements "[Zero-effort type safety](https://svelte.dev/blog/zero-config-type-safety)", the `eslint-typescript` plugin might show type inference errors in VSCode due to an [unresolved issue](https://github.com/sveltejs/eslint-plugin-svelte/issues/413). When in doubt, run `pnpm check`, which uses SvelteKit's more accurate type checking.

## Content Management

### Creating Articles

Articles and most site pages are written in Markdown.

1.  **Create a new Markdown file**: Place your new `.md` file in the appropriate subdirectory within `src/posts/`.

    - General articles: `src/posts/`
    - Articles for the "Dangers" section: `src/posts/dangers/`
    - Direct link to create a new post: [Create a new markdown file in `src/posts/`](https://github.com/moiri-gamboni/pauseai-france/new/main/src/posts)

2.  **Add Frontmatter**: Include frontmatter at the top of your Markdown file. This metadata is crucial for SEO and site organization.

    ```yaml
    ---
    title: This will be shown as title in the browser / share previews / google results
    description: This will be the description in the share previews / google results
    date: '2023-4-14' # Format: YYYY-M-D or YYYY-MM-DD
    # Optional: For translated articles, include original source information
    original:
      title: Original Title of The Article
      url: https://link.to/original/article.md
    ---
    Here goes the content of the article.
    You can use standard Markdown syntax.
    ```

3.  **Commit and Push**: Create a fork or a new branch, commit your changes, and open a pull request against the `main` branch.

The article will be published automatically when the pull request is merged.

### "Dangers" Section

Articles under `src/posts/dangers/` have a special layout and navigation:

- **Layout**: `src/routes/dangers/+layout.svelte` provides a sidebar navigation listing all articles in the "Dangers" section and top navigation for previous/next articles.
- **Ordering**: The order of articles in this section is defined in `src/routes/dangers/+layout.ts`. If you add a new "Dangers" article, update the `PAGE_ORDER` array in this file.
- **Routing**: The base `/dangers` route (defined in `src/routes/dangers/+page.server.ts`) redirects to the first article in the defined order.

### Translations

If an article is a translation of content from another source (e.g., PauseAI Global):

1.  Include the `original` block in the frontmatter as shown above.
2.  The `translation-info.sh` script (run automatically as a pre-commit hook) will scan all Markdown files in `src/posts/`.
3.  If an `original` block is found, it will extract the `title`, `original.title`, and `original.url` and update the `TRANSLATIONS.md` file. This file serves as a central record of all translated content.

## Building the Site

- **Development Build**: `pnpm run build:dev`
- **Production Build**: `pnpm run build`

The build process includes:

1.  SvelteKit building the application.
2.  Running `node create-pagefind-index.js`: This script generates a client-side search index using Pagefind.
    - It indexes the content of the `build` directory.
    - The search index is written to `static/pagefind` and then copied to `build/pagefind`.
    - It also updates the Netlify edge functions manifest (`.netlify/edge-functions/manifest.json`) to exclude Pagefind paths from server-side rendering.
    - _Note: While the search index is generated, a user-facing search interface is not currently implemented on the website._

## Development Practices

### Linting and Formatting

- **ESLint**: Used for JavaScript and TypeScript linting. Configuration is in `.eslintrc.cjs`.
- **Prettier**: Used for code formatting. Configuration is in `.prettierrc`.
- **Check formatting**: `pnpm lint` (runs Prettier check and ESLint)
- **Apply formatting**: `pnpm format` (runs Prettier write)

### Pre-commit Hooks

This project uses Husky and lint-staged for pre-commit hooks, configured in `.husky/pre-commit` and `.lintstagedrc.json`.
Before each commit, the following actions are performed:

1.  `pnpm lint-staged`: Runs Prettier to format staged files.
2.  `bash translation-info.sh && git add TRANSLATIONS.md`: Updates the `TRANSLATIONS.md` file based on article frontmatter and stages the changes.

### Testing

- **Run tests**: `pnpm test` (runs Vitest tests once)
- **Run all checks**: `pnpm check` (runs Vitest, SvelteKit sync, and Svelte-check)
- **Watch mode for checks**: `pnpm check:watch` (runs checks in watch mode)
- Test files are located in the `tests/` directory (e.g., `typographyPlugin.test.js`).

## Key Technologies & Customizations

- **SvelteKit**: The core framework. See `svelte.config.js`.
- **mdsvex**: A Markdown preprocessor for Svelte. Allows using Svelte components within Markdown files. Configuration is in `svelte.config.js`.
  - **Custom Layout**: `src/mdsvex.svelte` is the default layout for Markdown content.
  - **Syntax Highlighting**: Uses `shiki` with the 'poimandres' theme.
  - **Remark Plugins**:
    - `remark-unwrap-images`: Removes wrapping `<p>` tags from images.
    - `remark-toc`: Generates a table of contents.
    - `remarkFrenchTypography`: Custom plugin (`src/lib/typographyPlugin.js`) that applies French typography rules (e.g., non-breaking spaces before certain punctuation). Tested in `tests/typographyPlugin.test.js`.
  - **Rehype Plugins**:
    - `rehype-slug`: Adds `id` attributes to headings.
    - `faqPlugin`: Custom plugin (`src/lib/faqPlugin.js`) that transforms FAQ Markdown (specifically `faq.md`) into an accordion structure using the `<Accordion>` component.
- **Pagefind**: Integrated into the build process (`create-pagefind-index.js`) to generate a search index. _A user interface for search is not currently active on the site._
- **Enhanced Images (`@sveltejs/enhanced-img`)**: SvelteKit utility for optimizing images. Used in components like `SupporterCard.svelte` and `hero.svelte`.
- **Vite Typography Plugin**: A custom Vite plugin (`src/lib/typographyPlugin.js` - `viteTypographyPlugin` export) that works with `remarkFrenchTypography` to generate a diff log of typography changes during build.

## Deployment

The website is continuously deployed to Netlify.

- The build command on Netlify is `pnpm build`.
- Deployment status can be tracked [here](https://app.netlify.com/sites/pauseai-france/deploys).
- Redirects are managed in `static/_redirects`.

## Attribution & License

- Translated content and their original sources are listed in `TRANSLATIONS.md`.
- The content of this repository is licensed under [CC-BY 4.0](/LICENSE). Please mention "Pause IA" when using content from this site.
