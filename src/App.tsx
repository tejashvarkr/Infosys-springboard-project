import { useState, useEffect } from 'react';
import { FraudDistribution } from './components/FraudDistribution';
import { CategoricalFeatures } from './components/CategoricalFeatures';
import { NumericalFeatures } from './components/NumericalFeatures';
import { TimeSeriesAnalysis } from './components/TimeSeriesAnalysis';
import { CorrelationHeatmap } from './components/CorrelationHeatmap';
import {
  fetchFraudStats,
  fetchChannelStats,
  fetchHourlyStats,
  fetchWeekdayStats,
  fetchNumericalStats,
  fetchDistributions,
  fetchCorrelations,
  fetchKYCStats,
  checkBackendHealth,
} from './api/dataService';
import type { FraudStats, ChannelStats, HourlyStats, CorrelationData } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);
  
  // State for all data
  const [fraudStats, setFraudStats] = useState<FraudStats | null>(null);
  const [channelStats, setChannelStats] = useState<ChannelStats[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [weekdayStats, setWeekdayStats] = useState<any[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [numericalStats, setNumericalStats] = useState<any>(null);
  const [distributions, setDistributions] = useState<any>(null);
  const [kycStats, setKycStats] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check backend health
        const isHealthy = await checkBackendHealth();
        if (!isHealthy) {
          setBackendError(true);
          setLoading(false);
          return;
        }

        // Fetch all data in parallel
        const [
          fraud,
          channels,
          hourly,
          weekday,
          corr,
          numerical,
          dist,
          kyc,
        ] = await Promise.all([
          fetchFraudStats(),
          fetchChannelStats(),
          fetchHourlyStats(),
          fetchWeekdayStats(),
          fetchCorrelations(),
          fetchNumericalStats(),
          fetchDistributions(),
          fetchKYCStats(),
        ]);

        setFraudStats(fraud);
        setChannelStats(channels);
        setHourlyStats(hourly);
        setWeekdayStats(weekday);
        setCorrelations(corr);
        setNumericalStats(numerical);
        setDistributions(dist);
        setKycStats(kyc);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setBackendError(true);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading fraud detection data...</p>
        </div>
      </div>
    );
  }

  if (backendError || !fraudStats) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center chart-container max-w-2xl">
          <h2 className="text-3xl font-bold text-danger mb-4">⚠️ Backend Server Not Running</h2>
          <p className="text-gray-300 mb-6">
            The Flask backend server is not running or not accessible.
          </p>
          <div className="bg-slate-700 p-6 rounded-lg text-left">
            <p className="text-white font-semibold mb-2">To start the backend server:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Open a new PowerShell terminal</li>
              <li>Navigate to: <code className="bg-slate-800 px-2 py-1 rounded">fraud-detection-dashboard</code></li>
              <li>Run: <code className="bg-slate-800 px-2 py-1 rounded">.\start-backend.bat</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const transactionAmountStats = numericalStats?.transactionAmount || { fraud: {}, legitimate: {} };
  const accountAgeStats = numericalStats?.accountAge || { fraud: {}, legitimate: {} };
  const amountDistribution = distributions?.amountDistribution || [];
  const ageDistribution = distributions?.ageDistribution || [];

  const tabs = [
    { id: 'overview', label: 'Fraud Overview' },
    { id: 'categorical', label: 'Categorical Analysis' },
    { id: 'numerical', label: 'Numerical Analysis' },
    { id: 'timeseries', label: 'Time Series' },
    { id: 'correlation', label: 'Correlations' },
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Fraud Detection Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Interactive Exploratory Data Analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-primary">{fraudStats.total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Fraud Rate</p>
                <p className="text-2xl font-bold text-danger">{fraudStats.fraudRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <FraudDistribution stats={fraudStats} />
        )}
        
        {activeTab === 'categorical' && (
          <CategoricalFeatures channelStats={channelStats} kycStats={kycStats} />
        )}
        
        {activeTab === 'numerical' && (
          <NumericalFeatures
            transactionAmountStats={transactionAmountStats}
            accountAgeStats={accountAgeStats}
            amountDistribution={amountDistribution}
            ageDistribution={ageDistribution}
          />
        )}
        
        {activeTab === 'timeseries' && (
          <TimeSeriesAnalysis hourlyStats={hourlyStats} weekdayStats={weekdayStats} />
        )}
        
        {activeTab === 'correlation' && (
          <CorrelationHeatmap correlations={correlations} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-400 text-sm">
            Fraud Detection Dashboard © 2024 | Built with React + TypeScript + Recharts
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
