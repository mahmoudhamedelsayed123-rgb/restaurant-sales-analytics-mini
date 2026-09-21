-- ============================================================
-- Restaurant Sales Analytics Mini System - Analytics Layer DDL
-- Project: restaurant-sales-analytics-mini
-- Engine: PostgreSQL / Supabase
-- Timezone Context: Asia/Riyadh (+03:00)
-- Currency Context: SAR (Saudi Riyal)
-- ============================================================

SET timezone = 'Asia/Riyadh';

-- ============================================================
-- VIEW 1: v_order_financials
-- Base view calculating order-level financial metrics cleanly.
-- Protects order-level values (discount, tax, returns) from double-counting.
-- ============================================================
CREATE OR REPLACE VIEW v_order_financials AS
WITH item_aggregates AS (
    SELECT 
        order_id,
        SUM(quantity * unit_price_at_sale) AS gross_sales,
        SUM(line_discount) AS item_discounts,
        SUM((quantity * unit_price_at_sale) - line_discount) AS items_net_before_return,
        SUM(returned_quantity) AS items_returned_quantity,
        SUM(return_amount) AS item_returns
    FROM order_items
    GROUP BY order_id
)
SELECT 
    o.id AS order_id,
    o.order_number,
    o.customer_id,
    o.order_date,
    o.order_status,
    o.sales_channel,
    o.branch,
    COALESCE(ia.gross_sales, 0.00) AS gross_sales,
    COALESCE(ia.item_discounts, 0.00) AS item_discounts,
    o.discount_amount AS order_discount,
    (COALESCE(ia.item_discounts, 0.00) + o.discount_amount) AS total_discounts,
    COALESCE(ia.item_returns, 0.00) AS returns,
    o.tax_amount,
    CASE 
        WHEN o.order_status = 'Cancelled' THEN 0.00
        ELSE (COALESCE(ia.gross_sales, 0.00) - (COALESCE(ia.item_discounts, 0.00) + o.discount_amount) - COALESCE(ia.item_returns, 0.00))
    END AS net_sales,
    COALESCE(ia.items_returned_quantity, 0.000) AS total_returned_quantity
FROM orders o
LEFT JOIN item_aggregates ia ON ia.order_id = o.id;

COMMENT ON VIEW v_order_financials IS 'Order-level financial summary isolating order header metrics to prevent duplicate counting during joins.';

-- ============================================================
-- VIEW 2: v_item_financials
-- Line-item financial breakdown with proportional order-discount allocation.
-- ============================================================
CREATE OR REPLACE VIEW v_item_financials AS
WITH order_totals AS (
    SELECT 
        order_id,
        SUM((quantity * unit_price_at_sale) - line_discount) AS order_items_pre_return_net
    FROM order_items
    GROUP BY order_id
)
SELECT 
    oi.id AS item_id,
    oi.order_id,
    o.order_number,
    o.order_date,
    o.order_status,
    o.sales_channel,
    oi.product_id,
    p.product_name,
    p.category,
    oi.quantity,
    oi.unit_price_at_sale,
    (oi.quantity * oi.unit_price_at_sale) AS gross_sales,
    oi.line_discount AS item_discount,
    ROUND(
        CASE 
            WHEN o.discount_amount = 0 OR ot.order_items_pre_return_net = 0 THEN 0.00
            ELSE ( ((oi.quantity * oi.unit_price_at_sale) - oi.line_discount) / ot.order_items_pre_return_net ) * o.discount_amount
        END, 2
    ) AS allocated_order_discount,
    oi.returned_quantity,
    oi.return_amount,
    CASE 
        WHEN o.order_status = 'Cancelled' THEN 0.00
        ELSE ROUND(
            (oi.quantity * oi.unit_price_at_sale) - oi.line_discount - 
            (CASE 
                WHEN o.discount_amount = 0 OR ot.order_items_pre_return_net = 0 THEN 0.00
                ELSE ( ((oi.quantity * oi.unit_price_at_sale) - oi.line_discount) / ot.order_items_pre_return_net ) * o.discount_amount
            END) - oi.return_amount, 2
        )
    END AS product_net_sales
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
JOIN order_totals ot ON ot.order_id = oi.order_id;

COMMENT ON VIEW v_item_financials IS 'Line-item financials allocating order-level discounts proportionally to guarantee product-level net sales reconcile 1-to-1 with overall net sales.';

-- ============================================================
-- VIEW 3: v_executive_kpi_summary
-- Executive KPI Summary totals for counted orders.
-- ============================================================
CREATE OR REPLACE VIEW v_executive_kpi_summary AS
SELECT 
    ROUND(SUM(gross_sales), 2) AS total_gross_sales,
    ROUND(SUM(item_discounts), 2) AS total_item_discounts,
    ROUND(SUM(order_discount), 2) AS total_order_discounts,
    ROUND(SUM(total_discounts), 2) AS total_discounts,
    ROUND(SUM(returns), 2) AS total_returns,
    ROUND(SUM(net_sales), 2) AS total_net_sales,
    COUNT(*) AS counted_orders,
    ROUND(SUM(net_sales) / NULLIF(COUNT(*), 0), 2) AS average_order_value
FROM v_order_financials
WHERE order_status IN ('Completed', 'Returned', 'Partially Returned');

COMMENT ON VIEW v_executive_kpi_summary IS 'Executive level overall KPI summary for all valid counted orders.';

-- ============================================================
-- VIEW 4: v_monthly_sales
-- Monthly Sales & Month-over-Month Growth % Analytics.
-- ============================================================
CREATE OR REPLACE VIEW v_monthly_sales AS
WITH monthly_summary AS (
    SELECT 
        TO_CHAR(order_date, 'YYYY-MM') AS yr_month,
        ROUND(SUM(gross_sales), 2) AS gross_sales,
        ROUND(SUM(total_discounts), 2) AS total_discounts,
        ROUND(SUM(returns), 2) AS returns,
        ROUND(SUM(net_sales), 2) AS net_sales,
        COUNT(*) AS counted_orders,
        ROUND(SUM(net_sales) / NULLIF(COUNT(*), 0), 2) AS average_order_value
    FROM v_order_financials
    WHERE order_status IN ('Completed', 'Returned', 'Partially Returned')
    GROUP BY TO_CHAR(order_date, 'YYYY-MM')
)
SELECT 
    yr_month,
    gross_sales,
    total_discounts,
    returns,
    net_sales,
    counted_orders,
    average_order_value,
    LAG(net_sales) OVER (ORDER BY yr_month) AS prev_month_net_sales,
    ROUND(net_sales - LAG(net_sales) OVER (ORDER BY yr_month), 2) AS growth_amount,
    ROUND((net_sales - LAG(net_sales) OVER (ORDER BY yr_month)) / NULLIF(LAG(net_sales) OVER (ORDER BY yr_month), 0) * 100.0, 2) AS mom_growth_pct
FROM monthly_summary
ORDER BY yr_month;

COMMENT ON VIEW v_monthly_sales IS 'Monthly breakdown of sales performance and month-over-month Net Sales growth percentages.';

-- ============================================================
-- VIEW 5: v_top_5_products
-- Top 5 products ranked by product-level Net Sales.
-- ============================================================
CREATE OR REPLACE VIEW v_top_5_products AS
SELECT 
    product_name,
    category,
    ROUND(SUM(quantity), 3) AS quantity_sold,
    ROUND(SUM(returned_quantity), 3) AS returned_quantity,
    ROUND(SUM(gross_sales), 2) AS gross_sales,
    ROUND(SUM(item_discount), 2) AS item_discounts,
    ROUND(SUM(allocated_order_discount), 2) AS allocated_order_discounts,
    ROUND(SUM(return_amount), 2) AS returns,
    ROUND(SUM(product_net_sales), 2) AS product_net_sales,
    COUNT(DISTINCT order_id) AS order_count
FROM v_item_financials
WHERE order_status IN ('Completed', 'Returned', 'Partially Returned')
GROUP BY product_id, product_name, category
ORDER BY product_net_sales DESC
LIMIT 5;

COMMENT ON VIEW v_top_5_products IS 'Top 5 performing products ranked by net sales value after proportional discount allocation.';

-- ============================================================
-- VIEW 6: v_top_5_customers
-- Top 5 registered customers ranked by Net Sales.
-- ============================================================
CREATE OR REPLACE VIEW v_top_5_customers AS
SELECT 
    c.customer_name,
    c.city,
    COUNT(DISTINCT vf.order_id) AS counted_orders,
    ROUND(SUM(vf.gross_sales), 2) AS gross_sales,
    ROUND(SUM(vf.total_discounts), 2) AS discounts,
    ROUND(SUM(vf.returns), 2) AS returns,
    ROUND(SUM(vf.net_sales), 2) AS net_sales,
    ROUND(SUM(vf.net_sales) / NULLIF(COUNT(DISTINCT vf.order_id), 0), 2) AS average_order_value
FROM v_order_financials vf
JOIN customers c ON c.id = vf.customer_id
WHERE vf.order_status IN ('Completed', 'Returned', 'Partially Returned')
  AND vf.customer_id IS NOT NULL
GROUP BY c.id, c.customer_name, c.city
ORDER BY net_sales DESC
LIMIT 5;

COMMENT ON VIEW v_top_5_customers IS 'Top 5 registered customers by net sales contribution.';

-- ============================================================
-- VIEW 7: v_sales_by_channel
-- Sales channel performance breakdown.
-- ============================================================
CREATE OR REPLACE VIEW v_sales_by_channel AS
WITH total_net AS (
    SELECT SUM(net_sales) AS overall_net_sales 
    FROM v_order_financials 
    WHERE order_status IN ('Completed', 'Returned', 'Partially Returned')
)
SELECT 
    vf.sales_channel,
    COUNT(*) AS counted_orders,
    ROUND(SUM(vf.gross_sales), 2) AS gross_sales,
    ROUND(SUM(vf.total_discounts), 2) AS discounts,
    ROUND(SUM(vf.returns), 2) AS returns,
    ROUND(SUM(vf.net_sales), 2) AS net_sales,
    ROUND(SUM(vf.net_sales) / NULLIF(COUNT(*), 0), 2) AS average_order_value,
    ROUND(SUM(vf.net_sales) / NULLIF((SELECT overall_net_sales FROM total_net), 0) * 100.0, 2) AS pct_of_net_sales
FROM v_order_financials vf
WHERE vf.order_status IN ('Completed', 'Returned', 'Partially Returned')
GROUP BY vf.sales_channel
ORDER BY net_sales DESC;

COMMENT ON VIEW v_sales_by_channel IS 'Breakdown of sales metrics and contribution percentage across Dine-in, Takeaway, and Delivery.';

-- ============================================================
-- VIEW 8: v_sales_by_day_of_week
-- Day-of-week sales analytics (Monday to Sunday).
-- ============================================================
CREATE OR REPLACE VIEW v_sales_by_day_of_week AS
SELECT 
    TRIM(TO_CHAR(order_date, 'Day')) AS day_name,
    EXTRACT(ISODOW FROM order_date) AS day_number,
    COUNT(*) AS counted_orders,
    ROUND(SUM(net_sales), 2) AS net_sales,
    ROUND(SUM(net_sales) / NULLIF(COUNT(*), 0), 2) AS average_order_value
FROM v_order_financials
WHERE order_status IN ('Completed', 'Returned', 'Partially Returned')
GROUP BY TRIM(TO_CHAR(order_date, 'Day')), EXTRACT(ISODOW FROM order_date)
ORDER BY day_number;

COMMENT ON VIEW v_sales_by_day_of_week IS 'Sales performance grouped logically by day of week from Monday (1) to Sunday (7).';

-- ============================================================
-- VIEW 9: v_returns_analysis
-- Comprehensive returns analysis & operational summary.
-- ============================================================
CREATE OR REPLACE VIEW v_returns_analysis AS
SELECT 
    COUNT(CASE WHEN returns > 0 THEN 1 END) AS orders_with_returns,
    COUNT(CASE WHEN order_status = 'Returned' THEN 1 END) AS full_return_orders,
    COUNT(CASE WHEN order_status = 'Partially Returned' THEN 1 END) AS partial_return_orders,
    ROUND(SUM(returns), 2) AS total_return_amount,
    ROUND(SUM(returns) / NULLIF(SUM(gross_sales), 0) * 100.0, 2) AS return_rate_pct_of_gross
FROM v_order_financials
WHERE order_status IN ('Completed', 'Returned', 'Partially Returned');

COMMENT ON VIEW v_returns_analysis IS 'Summary metrics evaluating monetary and operational return impact.';

-- ============================================================
-- VIEW 10: v_discount_analysis
-- Comprehensive discount structure analysis.
-- ============================================================
CREATE OR REPLACE VIEW v_discount_analysis AS
SELECT 
    COUNT(CASE WHEN item_discounts > 0 THEN 1 END) AS orders_with_item_discounts,
    COUNT(CASE WHEN order_discount > 0 THEN 1 END) AS orders_with_order_discounts,
    ROUND(SUM(item_discounts), 2) AS total_item_discounts,
    ROUND(SUM(order_discount), 2) AS total_order_discounts,
    ROUND(SUM(total_discounts), 2) AS total_discounts,
    ROUND(SUM(total_discounts) / NULLIF(SUM(gross_sales), 0) * 100.0, 2) AS discount_rate_pct_of_gross
FROM v_order_financials
WHERE order_status IN ('Completed', 'Returned', 'Partially Returned');

COMMENT ON VIEW v_discount_analysis IS 'Item-level vs order-level discount breakdown and rate relative to gross sales.';

-- ============================================================
-- VIEW 11: v_order_status_summary
-- Operational order status breakdown (includes Cancelled orders).
-- ============================================================
CREATE OR REPLACE VIEW v_order_status_summary AS
WITH total_orders_cnt AS (
    SELECT COUNT(*) AS total_all FROM orders
)
SELECT 
    order_status,
    COUNT(*) AS order_count,
    ROUND(COUNT(*) * 100.0 / NULLIF((SELECT total_all FROM total_orders_cnt), 0), 2) AS pct_of_total_orders
FROM orders
GROUP BY order_status
ORDER BY order_count DESC;

COMMENT ON VIEW v_order_status_summary IS 'Operational order status distribution including cancelled orders.';

-- ============================================================
-- VIEW 12: v_customer_behavior_summary
-- Customer behavior breakdown (registered vs walk-in).
-- ============================================================
CREATE OR REPLACE VIEW v_customer_behavior_summary AS
WITH total_orders_cnt AS (
    SELECT COUNT(*) AS total_all FROM orders
)
SELECT 
    COUNT(CASE WHEN customer_id IS NOT NULL THEN 1 END) AS registered_customer_orders,
    COUNT(CASE WHEN customer_id IS NULL THEN 1 END) AS anonymous_walkin_orders,
    ROUND(COUNT(CASE WHEN customer_id IS NOT NULL THEN 1 END) * 100.0 / NULLIF((SELECT total_all FROM total_orders_cnt), 0), 2) AS registered_pct,
    ROUND(COUNT(CASE WHEN customer_id IS NULL THEN 1 END) * 100.0 / NULLIF((SELECT total_all FROM total_orders_cnt), 0), 2) AS anonymous_pct,
    (SELECT COUNT(*) FROM (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL GROUP BY customer_id HAVING COUNT(*) > 1) sub) AS repeat_customers_count
FROM orders;

COMMENT ON VIEW v_customer_behavior_summary IS 'Customer engagement metrics distinguishing repeat customers and walk-in sales.';
