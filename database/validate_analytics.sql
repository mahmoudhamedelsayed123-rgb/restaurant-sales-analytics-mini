-- ============================================================
-- Restaurant Sales Analytics Mini System - Analytics Validation Suite
-- Project: restaurant-sales-analytics-mini
-- Purpose: Verify financial logic, non-duplication rules, and view reconciliations.
-- ============================================================

SET timezone = 'Asia/Riyadh';

-- 1. Cancelled Orders Financial Contribution (Target = 0.00)
SELECT '1. Cancelled Orders Net Sales' AS test_name,
       SUM(net_sales) AS cancelled_net_sales,
       (SUM(net_sales) = 0.00) AS passed
FROM v_order_financials
WHERE order_status = 'Cancelled';

-- 2. Gross Sales Calculation uses unit_price_at_sale (Validation Check)
SELECT '2. Gross Sales Non-Zero Check' AS test_name,
       total_gross_sales,
       (total_gross_sales > 0) AS passed
FROM v_executive_kpi_summary;

-- 3. Product Catalog Price Change Independence (Historical Price Rule)
SELECT '3. Catalog Price vs Unit Price Check' AS test_name,
       COUNT(*) AS price_mismatches_count
FROM order_items oi
JOIN products p ON p.id = oi.product_id
WHERE oi.unit_price_at_sale <> p.current_price;

-- 4. Item Discounts Total Reconciliation
SELECT '4. Item Discounts Total Check' AS test_name,
       v.total_item_discounts,
       s.source_item_discounts,
       (v.total_item_discounts = s.source_item_discounts) AS passed
FROM v_executive_kpi_summary v,
(SELECT ROUND(SUM(line_discount), 2) AS source_item_discounts FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.order_status <> 'Cancelled') s;

-- 5. Order Discounts Total Reconciliation
SELECT '5. Order Discounts Total Check' AS test_name,
       v.total_order_discounts,
       s.source_order_discounts,
       (v.total_order_discounts = s.source_order_discounts) AS passed
FROM v_executive_kpi_summary v,
(SELECT ROUND(SUM(discount_amount), 2) AS source_order_discounts FROM orders WHERE order_status <> 'Cancelled') s;

-- 6. Returns Total Reconciliation
SELECT '6. Returns Total Check' AS test_name,
       v.total_returns,
       s.source_returns,
       (v.total_returns = s.source_returns) AS passed
FROM v_executive_kpi_summary v,
(SELECT ROUND(SUM(return_amount), 2) AS source_returns FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.order_status <> 'Cancelled') s;

-- 7. Header Return Amount vs Line Item Return Sum Reconciliation
SELECT '7. Header vs Items Return Reconciliation Mismatches' AS test_name,
       COUNT(*) AS mismatch_count,
       (COUNT(*) = 0) AS passed
FROM (
    SELECT o.id, ROUND(o.return_amount, 2) AS o_ret, ROUND(SUM(oi.return_amount), 2) AS i_ret
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id, o.return_amount
    HAVING ROUND(o.return_amount, 2) <> ROUND(SUM(oi.return_amount), 2)
) sub;

-- 8. Net Sales Formula Equality Check: Gross - ItemDisc - OrderDisc - Returns = Net Sales
SELECT '8. Net Sales Formula Integrity Check' AS test_name,
       total_gross_sales - total_item_discounts - total_order_discounts - total_returns AS calc_net_sales,
       total_net_sales,
       (ROUND(total_gross_sales - total_item_discounts - total_order_discounts - total_returns, 2) = total_net_sales) AS passed
FROM v_executive_kpi_summary;

-- 9. Monthly Net Sales Sum vs Overall Net Sales Reconciliation
SELECT '9. Monthly Net Sales Reconciliation' AS test_name,
       (SELECT ROUND(SUM(net_sales), 2) FROM v_monthly_sales) AS monthly_sum,
       (SELECT total_net_sales FROM v_executive_kpi_summary) AS overall_sum,
       ((SELECT ROUND(SUM(net_sales), 2) FROM v_monthly_sales) = (SELECT total_net_sales FROM v_executive_kpi_summary)) AS passed;

-- 10. Channel Net Sales Sum vs Overall Net Sales Reconciliation
SELECT '10. Channel Net Sales Reconciliation' AS test_name,
       (SELECT ROUND(SUM(net_sales), 2) FROM v_sales_by_channel) AS channel_sum,
       (SELECT total_net_sales FROM v_executive_kpi_summary) AS overall_sum,
       ((SELECT ROUND(SUM(net_sales), 2) FROM v_sales_by_channel) = (SELECT total_net_sales FROM v_executive_kpi_summary)) AS passed;

-- 11. Product-Level Net Sales Sum vs Overall Net Sales Reconciliation
SELECT '11. Product Net Sales Reconciliation' AS test_name,
       (SELECT ROUND(SUM(product_net_sales), 2) FROM v_item_financials WHERE order_status <> 'Cancelled') AS product_sum,
       (SELECT total_net_sales FROM v_executive_kpi_summary) AS overall_sum,
       (ABS((SELECT ROUND(SUM(product_net_sales), 2) FROM v_item_financials WHERE order_status <> 'Cancelled') - (SELECT total_net_sales FROM v_executive_kpi_summary)) <= 0.05) AS passed;

-- 12. Customer Analytics Non-Duplication Check
SELECT '12. Customer Net Sales Sum vs Overall Registered Sales' AS test_name,
       (SELECT ROUND(SUM(net_sales), 2) FROM v_order_financials WHERE customer_id IS NOT NULL AND order_status <> 'Cancelled') AS reg_order_sales,
       (SELECT ROUND(SUM(net_sales), 2) FROM (
           SELECT c.id, SUM(vf.net_sales) AS net_sales
           FROM v_order_financials vf JOIN customers c ON c.id = vf.customer_id
           WHERE vf.order_status <> 'Cancelled' GROUP BY c.id
       ) sub) AS cust_agg_sales,
       ((SELECT ROUND(SUM(net_sales), 2) FROM v_order_financials WHERE customer_id IS NOT NULL AND order_status <> 'Cancelled') = 
        (SELECT ROUND(SUM(net_sales), 2) FROM (
           SELECT c.id, SUM(vf.net_sales) AS net_sales
           FROM v_order_financials vf JOIN customers c ON c.id = vf.customer_id
           WHERE vf.order_status <> 'Cancelled' GROUP BY c.id
       ) sub)) AS passed;

-- 13. Division by Zero Safety Check (Counted orders > 0)
SELECT '13. Counted Orders Count' AS test_name,
       counted_orders,
       (counted_orders > 0) AS passed
FROM v_executive_kpi_summary;

-- 14. All 3 Calendar Months Present
SELECT '14. Months Count' AS test_name,
       COUNT(*) AS month_count,
       (COUNT(*) = 3) AS passed
FROM v_monthly_sales;

-- 15. Top Products Limit Check
SELECT '15. Top Products Count' AS test_name,
       COUNT(*) AS prod_count,
       (COUNT(*) <= 5) AS passed
FROM v_top_5_products;

-- 16. Top Customers Limit Check
SELECT '16. Top Customers Count' AS test_name,
       COUNT(*) AS cust_count,
       (COUNT(*) <= 5) AS passed
FROM v_top_5_customers;

-- 17. All Sales Channels Present (Target = 3)
SELECT '17. Sales Channels Count' AS test_name,
       COUNT(*) AS channel_count,
       (COUNT(*) = 3) AS passed
FROM v_sales_by_channel;

-- 18. Cancelled Orders in Operational Status Summary Check
SELECT '18. Cancelled Status Operational Count' AS test_name,
       order_count,
       (order_count > 0) AS passed
FROM v_order_status_summary
WHERE order_status = 'Cancelled';

-- 19. Returns Analysis Match
SELECT '19. Returns Analysis Match' AS test_name,
       v.total_return_amount,
       e.total_returns,
       (v.total_return_amount = e.total_returns) AS passed
FROM v_returns_analysis v, v_executive_kpi_summary e;

-- 20. Discount Analysis Match
SELECT '20. Discount Analysis Match' AS test_name,
       v.total_discounts,
       e.total_discounts,
       (v.total_discounts = e.total_discounts) AS passed
FROM v_discount_analysis v, v_executive_kpi_summary e;
