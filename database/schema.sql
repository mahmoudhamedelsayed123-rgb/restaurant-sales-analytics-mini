-- ============================================================
-- Restaurant Sales Analytics Mini System - Database Schema DDL
-- Project: restaurant-sales-analytics-mini
-- Database: PostgreSQL / Supabase
-- Timezone Context: Asia/Riyadh (+03:00)
-- Currency Context: SAR (Saudi Riyal)
-- Note: Non-destructive DDL script (No DROP statements)
-- ============================================================

SET timezone = 'Asia/Riyadh';

-- ============================================================
-- 1. CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100) NOT NULL DEFAULT 'Riyadh',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE customers IS 'Stores customer profiles for tracking customer-based sales analytics.';
COMMENT ON COLUMN customers.id IS 'Primary key UUID for customer.';
COMMENT ON COLUMN customers.customer_name IS 'Full name of customer.';
COMMENT ON COLUMN customers.phone IS 'Optional contact phone number.';
COMMENT ON COLUMN customers.city IS 'Customer city location.';
COMMENT ON COLUMN customers.created_at IS 'Timestamp customer record was registered.';

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_price NUMERIC(10, 2) NOT NULL CHECK (current_price >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE products IS 'Master product catalog containing current selling prices and status.';
COMMENT ON COLUMN products.id IS 'Primary key UUID for product catalog entry.';
COMMENT ON COLUMN products.product_name IS 'Name of product item.';
COMMENT ON COLUMN products.category IS 'Product category (e.g., Main Dish, Appetizer, Beverage, Dessert).';
COMMENT ON COLUMN products.current_price IS 'Current catalog listing price in SAR. Note: Historical orders use order_items.unit_price_at_sale.';
COMMENT ON COLUMN products.active IS 'Flag indicating if product is currently active on menu.';

-- ============================================================
-- 3. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(30) NOT NULL CHECK (order_status IN ('Completed', 'Cancelled', 'Returned', 'Partially Returned')),
    sales_channel VARCHAR(30) NOT NULL CHECK (sales_channel IN ('Dine-in', 'Takeaway', 'Delivery')),
    branch VARCHAR(100) NOT NULL DEFAULT 'Main Branch',
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    return_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (return_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE orders IS 'Header records for restaurant sales transactions.';
COMMENT ON COLUMN orders.id IS 'Primary key UUID for order header.';
COMMENT ON COLUMN orders.order_number IS 'Unique business identifier for order (e.g., ORD-2026-0001).';
COMMENT ON COLUMN orders.customer_id IS 'Foreign key referencing customers. Nullable for anonymous/walk-in sales.';
COMMENT ON COLUMN orders.order_date IS 'Official sales date timestamp in Asia/Riyadh timezone.';
COMMENT ON COLUMN orders.order_status IS 'Lifecycle status: Completed, Cancelled, Returned, Partially Returned. Cancelled orders are excluded from financial analytics.';
COMMENT ON COLUMN orders.sales_channel IS 'Distribution channel: Dine-in, Takeaway, Delivery.';
COMMENT ON COLUMN orders.branch IS 'Restaurant branch identifier.';
COMMENT ON COLUMN orders.discount_amount IS 'Additional order-level discount in SAR (distinct from item-level line_discount).';
COMMENT ON COLUMN orders.tax_amount IS 'Tax amount in SAR (excluded from Net Sales calculations).';
COMMENT ON COLUMN orders.return_amount IS 'Order-level monetary value of returns in SAR for header reconciliation.';

-- ============================================================
-- 4. ORDER_ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity NUMERIC(10, 3) NOT NULL CHECK (quantity > 0),
    unit_price_at_sale NUMERIC(10, 2) NOT NULL CHECK (unit_price_at_sale >= 0),
    line_discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (line_discount >= 0),
    line_total NUMERIC(10, 2) GENERATED ALWAYS AS ((quantity * unit_price_at_sale) - line_discount) STORED,
    returned_quantity NUMERIC(10, 3) NOT NULL DEFAULT 0.000 CHECK (returned_quantity >= 0 AND returned_quantity <= quantity),
    return_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (return_amount >= 0 AND return_amount <= ((quantity * unit_price_at_sale) - line_discount)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE order_items IS 'Line item details for each order header with weighted quantity and item-level return tracking.';
COMMENT ON COLUMN order_items.id IS 'Primary key UUID for order line item.';
COMMENT ON COLUMN order_items.order_id IS 'Foreign key referencing orders header.';
COMMENT ON COLUMN order_items.product_id IS 'Foreign key referencing products catalog.';
COMMENT ON COLUMN order_items.quantity IS 'Quantity sold in decimal NUMERIC(10,3) to support weighted items (e.g., 1.250 kg fish) and unit items.';
COMMENT ON COLUMN order_items.unit_price_at_sale IS 'HISTORICAL SELLING PRICE per unit at exact moment of sale. Authoritative historical price.';
COMMENT ON COLUMN order_items.line_discount IS 'Item-specific discount in SAR.';
COMMENT ON COLUMN order_items.line_total IS 'Line total after item discount and BEFORE returns: (quantity * unit_price_at_sale) - line_discount.';
COMMENT ON COLUMN order_items.returned_quantity IS 'Quantity returned for this line item (0 <= returned_quantity <= quantity).';
COMMENT ON COLUMN order_items.return_amount IS 'Authoritative monetary value of returns for this specific product item line.';

-- ============================================================
-- PERFORMANCE & ANALYTICS INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_sales_channel ON orders(sales_channel);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
