import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import type { NumericFeatureStats } from '../types';
import { formatCurrency, formatNumber } from '../utils/dataProcessing';

interface Props {
  transactionAmountStats: {
    fraud: NumericFeatureStats;
    legitimate: NumericFeatureStats;
  };
  accountAgeStats: {
    fraud: NumericFeatureStats;
    legitimate: NumericFeatureStats;
  };
  amountDistribution: Array<{ range: string; fraud: number; legitimate: number }>;
  ageDistribution: Array<{ range: string; fraud: number; legitimate: number }>;
}

export const NumericalFeatures = ({ 
  transactionAmountStats, 
  accountAgeStats,
  amountDistribution,
  ageDistribution 
}: Props) => {
  return (
    <div className="chart-container">
      <h2 className="text-2xl font-bold mb-6 text-white">Numerical Features Analysis</h2>
      
      {/* Transaction Amount Statistics */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-300">Transaction Amount Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Fraud Mean</p>
            <p className="text-lg font-bold text-danger">{formatCurrency(transactionAmountStats.fraud.mean)}</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Legit Mean</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(transactionAmountStats.legitimate.mean)}</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Fraud Median</p>
            <p className="text-lg font-bold text-danger">{formatCurrency(transactionAmountStats.fraud.median)}</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Legit Median</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(transactionAmountStats.legitimate.median)}</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Fraud Q1</p>
            <p className="text-sm font-semibold text-white">{formatCurrency(transactionAmountStats.fraud.q25)}</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Fraud Q3</p>
            <p className="text-sm font-semibold text-white">{formatCurrency(transactionAmountStats.fraud.q75)}</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Fraud Std Dev</p>
            <p className="text-sm font-semibold text-warning">{formatCurrency(transactionAmountStats.fraud.std)}</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Legit Std Dev</p>
            <p className="text-sm font-semibold text-info">{formatCurrency(transactionAmountStats.legitimate.std)}</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={amountDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="range" 
              stroke="#9ca3af" 
              angle={-45} 
              textAnchor="end" 
              height={100}
            />
            <YAxis 
              stroke="#9ca3af"
              label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Legend />
            <Bar dataKey="legitimate" fill="#2ecc71" name="Legitimate" animationDuration={1000} />
            <Bar dataKey="fraud" fill="#e74c3c" name="Fraud" animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Account Age Statistics */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-300">Account Age Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Fraud Mean Age</p>
            <p className="text-lg font-bold text-danger">{formatNumber(accountAgeStats.fraud.mean)} days</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Legit Mean Age</p>
            <p className="text-lg font-bold text-primary">{formatNumber(accountAgeStats.legitimate.mean)} days</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Fraud Median Age</p>
            <p className="text-lg font-bold text-danger">{formatNumber(accountAgeStats.fraud.median)} days</p>
          </div>
          <div className="stat-card">
            <p className="text-gray-400 text-xs mb-1">Legit Median Age</p>
            <p className="text-lg font-bold text-primary">{formatNumber(accountAgeStats.legitimate.median)} days</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={ageDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="range" 
              stroke="#9ca3af"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#9ca3af"
              label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="legitimate" 
              stackId="1" 
              stroke="#2ecc71" 
              fill="#2ecc71" 
              name="Legitimate"
              animationDuration={1200}
            />
            <Area 
              type="monotone" 
              dataKey="fraud" 
              stackId="1" 
              stroke="#e74c3c" 
              fill="#e74c3c" 
              name="Fraud"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Amount Difference</p>
          <p className="text-2xl font-bold text-warning">
            {formatCurrency(Math.abs(transactionAmountStats.fraud.mean - transactionAmountStats.legitimate.mean))}
          </p>
          <p className="text-xs text-gray-500 mt-1">Fraud vs Legitimate Mean</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Age Difference</p>
          <p className="text-2xl font-bold text-info">
            {formatNumber(Math.abs(accountAgeStats.fraud.mean - accountAgeStats.legitimate.mean))} days
          </p>
          <p className="text-xs text-gray-500 mt-1">Fraud vs Legitimate Mean</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Fraud Amount Range</p>
          <p className="text-xl font-bold text-danger">
            {formatCurrency(transactionAmountStats.fraud.min)} - {formatCurrency(transactionAmountStats.fraud.max)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Min to Max</p>
        </div>
      </div>
    </div>
  );
};
