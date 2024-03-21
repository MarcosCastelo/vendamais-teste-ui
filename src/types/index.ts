export interface Transaction {
  id: number;
  transaction_type: string;
  source_account: { id: number, balance: number };
  destination_account: string;
  amount: number;
  created_at: string;
}

export interface Report {
  transactions: Transaction[];
  balance: number;
  total_in: number;
  total_out: number;
}
