import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CorrelationData } from '../types';

interface Props {
  correlations: CorrelationData[];
}

export const CorrelationHeatmap = ({ correlations }: Props) => {
  // Sort by absolute correlation value
  const sortedData = [...correlations].sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  
  // Define color based on correlation strength
  const getColor = (value: number) => {
    if (value > 0.5) return '#e74c3c'; // Strong positive - Red
    if (value > 0.2) return '#f39c12'; // Moderate positive - Orange
    if (value > -0.2) return '#95a5a6'; // Weak - Gray
    if (value > -0.5) return '#3498db'; // Moderate negative - Blue
    return '#2ecc71'; // Strong negative - Green
  };
  
  return (
    <div className="chart-container">
      <h2 className="text-2xl font-bold mb-6 text-white">Feature Correlations with Fraud</h2>
      
      {/* Correlation Legend */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#e74c3c' }}></div>
            <span className="text-xs text-gray-300">Strong Positive (&gt; 0.5)</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f39c12' }}></div>
            <span className="text-xs text-gray-300">Moderate Positive (0.2-0.5)</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#95a5a6' }}></div>
            <span className="text-xs text-gray-300">Weak (-0.2 to 0.2)</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3498db' }}></div>
            <span className="text-xs text-gray-300">Moderate Negative (-0.5 to -0.2)</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2ecc71' }}></div>
            <span className="text-xs text-gray-300">Strong Negative (&lt; -0.5)</span>
          </div>
        </div>
      </div>
      
      {/* Correlation Bar Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart 
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            stroke="#9ca3af" 
            domain={[-1, 1]}
            ticks={[-1, -0.5, 0, 0.5, 1]}
            label={{ value: 'Correlation Coefficient', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
          />
          <YAxis 
            type="category" 
            dataKey="feature" 
            stroke="#9ca3af"
            width={140}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            formatter={(value: number) => value.toFixed(4)}
          />
          <Bar dataKey="correlation" animationDuration={1200}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.correlation)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Top Correlations */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-300">Top Correlations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedData.slice(0, 6).map((item) => (
            <div key={item.feature} className="stat-card">
              <p className="text-gray-400 text-xs mb-1">{item.feature}</p>
              <p 
                className="text-2xl font-bold" 
                style={{ color: getColor(item.correlation) }}
              >
                {item.correlation.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.abs(item.correlation) > 0.5 ? 'Strong' : Math.abs(item.correlation) > 0.2 ? 'Moderate' : 'Weak'} 
                {item.correlation > 0 ? ' Positive' : ' Negative'}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Key Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Strongest Correlation</p>
          <p className="text-xl font-bold text-white">{sortedData[0]?.feature}</p>
          <p className="text-2xl font-bold text-danger">{sortedData[0]?.correlation.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Total Features Analyzed</p>
          <p className="text-3xl font-bold text-primary">{correlations.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Strong Correlations</p>
          <p className="text-3xl font-bold text-warning">
            {correlations.filter(c => Math.abs(c.correlation) > 0.5).length}
          </p>
        </div>
      </div>
    </div>
  );
};
