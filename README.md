# Restaurant Sales Analytics Mini System

A standalone web application for an academic AI Analytics project designed to track, calculate, and analyze restaurant sales metrics using Supabase and PostgreSQL, preparing structured data for future n8n integration, AI Sales Agent, and RAG systems.

---

## 📌 Project Overview
- **Project Name:** Restaurant Sales Analytics Mini System
- **Target Platform:** Web Application (Responsive browser interface for Desktop, Tablet, and Mobile)
- **Primary Stack:** Web Frontend, Supabase, PostgreSQL
- **Currency:** SAR (Saudi Riyal)
- **Timezone:** Asia/Riyadh (`+03:00`)
- **Demo Dataset Period:** June 1, 2026 through August 31, 2026 (3 Full Calendar Months)

---

## 📁 Repository Structure
```text
restaurant-sales-analytics-mini/
├── database/
│   ├── schema.sql                 # Safe non-destructive PostgreSQL database DDL schema
│   ├── reset_schema.sql           # Destructive teardown/reset script (development only)
│   ├── seed.sql                   # Phase 3 deterministic seed dataset (380 orders, 968 items)
│   ├── validate_seed.sql          # Phase 3 seed dataset validation SQL queries
│   ├── analytics.sql              # Phase 4 PostgreSQL views & analytics layer DDL
│   └── validate_analytics.sql     # Phase 4 analytics layer validation query suite
├── docs/
│   └── DATABASE_DICTIONARY.md     # Comprehensive data dictionary, views & analytics definitions
├── frontend/                      # Web Application frontend files (Phase 5)
└── README.md                      # Project documentation overview
```

---

## 📈 Executive KPI Summary (Phase 4 Verified)
- **Gross Sales:** 60,325.00 SAR
- **Item-Level Discounts:** 222.40 SAR
- **Order-Level Discounts:** 420.00 SAR
- **Total Discounts:** 642.40 SAR
- **Total Returns:** 2,330.12 SAR
- **Net Sales:** 57,352.48 SAR
- **Counted Orders:** 365 orders
- **Average Order Value (AOV):** 157.13 SAR
- **Monthly Net Sales:**
  - June 2026: 15,476.70 SAR (107 orders, AOV 144.64 SAR)
  - July 2026: 20,360.90 SAR (118 orders, AOV 172.55 SAR, **+31.56% MoM**)
  - August 2026: 21,514.88 SAR (140 orders, AOV 153.68 SAR, **+5.67% MoM**)

---

## 🔒 Separation Notice
This project is completely **standalone** and independent of any existing ERP or POS software. It maintains its own isolated database schema, configuration, and repository files.
