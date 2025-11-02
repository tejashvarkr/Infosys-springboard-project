import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ChannelStats } from '../types';

interface Props {
  channelStats: ChannelStats[];
  kycStats: { name: string; fraudRate: number; count: number }[];
}

const CHANNEL_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];

export const CategoricalFeatures = ({ channelStats, kycStats }: Props) => {
  return (
    <div className="chart-container">
      <h2 className="text-2xl font-bold mb-6 text-white">Categorical Features Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Distribution */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Transaction by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Bar dataKey="count" fill="#3498db" animationDuration={1000}>
                {channelStats.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            {channelStats.map((channel) => (
              <div key={channel.name} className="bg-slate-700 p-3 rounded">
                <p className="text-gray-400 text-xs">{channel.name}</p>
                <p className="text-lg font-bold text-white">{channel.count.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{channel.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fraud Rate by Channel */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Fraud Rate by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" label={{ value: 'Fraud Rate (%)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Bar dataKey="fraudRate" fill="#e74c3c" animationDuration={1000}>
                {channelStats.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {channelStats.map((channel) => (
              <div key={channel.name} className="flex justify-between items-center bg-slate-700 p-3 rounded">
                <span className="text-gray-300">{channel.name}</span>
                <span className="text-danger font-bold">{channel.fraudRate.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* KYC Analysis */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">KYC Verification Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={kycStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e7eb' }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Bar dataKey="count" fill="#2ecc71" animationDuration={1000}>
                  <Cell fill="#e74c3c" />
                  <Cell fill="#2ecc71" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {kycStats.map((kyc) => (
                <div key={kyc.name} className="stat-card">
                  <p className="text-gray-400 text-sm">KYC {kyc.name}</p>
                  <p className="text-3xl font-bold text-white">{kyc.count.toLocaleString()}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Fraud Rate</p>
                    <p className="text-xl font-bold text-danger">{kyc.fraudRate.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
