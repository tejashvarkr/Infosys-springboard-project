import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { FraudStats } from '../types';

interface Props {
  stats: FraudStats;
}

const COLORS = ['#2ecc71', '#e74c3c'];

export const FraudDistribution = ({ stats }: Props) => {
  const pieData = [
    { name: 'Legitimate', value: stats.legitimate },
    { name: 'Fraudulent', value: stats.fraudulent },
  ];
  
  const barData = [
    { name: 'Legitimate', value: stats.legitimate, color: '#2ecc71' },
    { name: 'Fraud', value: stats.fraudulent, color: '#e74c3c' },
  ];
  
  return (
    <div className="chart-container">
      <h2 className="text-2xl font-bold mb-6 text-white">Fraud Distribution</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Total Transactions</p>
          <p className="text-4xl font-bold text-white">{stats.total.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Fraud Rate</p>
          <p className="text-4xl font-bold text-danger">{stats.fraudRate.toFixed(2)}%</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Fraudulent Transactions</p>
          <p className="text-3xl font-bold text-danger">{stats.fraudulent.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Class Imbalance Ratio</p>
          <p className="text-3xl font-bold text-info">1:{stats.imbalanceRatio.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Distribution Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Count Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="value" fill="#3498db" animationDuration={1000}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
