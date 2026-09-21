export interface ExecutiveKpiSummary {
  total_gross_sales: number;
  total_item_discounts: number;
  total_order_discounts: number;
  total_discounts: number;
  total_returns: number;
  total_net_sales: number;
  counted_orders: number;
  average_order_value: number;
}

export interface MonthlySales {
  yr_month: string;
  gross_sales: number;
  total_discounts: number;
  returns: number;
  net_sales: number;
  counted_orders: number;
  average_order_value: number;
  prev_month_net_sales: number | null;
  growth_amount: number | null;
  mom_growth_pct: number | null;
}

export interface TopProduct {
  product_name: string;
  category: string;
  quantity_sold: number;
  returned_quantity: number;
  gross_sales: number;
  item_discounts: number;
  allocated_order_discounts: number;
  returns: number;
  product_net_sales: number;
  order_count: number;
}

export interface SalesChannel {
  sales_channel: string;
  counted_orders: number;
  gross_sales: number;
  discounts: number;
  returns: number;
  net_sales: number;
  average_order_value: number;
  pct_of_net_sales: number;
}

export interface DayOfWeekSales {
  day_name: string;
  day_number: number;
  counted_orders: number;
  net_sales: number;
  average_order_value: number;
}

export interface OrderStatusSummary {
  order_status: string;
  order_count: number;
  pct_of_total_orders: number;
}

export interface ReturnsAnalysis {
  orders_with_returns: number;
  full_return_orders: number;
  partial_return_orders: number;
  total_return_amount: number;
  return_rate_pct_of_gross: number;
}

export interface DiscountAnalysis {
  orders_with_item_discounts: number;
  orders_with_order_discounts: number;
  total_item_discounts: number;
  total_order_discounts: number;
  total_discounts: number;
  discount_rate_pct_of_gross: number;
}

export interface TopCustomer {
  customer_name: string;
  city: string;
  counted_orders: number;
  gross_sales: number;
  discounts: number;
  returns: number;
  net_sales: number;
  average_order_value: number;
}

export interface CustomerBehaviorSummary {
  registered_customer_orders: number;
  anonymous_walkin_orders: number;
  registered_pct: number;
  anonymous_pct: number;
  repeat_customers_count: number;
}

export interface DashboardData {
  executiveKpis: ExecutiveKpiSummary;
  monthlySales: MonthlySales[];
  topProducts: TopProduct[];
  salesChannels: SalesChannel[];
  dayOfWeekSales: DayOfWeekSales[];
  orderStatusSummary: OrderStatusSummary[];
  returnsAnalysis: ReturnsAnalysis;
  discountAnalysis: DiscountAnalysis;
  topCustomers: TopCustomer[];
  customerBehavior: CustomerBehaviorSummary;
  isLiveSupabase: boolean;
}
