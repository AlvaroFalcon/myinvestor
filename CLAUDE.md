# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a technical challenge project for a Front-end Developer position. It consists of a REST API backend for fund management built with Express and TypeScript. The challenge requires building a React front-end to interact with this API.

**Challenge Context**: This is a 2-3 hour technical assessment (not meant to be completed fully). Focus on code quality and attention to detail over completeness.

## Development Commands

### Starting the API Server
```bash
yarn start
# or
npm run start
```

This starts two servers:
- Main API server: http://localhost:3000
- Swagger UI documentation: http://localhost:3001/api-docs

The server uses Node's `--watch` flag for automatic reloading during development.

### Code Quality
```bash
# Linting (if configured)
yarn eslint server/

# Format checking
yarn prettier --check .
```

## Architecture

### Backend Structure

```
server/
├── app.ts           # Main Express application with all routes
├── utils.ts         # Type guard utilities (isString, isNumber)
└── data/
    └── funds.ts     # Static fund data (80 funds) and Fund type definition
```

### API Design

The API follows a RESTful design with in-memory state management:

**Core Concept**: The `portfolio` array in `server/app.ts` maintains user holdings as `{id: string, quantity: number}[]`. This is the application's single source of state.

**Key Routes**:
- `GET /funds` - Paginated fund listing with sorting support
- `GET /funds/:id` - Individual fund details
- `POST /funds/:id/buy` - Purchase fund units (adds to portfolio)
- `POST /funds/:id/sell` - Sell fund units (removes from portfolio)
- `POST /funds/transfer` - Transfer units between funds
- `GET /portfolio` - Get current portfolio with fund details joined

**Sorting Mechanism**: The `/funds` endpoint accepts a `sort` query parameter in format `field:direction` (e.g., `name:asc`, `profitability.YTD:desc`). Valid fields include top-level Fund properties and nested profitability metrics.

**Middleware Pattern**: `fundRoute` middleware validates fund IDs and attaches the fund object to `req.fund` for downstream handlers.

### Data Model

**Fund Type** (`server/data/funds.ts`):
```typescript
{
  id: string
  name: string
  currency: 'USD' | 'EUR'
  symbol: string
  value: number  // Current price per unit
  category: 'GLOBAL' | 'TECH' | 'HEALTH' | 'MONEY_MARKET'
  profitability: {
    YTD: number
    oneYear: number
    threeYears: number
    fiveYears: number
  }
}
```

All funds are read-only (const assertion). The dataset contains 80 static funds spanning various categories.

## Front-end Requirements (To Be Implemented)

The challenge requires building React components for:

1. **Fund List Table** - Display all funds with pagination, sorting, and action buttons (buy)
2. **Buy Dialog** - Modal for purchasing funds (validation: max €10,000, no negatives)
3. **Portfolio View** - Display user's holdings with actions (sell, transfer)
4. **Sell Dialog** - Modal for selling funds (validation: cannot exceed holdings)
5. **Transfer Dialog** - Modal for transferring between funds (validation: cannot transfer to same fund)

**Bonus Features**: Responsive design, HTML `<dialog>` element, swipe actions on mobile, formatted currency inputs.

## TypeScript Configuration

- Uses `esnext` module system with ESM imports (note `.ts` extensions in imports)
- Strict mode enabled with additional strictness (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Configured for bundler module resolution with `allowImportingTsExtensions`
- `verbatimModuleSyntax` enabled (use `import type` for type-only imports)

## Code Style Conventions

**MANDATORY File Naming**: All files and directories must use kebab-case naming convention:
- ✅ Correct: `fund-list.tsx`, `portfolio-item.tsx`, `use-swipeable.ts`
- ❌ Incorrect: `FundList.tsx`, `PortfolioItem.tsx`, `useSwipeable.ts`

**MANDATORY API Validation**: Always use Zod schemas to validate API responses:
- Create Zod schemas for all API response types in `types.ts`
- Pass schemas to API client methods for runtime validation
- Use `z.infer<typeof schema>` to derive TypeScript types from schemas
- This ensures type safety at both compile-time and runtime

**Other Conventions**:
- Component names: PascalCase (e.g., `FundList`, `PortfolioItem`)
- Function names: camelCase (e.g., `loadFunds`, `handleBuyClick`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_PURCHASE_AMOUNT`)
- TypeScript strict mode: NO `any` types allowed
- No code comments except JSDoc where needed for complex functions

## API Integration Notes

**State Persistence**: The portfolio state is in-memory only. Restarting the server resets all purchases/sales.

**Error Handling**: The API returns standard HTTP error codes:
- 400: Invalid data (negative quantities, insufficient holdings, etc.)
- 404: Fund not found

**CORS**: Enabled for all origins to allow front-end development on different ports.

**Validation Logic**:
- Buy/sell quantities must be positive numbers
- Sell operations check if user has sufficient holdings
- Transfer operations validate both source and destination funds exist
- Transfer operations prevent same-fund transfers
