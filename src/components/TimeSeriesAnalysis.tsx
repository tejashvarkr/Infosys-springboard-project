import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { HourlyStats } from '../types';

interface Props {
  hourlyStats: HourlyStats[];
  weekdayStats: Array<{ day: string; total: number; fraud: number; fraudRate: number }>;
}

export const TimeSeriesAnalysis = ({ hourlyStats, weekdayStats }: Props) => {
  return (
    <div className="chart-container">
      <h2 className="text-2xl font-bold mb-6 text-white">Time Series Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Transaction Pattern */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Hourly Transaction Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                stroke="#9ca3af" 
                label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3498db" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                name="Total Transactions"
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="fraud" 
                stroke="#e74c3c" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                name="Fraud Cases"
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Hourly Fraud Rate */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Fraud Rate by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                stroke="#9ca3af"
                label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
              />
              <YAxis 
                stroke="#9ca3af" 
                label={{ value: 'Fraud Rate (%)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Bar dataKey="fraudRate" fill="#f39c12" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Weekday Analysis */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Transaction Pattern by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekdayStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="total" fill="#2ecc71" name="Total Transactions" animationDuration={1000} />
              <Bar dataKey="fraud" fill="#e74c3c" name="Fraud Cases" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekdayStats.map((day) => (
              <div key={day.day} className="bg-slate-700 p-3 rounded text-center">
                <p className="text-gray-400 text-xs mb-1">{day.day}</p>
                <p className="text-lg font-bold text-white">{day.total}</p>
                <p className="text-xs text-danger">{day.fraudRate.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Peak Hours Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Peak Transaction Hour</p>
          <p className="text-3xl font-bold text-primary">
            {hourlyStats.reduce((max, curr) => curr.total > max.total ? curr : max).hour}:00
          </p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Most Fraud-Prone Hour</p>
          <p className="text-3xl font-bold text-danger">
            {hourlyStats.reduce((max, curr) => curr.fraudRate > max.fraudRate ? curr : max).hour}:00
          </p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Highest Fraud Rate</p>
          <p className="text-3xl font-bold text-warning">
            {Math.max(...hourlyStats.map(h => h.fraudRate)).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};
