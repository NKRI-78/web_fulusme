export interface InvestorData {
  verified_investor: boolean;
  rek_efek: boolean;
  is_institusi: boolean;
  summary: InvestorDataSummary;
  recent_transactions: RecentTransaction[];
  active_invoices: any[];
  portfolio: InvestorDataPortfolio[];
  monthly_paid: InvestorDataMonthlyPaid[];
}

export interface InvestorDataSummary {
  job_id: number;
  annual_income_idr: number;
  annual_quota_idr: number;
  used_this_year_idr: number;
  paid_all_time_idr: number;
  paid_this_year_idr: number;
  remaining_quota_idr: number;
  projects_count: number;
  active_invoices: number;
  quota_enforced: boolean;
}

export interface InvestorDataPortfolio {
  project_uid: string;
  project_title: string;
  funding_status: string;
  target_amount: number;
  user_paid_idr: number;
  user_pending_idr: number;
  project_paid_amount_idr: number;
  project_reserved_amount_idr: number;
  recent_transactions: RecentTransaction[];
}

export interface RecentTransaction {
  payment_id: number;
  project_uid: string;
  project_title: string;
  amount: number;
  payment_status: string;
  created_at: string;
  paid_at: string;
  order_id: string;
  provider: string;
  invoice_status: string;
  channel_code: string;
  expires_at: string;
  payment_url: string;
}

export interface InvestorDataMonthlyPaid {
  month: string;
  amount_idr: number;
}
