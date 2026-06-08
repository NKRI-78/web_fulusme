// app/types/dashboard.ts
export interface Summary {
  job_id: number;
  annual_income_idr: string;
  annual_quota_idr: string;
  used_this_year_idr: string;
  paid_all_time_idr: string;
  paid_this_year_idr: string;
  remaining_quota_idr: string;
  projects_count: number;
  active_invoices: number;
}

export interface RecentTransaction {
  payment_id: number;
  project_uid: string;
  project_title: string;
  amount: number;
  payment_status: string;
  created_at: string;
  order_id: string;
  provider: string;
  invoice_status: string;
  channel_code: string;
  channel_ref?: string;
  expires_at?: string;
  payment_url?: string;
}

export interface ActiveInvoice {
  invoice_id: number;
  provider: string;
  order_id: string;
  amount: string;
  invoice_status: string;
  channel_code: string;
  channel_ref?: string;
  expires_at?: string;
  created_at: string;
  payment_url?: string;
}

export interface Portfolio {
  project_uid: string;
  project_title: string;
  funding_status: string;
  target_amount_idr: string;
  user_paid_idr: string;
  user_pending_idr: string;
  project_paid_amount_idr: string;
  project_reserved_amount_idr: string;
}

export interface MonthlyPaid {
  month: string;
  amount_idr: string;
}

export interface DashboardData {
  verified_investor: boolean;
  rek_efek: boolean;
  is_institusi: boolean;
  summary: Summary;
  recent_transactions: RecentTransaction[];
  active_invoices: ActiveInvoice[];
  portfolio: Portfolio[];
  monthly_paid: MonthlyPaid[];
}

export interface DashboardResponse {
  status: number;
  error: boolean;
  message: string;
  data: DashboardData;
}
