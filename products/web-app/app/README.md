# PaddleOCR Web App

Anonymous session-based document OCR and DOCX conversion service.

## Quick Start

### 1. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values.

### 2. Start Infrastructure

```bash
cd ..  # Go to products/web-app root
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- MinIO on port 9000 (console on 9001)

### 3. Database Migration

```bash
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database (dev)
# or npm run db:migrate for production migrations
```

### 4. Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Worker (Background Processing)

```bash
npm run worker
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run Vitest tests |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema directly (dev) |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run worker` | Start background worker |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│    PostgreSQL   │◀────│     Worker      │
│   (Frontend +   │     │    (Database)   │     │  (Background    │
│    API Routes)  │     │                 │     │   Processing)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│   Object Store  │                           │  PaddleOCR VL   │
│  (S3/MinIO)     │                           │     API         │
└─────────────────┘                           └─────────────────┘
```

## Documentation

- [Development Plan](../docs/DEVELOPMENT_PLAN.md)
- [Plan Context Index](../docs/plan-context/INDEX.md)
- [Technical Architecture](../docs/TECHNICAL_ARCHITECTURE.md)
- [Data Model](../docs/DATA_MODEL_AND_STATE_MACHINE.md)
- [API Integration](../docs/API_INTEGRATION.md)
- [Payment Flow](../docs/PAYMENT_FLOW.md)

## Mock Payment (Development)

When `PAYMENT_PROVIDER=mock`, payments are simulated:

1. Create order via `POST /api/wallet/orders`
2. Callback is automatically triggered
3. Balance is credited immediately

## MinIO Setup

1. Open http://localhost:9001
2. Login: `minioadmin` / `minioadmin`
3. Create bucket: `paddleocr-files`
4. Set bucket policy for CORS (see docs)

## Important Constraint

The application must stay fully API-only and must not depend on local
PaddleOCR model execution as its primary runtime path.

## License

Private - All rights reserved.
