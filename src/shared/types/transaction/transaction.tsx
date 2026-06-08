export interface ContractLetter {
  path: string;
}

export interface Investor {
  id: string;
  fullname: string;
  email: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface TransactionItem {
  payment_id: number;
  project_id: string;
  project_title: string;
  amount: number;
  payment_status: string;
  created_at: string;
  paid_at: string;
  contract_letter: ContractLetter;
  investor: Investor;
  company: Company;
  order_id: string;
  provider: string;
  invoice_status: string;
  channel_code: string;
  expires_at: string;
}

export interface TransactionResponse {
  status: number;
  error: boolean;
  message: string;
  data: {
    items: TransactionItem[];
    page: number;
    per_page: number;
    total_items: number;
  };
}
