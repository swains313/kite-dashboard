# Kite Dashboard

Real-time Algorithmic Trading Visualizer and Human-in-the-Loop Cockpit built with **Next.js 15+ (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

## Architectural Responsibilities

- **Live Market Visualization:** HTML5 financial charts rendering real-time candlestick bars and rolling indicators.
- **Position & P&L Monitoring:** Instant WebSocket tick stream displaying open positions, realized/unrealized P&L, and margin health.
- **AI Thesis Explanations:** Real-time display of Gemini AI reasoning logs for approved setups.
- **Microservice Health Center:** Real-time diagnostics for `kite-core-engine` and `kite-ml-service`.

## Modular Architecture

```
src/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts          # Route Handler
│   ├── layout.tsx                # Dark Financial Theme Layout
│   ├── page.tsx                  # Real-Time Monitoring Cockpit
│   └── globals.css
├── modules/
│   └── health/
│       ├── health.controller.ts  # Health Controller
│       ├── health.service.ts     # Health Service & Microservice Prober
│       └── health.model.ts       # TypeScript Interfaces & Models
└── components/
    └── ServiceCard.tsx           # Status Card Component
```

## Getting Started

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default | Required for Health Check |
| --- | --- | --- | --- |
| `CLIENT_PORT` / `PORT` | Local dashboard port | `3000` | No |
| `NEXT_PUBLIC_API_URL` | Base URL of `kite-core-engine` | `http://localhost:8000` | No |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL of `kite-core-engine` | `ws://localhost:8000/ws` | No |
| `NEXT_PUBLIC_ML_URL` | Base URL of `kite-ml-service` | `http://localhost:8001` | No |

### Development Mode
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### Health Check Endpoints
- Basic health:
  ```bash
  curl http://localhost:3000/api/health
  ```
- Full multi-service topology probe:
  ```bash
  curl http://localhost:3000/api/health?overview=true
  ```
