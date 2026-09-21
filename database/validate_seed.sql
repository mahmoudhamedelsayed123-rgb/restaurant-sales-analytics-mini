-- ============================================================
-- Restaurant Sales Analytics Mini System - Seed Data Validation Queries
-- Project: restaurant-sales-analytics-mini
-- Purpose: Verify data volume, date bounds, integrity, and analytics rules.
-- ============================================================

SET timezone = 'Asia/Riyadh';

-- 1. Total Customers Count (Target >= 60)
SELECT '1. Total Customers' AS test_name, COUNT(*) AS count_val, COUNT(*) >= 60 AS passed FROM customers;

-- 2. Total Products Count (Target >= 25)
SELECT '2. Total Products' AS test_name, COUNT(*) AS count_val, COUNT(*) >= 25 AS passed FROM products;

-- 3. Total Orders Count (Target >= 360)
SELECT '3. Total Orders' AS test_name, COUNT(*) AS count_val, COUNT(*) >= 360 AS passed FROM orders;

-- 4. Date Range Bounds (2026-06-01 <= order_date < 2026-09-01)
SELECT '4. Date Range Bounds' AS test_name, 
       MIN(order_date) AS min_date, 
       MAX(order_date) AS max_date,
       (MIN(order_date) >= '2026-06-01' AND MAX(order_date) < '2026-09-01') AS passed
FROM orders;

-- 5. Orders per Calendar Month Breakdown
SELECT '5. Monthly Orders Breakdown' AS test_name,
       TO_CHAR(order_date, 'YYYY-MM') AS yr_month,
       COUNT(*) AS order_count
FROM orders
GROUP BY yr_month
ORDER BY yr_month;

-- 6. Orders by Sales Channel
SELECT '6. Sales Channels Distribution' AS test_name,
       sales_channel,
       COUNT(*) AS count_val
FROM orders
GROUP BY sales_channel;

-- 7. Orders by Status Breakdown
SELECT '7. Order Status Distribution' AS test_name,
       order_status,
       COUNT(*) AS count_val
FROM orders
GROUP BY order_status;

-- 8. Items & Orders with Item-Level Discounts
SELECT '8. Item Discounts Count' AS test_name,
       COUNT(*) AS item_discount_count
FROM order_items
WHERE line_discount > 0;

-- 9. Orders with Order-Level Discounts
SELECT '9. Order Discounts Count' AS test_name,
       COUNT(*) AS order_discount_count
FROM orders
WHERE discount_amount > 0;

-- 10. Orders with Returns
SELECT '10. Orders with Returns Count' AS test_name,
       COUNT(*) AS returned_orders_count
FROM orders
WHERE return_amount > 0;

-- 11. Weighted Seafood Order Items Count (Decimal quantities)
SELECT '11. Weighted Seafood Items Count' AS test_name,
       COUNT(*) AS weighted_items_count
FROM order_items
WHERE quantity % 1 <> 0;

-- 12. Anonymous Walk-in Orders Count
SELECT '12. Anonymous Orders Count' AS test_name,
       COUNT(*) AS anonymous_orders_count
FROM orders
WHERE customer_id IS NULL;

-- 13. Repeat Customers Count (Customers with > 1 order)
SELECT '13. Repeat Customers Count' AS test_name,
       COUNT(*) AS repeat_customer_count
FROM (
    SELECT customer_id, COUNT(*) AS order_cnt
    FROM orders
    WHERE customer_id IS NOT NULL
    GROUP BY customer_id
    HAVING COUNT(*) > 1
) sub;

-- 14. Check Duplicate Order Numbers (Target = 0)
SELECT '14. Duplicate Order Numbers' AS test_name,
       COUNT(*) - COUNT(DISTINCT order_number) AS duplicate_count,
       (COUNT(*) = COUNT(DISTINCT order_number)) AS passed
FROM orders;

-- 15. Check Orphan Order Items (Target = 0)
SELECT '15. Orphan Order Items' AS test_name,
       COUNT(*) AS orphan_count,
       (COUNT(*) = 0) AS passed
FROM order_items oi
LEFT JOIN orders o ON o.id = oi.order_id
WHERE o.id IS NULL;

-- 16. Check Invalid Product References (Target = 0)
SELECT '16. Invalid Product Refs' AS test_name,
       COUNT(*) AS invalid_prod_count,
       (COUNT(*) = 0) AS passed
FROM order_items oi
LEFT JOIN products p ON p.id = oi.product_id
WHERE p.id IS NULL;

-- 17. Check Header Return Reconciliation (orders.return_amount == SUM(order_items.return_amount))
SELECT '17. Return Reconciliation Mismatches' AS test_name,
       COUNT(*) AS mismatch_count,
       (COUNT(*) = 0) AS passed
FROM (
    SELECT o.id, o.return_amount AS order_ret, SUM(oi.return_amount) AS items_ret
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id, o.return_amount
    HAVING ROUND(o.return_amount, 2) <> ROUND(SUM(oi.return_amount), 2)
) sub;

-- 18. Check Invalid Returned Quantity (returned_quantity > quantity) (Target = 0)
SELECT '18. Invalid Returned Quantity' AS test_name,
       COUNT(*) AS invalid_ret_qty_count,
       (COUNT(*) = 0) AS passed
FROM order_items
WHERE returned_quantity > quantity OR returned_quantity < 0;

-- 19. Check Invalid Return Amount (return_amount > line total before returns) (Target = 0)
SELECT '19. Invalid Return Amount' AS test_name,
       COUNT(*) AS invalid_ret_amt_count,
       (COUNT(*) = 0) AS passed
FROM order_items
WHERE return_amount > ((quantity * unit_price_at_sale) - line_discount) OR return_amount < 0;
