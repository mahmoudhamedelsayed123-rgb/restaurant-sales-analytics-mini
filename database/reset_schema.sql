-- ============================================================
-- ⚠️ WARNING: DESTRUCTIVE DEVELOPMENT SCRIPT!
-- RUNNING THIS FILE WILL PERMANENTLY DELETE ALL EXISTING PROJECT DATA.
-- DO NOT RUN THIS SCRIPT IN PRODUCTION OR ON POPULATED DATABASES.
-- ============================================================
-- Project: restaurant-sales-analytics-mini
-- Purpose: Complete database reset / teardown script for development.
-- ============================================================

SET timezone = 'Asia/Riyadh';

-- Destructive DROP TABLE commands in reverse dependency order
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Re-create clean tables by including schema DDL
-- ============================================================
-- 1. CUSTOMERS TABLE
-- ============================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100) NOT NULL DEFAULT 'Riyadh',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_price NUMERIC(10, 2) NOT NULL CHECK (current_price >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
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

-- ============================================================
-- 4. ORDER_ITEMS TABLE
-- ============================================================
CREATE TABLE order_items (
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

-- Indexes
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_sales_channel ON orders(sales_channel);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
