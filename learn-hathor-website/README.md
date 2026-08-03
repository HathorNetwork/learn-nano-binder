# Hathor Learning Hub

> [!IMPORTANT]
> **This site has been decommissioned (August 2026) and is no longer deployed.**
>
> `learn.hathor.network` and `staging.learn.hathor.network` no longer resolve. The
> S3 buckets, CloudFront distributions, ACM certificates and GitHub Actions OIDC
> roles described under [Deployment](#deployment) have all been deleted, along with
> the BinderHub backend on GCP that served the notebooks. **The deployment
> instructions below no longer work and are kept for historical reference only.**
>
> The application code still builds and runs locally, and the notebook content in
> the repository root is unaffected.
>
> See [HathorNetwork/ops-tools#1479](https://github.com/HathorNetwork/ops-tools/issues/1479)
> for the decommission record.

An interactive learning platform for Hathor Network featuring Jupyter notebooks powered by BinderHub.

## Overview

Hathor Learning Hub provides hands-on tutorials for learning blockchain development with Hathor Network. Users can launch interactive Jupyter notebooks directly in their browser without any local setup.

### Features

- **Interactive Notebooks**: Launch Jupyter notebooks with one click
- **Categorized Content**: Notebooks organized by topic (Nano Contracts, Architecture, Tokens, etc.)
- **Real-time Build Progress**: See BinderHub build status with expandable logs
- **Modern UI**: Clean, responsive design inspired by hathor.network
- **Zero Setup**: Everything runs in the cloud via BinderHub

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Vitest** - Testing
- **ESLint + Prettier** - Code quality

## Getting Started

### Prerequisites

- Node.js 24+
- npm
- AWS CLI (for deployment)

### Installation

```bash
cd learn-hathor-website
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run typecheck` | Type check with TypeScript |

## Adding Notebooks

Notebooks are configured in `src/config/notebooks.ts`.

### Adding a Notebook to an Existing Category

1. Open `src/config/notebooks.ts`
2. Find the appropriate category in the `categories` array
3. Add a new notebook entry:

```typescript
{
  id: 'unique-notebook-id',           // Unique identifier (kebab-case)
  name: 'Notebook Display Name',      // Title shown in the UI
  description: 'Description of what the notebook covers...',
  repo: 'HathorNetwork/learn-nano-binder',  // GitHub repo (owner/repo format)
  branch: 'main',                     // Git branch containing the notebook
  filepath: 'notebooks/path/to/notebook.ipynb',  // Path to .ipynb file
  difficulty: 'beginner',             // 'beginner' | 'intermediate' | 'advanced'
  duration: '15 min',                 // Optional: estimated completion time
}
```

### Creating a New Category

Add a new category object to the `categories` array:

```typescript
{
  id: 'category-id',
  name: 'Category Name',
  description: 'Category description',
  icon: 'code',  // 'code' | 'layers' | 'coins' | 'wallet'
  notebooks: [
    // Add notebooks here
  ],
}
```

### Available Icons

- `code` - For coding/development topics
- `layers` - For architecture concepts
- `coins` - For token-related content
- `wallet` - For wallet/transaction topics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BINDERHUB_URL` | BinderHub instance URL | undefined |

For local development, create a `.env.local` file:

```env
VITE_BINDERHUB_URL=http://localhost:8585
```

## Deployment

### Environments

| Environment | S3 Bucket | CloudFront ID | BinderHub URL |
|-------------|-----------|---------------|---------------|
| Staging | `learn-hathor-network-staging` | `EH3J6VVGDO86Q` | `https://binder.staging.learn.hathor.network` |
| Production | `learn-hathor-network-production` | `E2PZDB3T8EMYOC` | `https://binder.learn.hathor.network` |

### Manual Deployment from Local Machine

Ensure you have AWS CLI configured with appropriate credentials.

#### Using Make (recommended)

```bash
# Full deploy to staging (build + sync + cache invalidation)
make deploy site=staging

# Full deploy to production
make deploy site=production

# With a specific AWS profile
make deploy site=staging aws_profile=hathor-staging

# Individual steps
make build site=staging
make sync site=staging
make clear_cloudfront_cache site=staging
```

#### Using the deploy script directly

```bash
# Build for staging
./scripts/deploy.sh staging build

# Sync to S3
./scripts/deploy.sh staging sync

# Clear CloudFront cache
./scripts/deploy.sh staging clear_cache

# With AWS profile
./scripts/deploy.sh production sync my-aws-profile
```

### CI/CD Pipeline

The GitHub Actions workflows (`.github/workflows/learn-hathor-website*.yml`) run automatically:

**On Pull Requests to `main`:**
- **Lint & Test** - ESLint, Prettier, TypeScript checks, and Vitest with coverage

**On Push to `main`:**
- **Lint & Test** - Same as above
- **Deploy to Staging** - Builds and deploys to staging environment

**On Tags matching `learn-hathor-website@*` (e.g., `learn-hathor-website@1.2.3`):**
- **Lint & Test** - Same as above
- **Deploy to Production** - Builds and deploys to production environment

#### Creating a Production Release

```bash
# Tag a new version and push
git tag learn-hathor-website@1.0.0
git push origin learn-hathor-website@1.0.0
```

## Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage
npm run test:coverage
```

Tests are located next to the files they test (e.g., `Button.test.tsx`).

## Project Structure

```
learn-hathor-website/
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── CategoryAccordion.tsx
│   │   ├── NotebookCard.tsx
│   │   └── BuildModal.tsx
│   ├── config/
│   │   └── notebooks.ts          # Notebook configuration
│   ├── hooks/
│   │   └── useBinderBuild.ts     # BinderHub build hook
│   ├── lib/
│   │   └── binderhub.ts          # BinderHub API client
│   ├── types/
│   │   ├── notebook.ts
│   │   └── build.ts
│   ├── test/
│   │   ├── setup.ts
│   │   └── test-utils.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                       # Static assets
├── scripts/
│   └── deploy.sh                 # Deployment script
├── .github/workflows/
│   └── learn-hathor-website.yml  # CI/CD configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
└── Makefile
```

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          // ... more shades
        },
      },
    },
  },
};
```

### Typography

The project uses [Inter](https://fonts.google.com/specimen/Inter) font. Update the Google Fonts import in `index.html` to change fonts.

## Links

- [Hathor Network](https://hathor.network)
- [Hathor Documentation](https://docs.hathor.network)
- [GitHub](https://github.com/HathorNetwork)
