# OpenRouter Cost Chart

A data-dense cost comparison dashboard for [OpenRouter](https://openrouter.ai) AI models. Built with Next.js, it fetches live pricing and benchmark data from the OpenRouter API and displays it in a sortable, filterable table with an efficiency scoring system.

## Features

- **Live Data** — Fetches model pricing, context lengths, and provider endpoints from the OpenRouter API
- **Efficiency Score** — Composite score weighing context-length-per-dollar (40%), coding index (30%), ELO (20%), and intelligence index (10%)
- **Sortable Columns** — Click any column header to sort by name, creator, pricing, context, efficiency, or benchmarks
- **Search & Filter** — Filter by text search, creator, provider, context window, efficiency range, modality, and toggle free/router models
- **Column Visibility** — Show or hide columns via the gear menu to customize your view
- **Model Detail Panel** — Click a row to open a side panel with full model information including per-endpoint pricing breakdowns
- **Dark Mode UI** — Minimal, data-first design with 1px borders and muted contrast

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm run start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Next.js 16** — App Router, server-side data fetching with ISR (30-minute revalidation)
- **React 19** — Client-side state management and rendering
- **TypeScript** — Full type safety across components and data models
- **Tailwind CSS 4** — Utility-first styling
- **Recharts** — Chart rendering (available for future visualizations)
- **Lucide React** — Icons

## Project Structure

```
app/
  page.tsx              # Main dashboard page
  layout.tsx            # Root layout with fonts
  globals.css           # Global styles
components/
  ModelTable.tsx        # Sortable data table
  SearchFilters.tsx     # Filter/search controls
  ModelDetail.tsx       # Side panel with model details
  ColumnsToggle.tsx     # Column visibility dropdown
lib/
  types.ts              # TypeScript types and column definitions
  openrouter.ts         # API fetching, sorting, filtering, scoring
```

## Efficiency Score

The efficiency score ranks models by value. It is a weighted sum of four normalized components:

| Component | Weight | Source |
|-----------|--------|--------|
| Context-length-per-dollar | 40% | Computed from context length and average pricing |
| Coding Index | 30% | Artificial Analysis benchmark |
| ELO Score | 20% | Design Arena average ELO |
| Intelligence Index | 10% | Artificial Analysis benchmark |

Weights are configurable in `lib/openrouter.ts` via the `EFFICIENCY_CONFIG` object.
