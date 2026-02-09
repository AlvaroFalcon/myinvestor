# Implementation Plan: MyInvestor Front-End Challenge

## Context

This is a technical assessment for a Front-end Developer position. The backend REST API is complete and running, but **no front-end exists**. The challenge requires building a React application from scratch to manage investment funds with buy/sell/transfer operations.

**User Requirements:**
- Implement **ALL bonus features** from README.md (not skipping any)
- Use **TailwindCSS** for styling
- Use **React Hook Form** for form handling
- Use **Zod** for validation schemas
- **TypeScript strict mode - NO `any` types**
- **Critical constraint: NO code comments except JSDoc where needed**

**Time Estimate:** 5-6 hours (implementing all core features + all bonuses)

**Current State:**
- Backend API running on http://localhost:3000 (80 funds available)
- Swagger docs on http://localhost:3001/api-docs
- Design mockups in `/public` folder
- No front-end dependencies installed
- TypeScript configured with JSX support

## Recommended Approach

### Tech Stack

**Vite + React + TypeScript**
- Fastest dev setup for time-constrained challenge
- Instant HMR, minimal configuration needed
- Native TypeScript support

**TailwindCSS**
- Utility-first CSS for rapid development
- Built-in responsive design utilities
- Consistent design tokens out of the box
- Easy to match design mockups with utilities

**React Hook Form + Zod**
- Modern form handling with minimal re-renders
- Type-safe validation matching API rules
- Reusable validation schemas

**React Context API**
- Sufficient for single portfolio state
- No external state library needed
- Built-in, no learning curve for evaluators

**Native `<dialog>` Element**
- HTML standard, bonus points for using it
- No modal library needed
- Backdrop and ESC key handling built-in

## Project Structure

```
myinvestor-client/                    (new directory)
├── src/
│   ├── api/
│   │   ├── client.ts                 # Base fetch wrapper
│   │   ├── funds.ts                  # Fund API calls
│   │   ├── portfolio.ts              # Portfolio API calls
│   │   ├── orders.ts                 # Orders API (for history)
│   │   └── types.ts                  # TypeScript interfaces matching backend
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx            # Reusable button
│   │   │   ├── Dialog.tsx            # Native dialog wrapper
│   │   │   ├── CurrencyInput.tsx     # Formatted currency input (10,55 €)
│   │   │   ├── Dropdown.tsx          # Actions menu (3-dot)
│   │   │   ├── Pagination.tsx        # Page navigation
│   │   │   └── SwipeableItem.tsx     # Swipeable list item for mobile
│   │   ├── funds/
│   │   │   ├── FundList.tsx          # Table with pagination/sorting
│   │   │   ├── FundListTable.tsx     # Desktop table layout
│   │   │   ├── FundListRow.tsx       # Individual fund row
│   │   │   └── BuyDialog.tsx         # Buy fund dialog
│   │   └── portfolio/
│   │       ├── Portfolio.tsx         # Portfolio view with 3 tabs
│   │       ├── PortfolioList.tsx     # Grouped holdings list
│   │       ├── PortfolioItem.tsx     # Individual holding (with swipe)
│   │       ├── OrderHistory.tsx      # Order history tab content
│   │       ├── SellDialog.tsx        # Sell fund dialog
│   │       └── TransferDialog.tsx    # Transfer between funds
│   ├── context/
│   │   ├── PortfolioContext.tsx      # Global portfolio state
│   │   └── OrdersContext.tsx         # Order history state
│   ├── hooks/
│   │   ├── useFunds.ts               # Fetch funds with caching
│   │   ├── usePortfolio.ts           # Portfolio operations
│   │   ├── useOrders.ts              # Order history operations
│   │   ├── usePagination.ts          # Pagination logic
│   │   ├── useSort.ts                # Sorting state
│   │   └── useSwipeable.ts           # Swipe gesture detection
│   ├── utils/
│   │   ├── formatters.ts             # Currency, percentage formatters
│   │   ├── validators.ts             # Zod schemas (buy/sell/transfer)
│   │   └── constants.ts              # API URL, max values (€10k)
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # Entry point
│   └── vite-env.d.ts
├── index.html
├── tailwind.config.js                # Tailwind configuration
├── postcss.config.js                 # PostCSS for Tailwind
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Implementation Order (Small Milestones)

**Note:** After each milestone, review the changes and commit before proceeding to the next.

### Milestone 1: Project Setup (15 mins)
- Initialize Vite project with React + TypeScript
- Install all dependencies (React Hook Form, Zod, Tailwind)
- Configure Tailwind CSS with basic setup
- Verify dev server runs successfully
- **Commit:** "chore: initialize project with Vite, React, TypeScript, and Tailwind"

### Milestone 2: API Foundation (20 mins)
- Create TypeScript interfaces for Fund, Portfolio, Orders in `src/api/types.ts`
- Create base API client with fetch wrapper in `src/api/client.ts`
- Add error handling for API responses
- **Commit:** "feat: add API client and TypeScript types"

### Milestone 3: Basic App Structure (15 mins)
- Setup App.tsx with basic routing (tabs for Funds/Portfolio)
- Add navigation between Fund List and Portfolio views
- Style navigation tabs with Tailwind
- **Commit:** "feat: add basic app structure with navigation"

### Milestone 4: Fund List - Basic Table (25 mins)
- Create FundList component with table layout
- Fetch and display funds from API (GET /funds)
- Show basic columns: Name, Symbol, Value, Currency
- Style table with Tailwind matching mockup
- **Commit:** "feat: add fund list with basic table"

### Milestone 5: Fund List - Pagination (20 mins)
- Add Pagination component
- Implement page navigation (prev/next, page numbers)
- Handle API pagination parameters
- **Commit:** "feat: add pagination to fund list"

### Milestone 6: Fund List - Sorting (20 mins)
- Add sortable column headers
- Implement asc/desc toggle on click
- Update API call with sort parameter
- Visual indicator for sort direction
- **Commit:** "feat: add column sorting to fund list"

### Milestone 7: Fund List - Responsive (20 mins)
- Add mobile card layout for small screens
- Implement responsive breakpoints with Tailwind
- Ensure table → cards transition works smoothly
- **Commit:** "feat: add responsive design to fund list"

### Milestone 8: Common Components - Dialog (15 mins)
- Create Dialog component wrapper around native `<dialog>`
- Add open/close functionality
- Style with Tailwind (backdrop, positioning)
- **Commit:** "feat: add reusable Dialog component"

### Milestone 9: Common Components - CurrencyInput (20 mins)
- Create CurrencyInput component with Spanish formatting
- Implement value formatting (10,55 €)
- Handle input parsing and validation
- **Commit:** "feat: add CurrencyInput component with Euro formatting"

### Milestone 10: Buy Dialog - Basic Form (20 mins)
- Create BuyDialog component with React Hook Form
- Add quantity input field
- Implement dialog open/close from FundList
- **Commit:** "feat: add basic buy dialog"

### Milestone 11: Buy Dialog - Validation (20 mins)
- Add Zod schema with validations (max 10k, no negatives)
- Display validation error messages
- Test validation rules
- **Commit:** "feat: add validation to buy dialog"

### Milestone 12: Buy Dialog - API Integration (20 mins)
- Implement POST /funds/:id/buy on form submit
- Handle success/error responses
- Close dialog on success
- **Commit:** "feat: integrate buy dialog with API"

### Milestone 13: Portfolio Context (20 mins)
- Create PortfolioContext with state management
- Implement refreshPortfolio function
- Add provider to App
- **Commit:** "feat: add portfolio context for state management"

### Milestone 14: Portfolio - Basic View (25 mins)
- Create Portfolio component with tab structure
- Fetch and display portfolio data
- Show basic holding information (fund name, quantity, value)
- **Commit:** "feat: add basic portfolio view"

### Milestone 15: Portfolio - Category Grouping (20 mins)
- Group holdings by fund category
- Add category headers
- Style grouped layout with Tailwind
- **Commit:** "feat: add category grouping to portfolio"

### Milestone 16: Portfolio - Alphabetical Sorting (15 mins)
- Sort holdings alphabetically within each category
- Implement sort function
- **Commit:** "feat: add alphabetical sorting to portfolio"

### Milestone 17: Portfolio - Desktop Actions (20 mins)
- Add dropdown menu component for actions
- Implement Vender/Traspasar action buttons
- Style dropdown with Tailwind
- **Commit:** "feat: add action dropdown to portfolio items"

### Milestone 18: Portfolio - Responsive Layout (20 mins)
- Add mobile-responsive layout for portfolio
- Adjust card design for small screens
- **Commit:** "feat: add responsive design to portfolio"

### Milestone 19: Portfolio - Swipe Gestures (30 mins)
- Create useSwipeable hook for touch detection
- Create SwipeableItem component
- Implement swipe left to reveal actions on mobile
- Add swipe right to hide actions
- **Commit:** "feat: add swipe gestures for mobile portfolio"

### Milestone 20: Sell Dialog - Basic Form (20 mins)
- Create SellDialog component with React Hook Form
- Reuse Dialog and CurrencyInput components
- Add quantity input field
- **Commit:** "feat: add basic sell dialog"

### Milestone 21: Sell Dialog - Validation & API (25 mins)
- Add Zod validation (max = holding, no negatives)
- Implement POST /funds/:id/sell
- Update portfolio after successful sale
- **Commit:** "feat: add sell functionality with validation"

### Milestone 22: Transfer Dialog - Basic Form (25 mins)
- Create TransferDialog component
- Add fund selector dropdown (destination)
- Add quantity input
- **Commit:** "feat: add basic transfer dialog"

### Milestone 23: Transfer Dialog - Validation & API (30 mins)
- Add Zod validation (same-fund prevention, max, negatives)
- Filter dropdown to show only portfolio holdings
- Implement POST /funds/transfer
- Update portfolio after successful transfer
- **Commit:** "feat: add transfer functionality with validation"

### Milestone 24: Order History - Context & Storage (25 mins)
- Create OrdersContext for order tracking
- Implement local storage persistence
- Define Order interface
- **Commit:** "feat: add order history context and storage"

### Milestone 25: Order History - UI (30 mins)
- Create OrderHistory component for "Órdenes" tab
- Display orders in table format
- Format dates and action types
- Style with Tailwind
- **Commit:** "feat: add order history tab"

### Milestone 26: Order History - Integration (20 mins)
- Add order tracking to buy/sell/transfer dialogs
- Save order after each successful transaction
- Update order history in real-time
- **Commit:** "feat: integrate order tracking with all transactions"

### Milestone 27: Polish - Loading States (15 mins)
- Add loading spinners to API calls
- Show loading state in components
- **Commit:** "feat: add loading states"

### Milestone 28: Polish - Error Handling (20 mins)
- Add error messages for failed API calls
- Display inline error feedback
- Handle network errors gracefully
- **Commit:** "feat: improve error handling and user feedback"

### Milestone 29: Final Testing & Bug Fixes (30 mins)
- Test all features end-to-end
- Fix any bugs found
- Verify all bonus features work
- Test responsive design on different screen sizes
- **Commit:** "fix: resolve final bugs and improve UX"

### Milestone 30: Documentation (15 mins)
- Update README with setup instructions
- Document implemented features
- Add screenshots if possible
- **Commit:** "docs: add project documentation"

**Total Estimated Time:** ~6-7 hours across 30 small milestones

## ALL Bonus Features (Must Implement)

Per user requirements, implement ALL bonus features from README.md:

**Fund List Bonuses:**
✓ Pagination
✓ Column sorting (asc/desc on header click)
✓ Responsive design

**Buy Dialog Bonuses:**
✓ Validation: max €10,000
✓ Validation: no negatives
✓ Native `<dialog>` element
✓ Formatted currency input ("10,55 €")

**Portfolio Bonuses:**
✓ Alphabetical sorting
✓ Category grouping
✓ Responsive design
✓ Mobile swipe actions (Vender/Traspasar)
✓ Order history tab

**Sell Dialog Bonuses:**
✓ Validation: max = holding quantity
✓ Validation: no negatives

**Transfer Dialog Bonuses:**
✓ Validation: max = holding quantity
✓ Validation: no negatives
✓ Validation: prevent same-fund transfer
✓ Validation: only between purchased funds
