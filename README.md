# 🍽️ Restaurant Sales Analytics Mini System (V1.1)
> **لوحة تحليلات مبيعات المطعم — Executive Dashboard**

A standalone, professional web application and PostgreSQL analytics engine designed for restaurant sales tracking, financial KPI calculations, and data visualization using **Supabase**, **PostgreSQL 17**, **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. 

This system prepares structured, verified financial metrics for future **n8n workflows**, **AI Sales Agents**, and **RAG (Retrieval-Augmented Generation)** integration.

---

## 📌 Project Overview

- **Project Name:** Restaurant Sales Analytics Mini System
- **Release Version:** `v1.1` (Production)
- **Target Platform:** Web Application (Responsive for Desktop, Tablet, and Mobile)
- **Primary Stack:** React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Supabase, PostgreSQL 17
- **Currency Context:** SAR (Saudi Riyal)
- **Timezone Context:** Asia/Riyadh (`+03:00`)
- **Verified Dataset Period:** June 1, 2026 – November 21, 2026 (6 Months, November Partial: 21 days)
- **Verified Dataset Size:** 60 Customers, 25 Products, 836 Total Orders (804 Counted, 32 Cancelled), 2,163 Order Line Items (0 Orphan Items)

---

## 📊 Executive KPI Summary (Verified Production State)

| Executive KPI Metric | Verified Value | Calculation Formula / Description |
| :--- | :---: | :--- |
| **Gross Sales** | **135,973.75 SAR** | $\sum (\text{quantity} \times \text{unit\_price\_at\_sale})$ |
| **Item-Level Discounts** | **772.40 SAR** | $\sum (\text{line\_discount})$ |
| **Order-Level Discounts** | **945.00 SAR** | $\sum (\text{header discount\_amount})$ |
| **Total Discounts** | **1,717.40 SAR** | Item Discounts + Order Discounts (1.26% of Gross) |
| **Total Returns** | **6,009.62 SAR** | $\sum (\text{return\_amount})$ (4.42% of Gross) |
| **Net Sales** | **128,246.73 SAR** | Gross Sales - Total Discounts - Total Returns |
| **Total Orders** | **836 Orders** | All registered and walk-in sales orders |
| **Counted Orders** | **804 Orders** | Completed + Returned + Partially Returned (Excludes Cancelled) |
| **Average Order Value (AOV)** | **159.51 SAR** | Net Sales / Counted Orders |

---

## 📅 Monthly Sales Performance & Growth (6-Month Horizon)

| Month | Gross Sales | Total Discounts | Total Returns | Net Sales | Counted Orders | AOV | MoM Growth % |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **June 2026** | 16,513.00 SAR | 151.80 SAR | 884.50 SAR | **15,476.70 SAR** | 107 | 144.64 SAR | *Baseline* |
| **July 2026** | 21,375.50 SAR | 148.60 SAR | 866.00 SAR | **20,360.90 SAR** | 118 | 172.55 SAR | **+31.56%** 🚀 |
| **August 2026** | 22,436.50 SAR | 342.00 SAR | 579.62 SAR | **21,514.88 SAR** | 140 | 153.68 SAR | **+5.67%** 📈 |
| **September 2026** | 29,778.00 SAR | 475.00 SAR | 1,249.25 SAR | **28,053.75 SAR** | 166 | 169.00 SAR | **+30.39%** 🚀 *(Peak)* |
| **October 2026** | 27,032.25 SAR | 310.00 SAR | 1,479.50 SAR | **25,242.75 SAR** | 164 | 153.92 SAR | **-10.02%** |
| **November 2026\*** | 18,838.50 SAR | 290.00 SAR | 950.75 SAR | **17,597.75 SAR** | 109 | 161.45 SAR | **\*Partial (21d)** |

*\*Note on November 2026:* Covers exactly 21 calendar days (June 1 through November 21, 2026). The prorated full-month trajectory aligns with October volume (~25.1k SAR).

---

## 🏗️ Architecture & Database View Layer

The application connects directly (read-only) to **10 pre-aggregated PostgreSQL analytics views** built on top of the transactional schema:

```mermaid
flowchart TD
    subgraph PostgreSQL Database / Supabase
        T1[(orders)]
        T2[(order_items)]
        T3[(products)]
        T4[(customers)]
        
        V_FIN[v_order_financials]
        V_ITEM[v_item_financials]
        
        V1[v_executive_kpi_summary]
        V2[v_monthly_sales]
        V3[v_top_5_products]
        V4[v_sales_by_channel]
        V5[v_sales_by_day_of_week]
        V6[v_order_status_summary]
        V7[v_returns_analysis]
        V8[v_discount_analysis]
        V9[v_top_5_customers]
        V10[v_customer_behavior_summary]
        
        T1 --> V_FIN
        T2 --> V_FIN
        T2 --> V_ITEM
        T3 --> V_ITEM
        T4 --> V9
        
        V_FIN --> V1
        V_FIN --> V2
        V_FIN --> V4
        V_FIN --> V5
        V_FIN --> V7
        V_FIN --> V8
        V_ITEM --> V3
        T1 --> V6
        T1 --> V10
    end
    
    subgraph Frontend Web Dashboard
        Client[React 18 + Vite Dashboard]
    end
    
    V1 -->|Supabase JS Client| Client
    V2 -->|Supabase JS Client| Client
    V3 -->|Supabase JS Client| Client
    V4 -->|Supabase JS Client| Client
    V5 -->|Supabase JS Client| Client
    V6 -->|Supabase JS Client| Client
    V7 -->|Supabase JS Client| Client
    V8 -->|Supabase JS Client| Client
    V9 -->|Supabase JS Client| Client
    V10 -->|Supabase JS Client| Client
```

---

## 📁 Repository Structure

```text
restaurant-sales-analytics-mini/
├── database/
│   ├── schema.sql                 # PostgreSQL DDL table definitions
│   ├── seed.sql                   # Phase 3 deterministic seed dataset (380 orders, 968 items)
│   ├── seed_extension_2026_q4.sql # Q4 extension dataset (456 orders, 1,195 items)
│   ├── extension_manifest_2026_q4.json # Deterministic batch manifest
│   ├── rollback_extension_2026_q4.sql # Safe manifest-based batch rollback
│   ├── analytics.sql              # Phase 4 PostgreSQL views & analytics layer DDL
│   └── validate_analytics.sql     # Automated validation suite (21 queries)
├── docs/
│   └── DATABASE_DICTIONARY.md     # Comprehensive data dictionary & calculation logic
├── frontend/                      # Web Application Frontend
│   ├── index.html                 # Main HTML template
│   ├── package.json               # Node dependencies & npm scripts
│   ├── vite.config.ts             # Vite build & alias configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.js         # Tailwind CSS styling theme
│   ├── postcss.config.js          # PostCSS processing
│   ├── vercel.json                # Vercel SPA rewrite configuration
│   ├── .env.example               # Environment variables template
│   └── src/
│       ├── main.tsx               # App entry point
│       ├── index.css              # Global styles & scrollbar setup
│       ├── types/analytics.ts     # TypeScript interface definitions
│       ├── lib/supabase.ts        # Supabase client & fallback detector
│       ├── services/analyticsService.ts # Live API fetcher & verified V1.1 snapshot
│       └── components/
│           ├── Header.tsx                 # Header navigation & status badges
│           ├── Sidebar.tsx                # Responsive sidebar & drawer
│           ├── KpiCard.tsx                # Executive KPI summary cards
│           ├── MonthlyPerformanceTable.tsx# Monthly sales breakdown & MoM badges
│           ├── SalesTrendChart.tsx        # Recharts monthly area & day-of-week bar charts
│           ├── ChannelBreakdownChart.tsx  # Dine-in, Takeaway & Delivery donut chart
│           ├── ProductPerformanceTable.tsx# Top 5 products by net sales
│           ├── OrderStatusChart.tsx       # Order status distribution
│           ├── CustomerInsights.tsx       # Top customers & loyalty ratio
│           ├── ReturnsDiscountsCard.tsx   # Returns & discount impact
│           └── LoadingSpinner.tsx         # Dashboard loading spinner
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js `v18+` or `v24+`
- npm `v9+` or `v11+`

### 2. Installation
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file inside `frontend/`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```
*(Note: If environment keys are left blank, the frontend automatically activates zero-downtime offline fallback mode with the exact verified V1.1 analytical snapshot).*

### 4. Run Locally
```bash
# Start local development server
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/) in your browser.

### 5. Build for Production
```bash
# Compile TypeScript & bundle with Vite
npm run build
```
Production output will be generated in `frontend/dist/`.

---

## 🔒 Security & Least Privilege Access Model

- **Read-Only Supabase Connection:** The frontend only uses the public `anon` publishable key.
- **Service Role Exclusion:** `service_role` keys are **never** exposed in code or configuration.
- **View-Level Security Grants:** The database grants `SELECT` access strictly to pre-aggregated analytics views (`v_executive_kpi_summary`, etc.). Direct `SELECT` access to raw transactional tables remains restricted.

---

## 📌 Known Issues & Notes

- **Vertical Scrollbar Mouse Dragging:** Vertical scrolling is fully supported across desktop, tablet, and mobile via touch gestures, mouse-wheel, touchpad, and keyboard navigation. Dragging the custom scrollbar thumb via direct mouse click-and-drag is documented as a known minor desktop browser interaction issue for this release.

---

## 🌐 Production Deployment (Vercel)

- **Production URL:** [https://restaurant-sales-analytics-mini.vercel.app](https://restaurant-sales-analytics-mini.vercel.app)
- **Deployment Platform:** Vercel (SPA Preset, Output Directory: `dist`)
