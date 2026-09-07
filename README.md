# PAIMANA — AI-Powered Infrastructure Delay Prediction Platform

> Smart India Hackathon (SIH) 2026 Submission

PAIMANA uses machine learning to predict delays in Indian government infrastructure projects, enabling proactive decision-making across Roads, Railways, Power, Water, Urban Development, and Telecommunications sectors.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Material-UI v5 |
| State/Data | TanStack React Query v4, React Router v6 |
| Charts | Recharts, react-simple-maps (India heatmap) |
| Backend | Node.js, Express.js, TypeScript |
| File Upload | Multer |
| Deployment | Docker, Render, Heroku |

## Project Structure

```
paimana/
├── src/                    # React frontend
│   ├── api/                # API clients with mock fallback
│   ├── components/         # Reusable UI components
│   │   ├── common/         # ErrorAlert, LoadingSpinner, etc.
│   │   ├── dashboard/      # KPIs, charts, heatmap, alerts feed
│   │   └── project/        # Project detail components
│   ├── context/            # Auth context
│   ├── hooks/              # React Query hooks
│   ├── layouts/            # DashboardLayout
│   ├── pages/              # Route pages
│   ├── theme/              # MUI theme
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Constants, formatters
├── backend/                # Express API server
│   └── src/
│       ├── data/           # In-memory database
│       └── routes/         # REST API endpoints
├── public/                 # Static assets
├── Dockerfile              # Multi-stage production build
├── render.yaml             # Render deployment config
└── Procfile                # Heroku deployment
```

## Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### Development

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm install --prefix backend

# Start frontend dev server (port 3000)
npm run dev:frontend

# Start backend dev server (port 8000) — in another terminal
npm run dev:backend
```

Visit `http://localhost:3000`. The Vite dev server proxies `/api` requests to the backend.

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server (serves frontend + API on port 8000)
npm start
```

Visit `http://localhost:8000`.

### Docker

```bash
docker build -t paimana .
docker run -p 8000:8000 paimana
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Authenticate user |
| GET | `/api/v1/projects` | List projects (paginated, filterable) |
| GET | `/api/v1/projects/by-state` | Projects aggregated by state |
| GET | `/api/v1/projects/:id` | Single project detail |
| GET | `/api/v1/predictions/portfolio-summary` | Dashboard summary |
| GET | `/api/v1/predictions/:projectId` | ML delay prediction |
| GET | `/api/v1/predictions/:projectId/trend` | Prediction trend history |
| GET | `/api/v1/sectors` | All sectors |
| GET | `/api/v1/sectors/:id` | Single sector |
| GET | `/api/v1/alerts` | List alerts |
| GET | `/api/v1/alerts/unread-count` | Unread alert count |
| PATCH | `/api/v1/alerts/:id/read` | Mark alert as read |
| PATCH | `/api/v1/alerts/read-all` | Mark all alerts as read |
| POST | `/api/v1/upload/cuf` | Upload CUF data file |

## Deployment

### Render
Connect your GitHub repo. Render auto-detects `render.yaml`.

### Heroku
```bash
heroku create paimana
git push heroku main
```

### Railway
Connect GitHub repo. Set build command `npm run build` and start command `npm start`.

## Core Screens

1. **Login** — Authentication with demo mode
2. **Dashboard** — KPI cards, India heatmap, sector charts, delay distribution, alerts feed
3. **Projects** — Filterable, paginated data grid
4. **Project Detail** — Timeline, ML prediction card, feature importance, risk trend
5. **Sectors** — Sector overview cards
6. **Alerts** — Severity-filtered alert management
7. **Upload** — Drag-and-drop CUF file upload with progress

## License

MIT
