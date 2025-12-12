# Hathor Learning Hub

An interactive learning platform for Hathor Network featuring Jupyter notebooks powered by BinderHub.

## 🎯 Overview

Hathor Learning Hub provides hands-on tutorials for learning blockchain development with Hathor Network. Users can launch interactive Jupyter notebooks directly in their browser without any local setup.

### Features

- **Interactive Notebooks**: Launch Jupyter notebooks with one click
- **Categorized Content**: Notebooks organized by topic (Nano Contracts, Architecture, Tokens, etc.)
- **Real-time Build Progress**: See BinderHub build status with expandable logs
- **Modern UI**: Clean, responsive design inspired by hathor.network
- **Zero Setup**: Everything runs in the cloud via BinderHub

## �️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Vitest** - Testing
- **ESLint + Prettier** - Code quality

## 📁 Project Structure

```
binderhub-launcher/
├── public/                       # Static assets
│   ├── favicon.svg
│   └── hathor-logo.svg
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
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── .eslintrc.cjs
└── .prettierrc
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
cd binderhub-launcher
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

## 📝 Adding Notebooks

Edit `src/config/notebooks.ts` to add new notebooks:

```typescript
export const categories: Category[] = [
  {
    id: 'nano-contracts',
    name: 'Nano Contracts',
    description: 'Learn to build Python-powered smart contracts',
    icon: 'code',
    notebooks: [
      {
        id: 'unique-id',
        name: 'Notebook Title',
        description: 'Brief description of what users will learn.',
        repo: 'owner/repository',
        branch: 'main',
        filepath: 'path/to/notebook.ipynb',
        difficulty: 'beginner', // 'beginner' | 'intermediate' | 'advanced'
        duration: '15 min',     // optional
      },
    ],
  },
];
```

### Available Icons

- `code` - For coding/development topics
- `layers` - For architecture concepts
- `coins` - For token-related content
- `wallet` - For wallet/transaction topics

## 🔧 Configuration

### BinderHub URL

Update the BinderHub URL in `src/config/notebooks.ts`:

```typescript
export const BINDERHUB_URL = 'http://your-binderhub-instance';
```

### Environment Variables

For deployment, configure these in GitHub Actions:

| Variable | Description |
|----------|-------------|
| `AWS_ROLE_ARN` | IAM role ARN for OIDC authentication (secret) |
| `AWS_REGION` | AWS region (variable) |
| `S3_BUCKET_NAME` | S3 bucket name (variable) |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID (variable) |

## 🚢 Deployment

This project is configured for deployment to AWS S3 + CloudFront.

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/binderhub-launcher.yml`) runs:

1. **Lint** - ESLint, Prettier, TypeScript checks
2. **Test** - Vitest with coverage
3. **Build** - Production build with Vite
4. **Deploy** - Sync to S3 and invalidate CloudFront cache

Deployment happens automatically on pushes to `main` branch.

### Manual Deployment

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## 🧪 Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage
npm run test:coverage
```

Tests are located next to the files they test (e.g., `Button.test.tsx`).

## 🎨 Customization

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

## 📄 License

MIT License

## 🔗 Links

- [Hathor Network](https://hathor.network)
- [Hathor Documentation](https://docs.hathor.network)
- [GitHub](https://github.com/HathorNetwork)
