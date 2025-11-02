import type { Transaction, FraudStats, ChannelStats, HourlyStats, NumericFeatureStats, CorrelationData } from '../types';

export const calculateFraudStats = (data: Transaction[]): FraudStats => {
  const fraudulent = data.filter(t => t.is_fraud === 1).length;
  const legitimate = data.length - fraudulent;
  const fraudRate = (fraudulent / data.length) * 100;
  const imbalanceRatio = legitimate / fraudulent;
  
  return {
    total: data.length,
    fraudulent,
    legitimate,
    fraudRate,
    imbalanceRatio,
  };
};

export const calculateChannelStats = (data: Transaction[]): ChannelStats[] => {
  const channels = [
    { key: 'channel_Atm', name: 'ATM' },
    { key: 'channel_Mobile', name: 'Mobile' },
    { key: 'channel_Pos', name: 'POS' },
    { key: 'channel_Web', name: 'Web' },
  ];
  
  return channels.map(channel => {
    const channelData = data.filter(t => t[channel.key as keyof Transaction] === 1);
    const count = channelData.length;
    const fraudCount = channelData.filter(t => t.is_fraud === 1).length;
    const fraudRate = (fraudCount / count) * 100;
    const percentage = (count / data.length) * 100;
    
    return {
      name: channel.name,
      count,
      fraudRate,
      percentage,
    };
  });
};

export const calculateHourlyStats = (data: Transaction[]): HourlyStats[] => {
  const hourlyData: { [key: number]: { total: number; fraud: number } } = {};
  
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { total: 0, fraud: 0 };
  }
  
  data.forEach(t => {
    hourlyData[t.hour].total++;
    if (t.is_fraud === 1) {
      hourlyData[t.hour].fraud++;
    }
  });
  
  return Object.entries(hourlyData).map(([hour, stats]) => ({
    hour: parseInt(hour),
    total: stats.total,
    fraud: stats.fraud,
    fraudRate: (stats.fraud / stats.total) * 100,
  }));
};

export const calculateWeekdayStats = (data: Transaction[]) => {
  const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekdayData: { [key: number]: { total: number; fraud: number } } = {};
  
  for (let i = 0; i < 7; i++) {
    weekdayData[i] = { total: 0, fraud: 0 };
  }
  
  data.forEach(t => {
    weekdayData[t.weekday].total++;
    if (t.is_fraud === 1) {
      weekdayData[t.weekday].fraud++;
    }
  });
  
  return Object.entries(weekdayData).map(([day, stats]) => ({
    day: weekdayNames[parseInt(day)],
    total: stats.total,
    fraud: stats.fraud,
    fraudRate: (stats.fraud / stats.total) * 100,
  }));
};

export const calculateNumericStats = (values: number[]): NumericFeatureStats => {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  
  const q25Index = Math.floor(n * 0.25);
  const q75Index = Math.floor(n * 0.75);
  
  return {
    mean,
    median,
    std,
    min: sorted[0],
    max: sorted[n - 1],
    q25: sorted[q25Index],
    q75: sorted[q75Index],
  };
};

export const calculateCorrelations = (data: Transaction[]): CorrelationData[] => {
  const features = [
    { key: 'transaction_amount', name: 'Transaction Amount' },
    { key: 'is_high_value', name: 'High Value' },
    { key: 'transaction_amount_log', name: 'Amount (Log)' },
    { key: 'account_age_days', name: 'Account Age' },
    { key: 'hour', name: 'Hour' },
    { key: 'weekday', name: 'Weekday' },
  ];
  
  const fraudValues = data.map(t => t.is_fraud);
  
  return features.map(feature => {
    const featureValues = data.map(t => t[feature.key as keyof Transaction] as number);
    const correlation = calculatePearsonCorrelation(featureValues, fraudValues);
    
    return {
      feature: feature.name,
      correlation,
    };
  });
};

const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

export const calculateAmountDistribution = (transactions: Transaction[]) => {
  const ranges = [
    { label: '$0-10K', min: 0, max: 10000 },
    { label: '$10K-25K', min: 10000, max: 25000 },
    { label: '$25K-50K', min: 25000, max: 50000 },
    { label: '$50K-100K', min: 50000, max: 100000 },
    { label: '$100K-150K', min: 100000, max: 150000 },
    { label: '$150K+', min: 150000, max: Infinity },
  ];

  return ranges.map(range => {
    const inRange = transactions.filter(
      t => t.transaction_amount >= range.min && t.transaction_amount < range.max
    );
    return {
      range: range.label,
      fraud: inRange.filter(t => t.is_fraud === 1).length,
      legitimate: inRange.filter(t => t.is_fraud === 0).length,
    };
  });
};

export const calculateAgeDistribution = (transactions: Transaction[]) => {
  const ranges = [
    { label: '0-180 days', min: 0, max: 180 },
    { label: '180-365 days', min: 180, max: 365 },
    { label: '1-2 years', min: 365, max: 730 },
    { label: '2-3 years', min: 730, max: 1095 },
    { label: '3-5 years', min: 1095, max: 1825 },
    { label: '5+ years', min: 1825, max: Infinity },
  ];

  return ranges.map(range => {
    const inRange = transactions.filter(
      t => t.account_age_days >= range.min && t.account_age_days < range.max
    );
    return {
      range: range.label,
      fraud: inRange.filter(t => t.is_fraud === 1).length,
      legitimate: inRange.filter(t => t.is_fraud === 0).length,
    };
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
