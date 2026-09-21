# Database Dictionary & Analytics Definitions (Revised)

**Project:** Restaurant Sales Analytics Mini System  
**Engine:** PostgreSQL / Supabase  
**Currency:** SAR (Saudi Riyal)  
**Timezone:** Asia/Riyadh (`UTC+03:00`)  

---

## 1. Schema Overview

The database consists of 4 core relational tables:
1. `customers`: Customer profiles and locations.
2. `products`: Catalog of items and current listing prices.
3. `orders`: Order header tracking order date, channel, status, order-level discount, tax, and order-level return total.
4. `order_items`: Line item details storing historical price at sale, decimal weighted quantities, item-level discounts, line total before returns, item-level returned quantities, and item-level return amounts.

---

## 2. Table Definitions

### 2.1 `customers` Table
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, Default `gen_random_uuid()` | System unique ID for customer |
| `customer_name` | `VARCHAR(255)` | `NOT NULL` | Customer full name |
| `phone` | `VARCHAR(50)` | Nullable | Optional contact phone number |
| `city` | `VARCHAR(100)` | `NOT NULL`, Default `'Riyadh'` | Customer city location |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default `CURRENT_TIMESTAMP` | Account creation timestamp |

---

### 2.2 `products` Table
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, Default `gen_random_uuid()` | System unique ID for product |
| `product_name` | `VARCHAR(255)` | `NOT NULL` | Product display name |
| `category` | `VARCHAR(100)` | `NOT NULL` | Menu category (Main, Beverage, Seafood, etc.) |
| `current_price` | `NUMERIC(10,2)` | `NOT NULL`, `CHECK (current_price >= 0)` | Catalog listing price in SAR |
| `active` | `BOOLEAN` | `NOT NULL`, Default `TRUE` | Menu availability status |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default `CURRENT_TIMESTAMP` | Catalog creation timestamp |

> ⚠️ **Critical Historical Price Rule:** Historical sales queries **MUST NOT** use `products.current_price`. Historical sales transactions preserve actual selling price in `order_items.unit_price_at_sale`.

---

### 2.3 `orders` Table
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, Default `gen_random_uuid()` | System unique ID for order |
| `order_number` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | Unique order number (e.g. `ORD-2026-0001`) |
| `customer_id` | `UUID` | `FOREIGN KEY` -> `customers(id) ON DELETE SET NULL` | Linked customer ID (nullable for walk-ins) |
| `order_date` | `TIMESTAMPTZ` | `NOT NULL`, Default `CURRENT_TIMESTAMP` | Official order timestamp in `Asia/Riyadh` |
| `order_status` | `VARCHAR(30)` | `NOT NULL`, `CHECK (order_status IN ('Completed', 'Cancelled', 'Returned', 'Partially Returned'))` | Lifecycle status |
| `sales_channel` | `VARCHAR(30)` | `NOT NULL`, `CHECK (sales_channel IN ('Dine-in', 'Takeaway', 'Delivery'))` | Sales channel |
| `branch` | `VARCHAR(100)` | `NOT NULL`, Default `'Main Branch'` | Branch location |
| `discount_amount` | `NUMERIC(10,2)` | `NOT NULL`, Default `0.00`, `CHECK (discount_amount >= 0)` | **Additional order-level discount only** in SAR |
| `tax_amount` | `NUMERIC(10,2)` | `NOT NULL`, Default `0.00`, `CHECK (tax_amount >= 0)` | Tax amount in SAR (excluded from Net Sales) |
| `return_amount` | `NUMERIC(10,2)` | `NOT NULL`, Default `0.00`, `CHECK (return_amount >= 0)` | **Order-level return total** for header reporting/reconciliation |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default `CURRENT_TIMESTAMP` | Record creation timestamp |

---

### 2.4 `order_items` Table
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, Default `gen_random_uuid()` | Unique line item ID |
| `order_id` | `UUID` | `FOREIGN KEY` -> `orders(id) ON DELETE CASCADE` | Parent order header reference |
| `product_id` | `UUID` | `FOREIGN KEY` -> `products(id) ON DELETE RESTRICT` | Referenced catalog product ID |
| `quantity` | `NUMERIC(10,3)` | `NOT NULL`, `CHECK (quantity > 0)` | **Decimal quantity** supporting weighted items (e.g. 1.250 kg fish) |
| `unit_price_at_sale` | `NUMERIC(10,2)` | `NOT NULL`, `CHECK (unit_price_at_sale >= 0)` | **Authoritative price charged per unit at sale** |
| `line_discount` | `NUMERIC(10,2)` | `NOT NULL`, Default `0.00`, `CHECK (line_discount >= 0)` | Item-level discount in SAR |
| `line_total` | `NUMERIC(10,2)` | `GENERATED ALWAYS AS ((quantity * unit_price_at_sale) - line_discount) STORED` | Net line total **after item discount and BEFORE returns** |
| `returned_quantity` | `NUMERIC(10,3)` | `NOT NULL`, Default `0.000`, `CHECK (returned_quantity >= 0 AND returned_quantity <= quantity)` | Decimal returned quantity for this line item |
| `return_amount` | `NUMERIC(10,2)` | `NOT NULL`, Default `0.00`, `CHECK (return_amount >= 0 AND return_amount <= ((quantity * unit_price_at_sale) - line_discount))` | **Authoritative item-level return amount in SAR** |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, Default `CURRENT_TIMESTAMP` | Record creation timestamp |

---

## 3. Analytics Layer Views (`database/analytics.sql`)

| View Name | Description | Key Formulas & Rules |
| :--- | :--- | :--- |
| `v_order_financials` | Base order-level financial summary view | Prevents duplicate counting of order header discounts, returns, and taxes when joining line items. |
| `v_item_financials` | Line-item financials with proportional order discount allocation | Allocates order header discounts to line items proportionally: $\text{Item Proportion} \times \text{order\_discount}$. Guarantees product Net Sales sum equals overall Net Sales. |
| `v_executive_kpi_summary` | Executive KPI Summary totals | Calculates Gross Sales, Item Discounts, Order Discounts, Total Discounts, Returns, Net Sales, Counted Orders, and AOV. |
| `v_monthly_sales` | Monthly sales & MoM growth % | Monthly Net Sales and Month-over-Month growth percentage calculation: $\frac{\text{Net}_{\text{curr}} - \text{Net}_{\text{prev}}}{\text{Net}_{\text{prev}}} \times 100$. |
| `v_top_5_products` | Top 5 products by Net Sales | Ranks top 5 products using allocated product-level Net Sales. |
| `v_top_5_customers` | Top 5 customers by Net Sales | Ranks top 5 registered customers by Net Sales contribution. |
| `v_sales_by_channel` | Channel performance breakdown | Net sales, order counts, AOV, and contribution % across Dine-in, Takeaway, and Delivery. |
| `v_sales_by_day_of_week` | Day-of-week sales analytics | Grouped logically from Monday (1) to Sunday (7). |
| `v_returns_analysis` | Return metrics summary | Evaluates return counts, return amounts, and return rate % relative to Gross Sales. |
| `v_discount_analysis` | Discount structure analysis | Item-level vs order-level discounts and discount rate % relative to Gross Sales. |
| `v_order_status_summary` | Operational status breakdown | Distribution of Completed, Cancelled, Returned, and Partially Returned orders. |
| `v_customer_behavior_summary` | Customer engagement analytics | Tracks registered vs walk-in orders and repeat customer counts. |

---

## 4. Financial & Analytics Calculation Definitions

### 4.1 Discount Non-Duplication Rule
- `order_items.line_discount` = Item-level discount.
- `orders.discount_amount` = Additional order-level discount only.
- $\text{Total Discount} = \sum(\text{order\_items.line\_discount}) + \text{orders.discount\_amount}$.

---

### 4.2 Proportional Order Discount Allocation Formula
For product-level analytics, order-level discounts are allocated to line items based on pre-return line total:
$$\text{Proportion} = \frac{(\text{quantity} \times \text{unit\_price\_at\_sale}) - \text{line\_discount}}{\sum \text{line\_totals for parent order}}$$
$$\text{Allocated Order Discount} = \text{ROUND}(\text{Proportion} \times \text{orders.discount\_amount}, 2)$$
$$\text{Product Net Sales} = (\text{quantity} \times \text{unit\_price\_at\_sale}) - \text{line\_discount} - \text{Allocated Order Discount} - \text{return\_amount}$$

---

### 4.3 Key Formulas

#### Gross Sales
$$\text{Gross Sales} = \sum (\text{order\_items.quantity} \times \text{order\_items.unit\_price\_at\_sale})$$
*(For valid orders: `order_status IN ('Completed', 'Returned', 'Partially Returned')`)*.

#### Net Sales
$$\text{Net Sales} = \text{Gross Sales} - \sum(\text{order\_items.line\_discount}) - \text{orders.discount\_amount} - \sum(\text{order\_items.return\_amount})$$

#### Average Order Value (AOV)
$$\text{AOV} = \frac{\text{Net Sales}}{\text{Count of Counted Orders}}$$

#### Sales Growth Percentage
$$\text{Sales Growth \%} = \frac{\text{Current Period Net Sales} - \text{Previous Period Net Sales}}{\text{Previous Period Net Sales}} \times 100$$
*(If Previous Period Net Sales = 0, returns `NULL`)*.

---

## 5. Validation Suite (`database/validate_analytics.sql`)

Contains 20 automated validation queries covering:
- Zero financial contribution for cancelled orders.
- 1-to-1 reconciliation of product Net Sales to overall Net Sales.
- 1-to-1 reconciliation of monthly and channel Net Sales to overall Net Sales.
- Non-duplication verification for discounts and returns.
