export interface Transaction {
  transaction_id: string;
  customer_id: string;
  account_age_days: number;
  transaction_amount: number;
  timestamp: string;
  is_fraud: number;
  hour: number;
  weekday: number;
  month: number;
  is_high_value: number;
  transaction_amount_log: number;
  channel_Atm: number;
  channel_Mobile: number;
  channel_Pos: number;
  channel_Web: number;
  kyc_verified_No: number;
  kyc_verified_Yes: number;
}

export interface FraudStats {
  total: number;
  fraudulent: number;
  legitimate: number;
  fraudRate: number;
  imbalanceRatio: number;
}

export interface ChannelStats {
  name: string;
  count: number;
  fraudRate: number;
  percentage: number;
}

export interface HourlyStats {
  hour: number;
  total: number;
  fraud: number;
  fraudRate: number;
}

export interface NumericFeatureStats {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  q25: number;
  q75: number;
}

export interface CorrelationData {
  feature: string;
  correlation: number;
}
