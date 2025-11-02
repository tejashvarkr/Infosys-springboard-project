import type { Transaction, FraudStats, ChannelStats, HourlyStats, NumericFeatureStats, CorrelationData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE_URL}/transactions`);
  const data = await response.json();
  return data.transactions;
};

export const fetchFraudStats = async (): Promise<FraudStats> => {
  const response = await fetch(`${API_BASE_URL}/stats/fraud`);
  return await response.json();
};

export const fetchChannelStats = async (): Promise<ChannelStats[]> => {
  const response = await fetch(`${API_BASE_URL}/stats/channels`);
  return await response.json();
};

export const fetchHourlyStats = async (): Promise<HourlyStats[]> => {
  const response = await fetch(`${API_BASE_URL}/stats/hourly`);
  return await response.json();
};

export const fetchWeekdayStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/weekday`);
  return await response.json();
};

export const fetchNumericalStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/numerical`);
  return await response.json();
};

export const fetchDistributions = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/distributions`);
  return await response.json();
};

export const fetchCorrelations = async (): Promise<CorrelationData[]> => {
  const response = await fetch(`${API_BASE_URL}/stats/correlations`);
  return await response.json();
};

export const fetchKYCStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/kyc`);
  return await response.json();
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};
