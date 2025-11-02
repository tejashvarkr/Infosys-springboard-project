from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json

# Custom JSON encoder to handle NaN values
class NaNJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
            return 0.0
        return super().default(obj)

app = Flask(__name__)
app.json_encoder = NaNJSONEncoder
CORS(app)  # Enable CORS for React frontend

# Load the real CSV data
print("Loading transactions_clean.csv...")
df = pd.read_csv('transactions_clean.csv')
print(f"✅ Loaded {len(df)} transactions")

# Convert DataFrame to list of dictionaries for JSON serialization
transactions_data = df.to_dict('records')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Backend server is running',
        'total_transactions': len(df)
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transaction data"""
    return jsonify({
        'transactions': transactions_data,
        'count': len(transactions_data)
    })

@app.route('/api/stats/fraud', methods=['GET'])
def get_fraud_stats():
    """Calculate fraud statistics"""
    total = len(df)
    fraudulent = int(df['is_fraud'].sum())
    legitimate = total - fraudulent
    fraud_rate = (fraudulent / total * 100) if total > 0 else 0
    imbalance_ratio = (legitimate / fraudulent) if fraudulent > 0 else 0
    
    return jsonify({
        'total': total,
        'fraudulent': fraudulent,
        'legitimate': legitimate,
        'fraudRate': round(fraud_rate, 2),
        'imbalanceRatio': round(imbalance_ratio, 2)
    })

@app.route('/api/stats/channels', methods=['GET'])
def get_channel_stats():
    """Calculate channel statistics"""
    channels = []
    channel_cols = ['channel_Atm', 'channel_Mobile', 'channel_Pos', 'channel_Web']
    channel_names = ['ATM', 'Mobile', 'POS', 'Web']
    
    for col, name in zip(channel_cols, channel_names):
        channel_data = df[df[col] == 1]
        count = len(channel_data)
        fraud_count = int(channel_data['is_fraud'].sum())
        fraud_rate = (fraud_count / count * 100) if count > 0 else 0
        percentage = (count / len(df) * 100) if len(df) > 0 else 0
        
        channels.append({
            'name': name,
            'count': count,
            'fraudRate': round(fraud_rate, 2),
            'percentage': round(percentage, 2)
        })
    
    return jsonify(channels)

@app.route('/api/stats/hourly', methods=['GET'])
def get_hourly_stats():
    """Calculate hourly statistics"""
    hourly_stats = []
    
    for hour in range(24):
        hour_data = df[df['hour'] == hour]
        total = len(hour_data)
        fraud = int(hour_data['is_fraud'].sum())
        fraud_rate = (fraud / total * 100) if total > 0 else 0
        
        hourly_stats.append({
            'hour': hour,
            'total': total,
            'fraud': fraud,
            'fraudRate': round(fraud_rate, 2)
        })
    
    return jsonify(hourly_stats)

@app.route('/api/stats/weekday', methods=['GET'])
def get_weekday_stats():
    """Calculate weekday statistics"""
    weekday_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekday_stats = []
    
    for day_num in range(7):
        day_data = df[df['weekday'] == day_num]
        total = len(day_data)
        fraud = int(day_data['is_fraud'].sum())
        fraud_rate = (fraud / total * 100) if total > 0 else 0
        
        weekday_stats.append({
            'day': weekday_names[day_num],
            'total': total,
            'fraud': fraud,
            'fraudRate': round(fraud_rate, 2)
        })
    
    return jsonify(weekday_stats)

@app.route('/api/stats/numerical', methods=['GET'])
def get_numerical_stats():
    """Calculate numerical feature statistics"""
    fraud_df = df[df['is_fraud'] == 1]
    legit_df = df[df['is_fraud'] == 0]
    
    def calc_stats(values):
        # Remove NaN values
        clean_values = values[~np.isnan(values)]
        if len(clean_values) == 0:
            return {
                'mean': 0, 'median': 0, 'std': 0,
                'min': 0, 'max': 0, 'q25': 0, 'q75': 0
            }
        
        sorted_vals = np.sort(clean_values)
        return {
            'mean': round(float(np.mean(clean_values)), 2),
            'median': round(float(np.median(clean_values)), 2),
            'std': round(float(np.std(clean_values)), 2),
            'min': round(float(np.min(clean_values)), 2),
            'max': round(float(np.max(clean_values)), 2),
            'q25': round(float(np.percentile(clean_values, 25)), 2),
            'q75': round(float(np.percentile(clean_values, 75)), 2)
        }
    
    return jsonify({
        'transactionAmount': {
            'fraud': calc_stats(fraud_df['transaction_amount'].values),
            'legitimate': calc_stats(legit_df['transaction_amount'].values)
        },
        'accountAge': {
            'fraud': calc_stats(fraud_df['account_age_days'].values),
            'legitimate': calc_stats(legit_df['account_age_days'].values)
        }
    })

@app.route('/api/stats/distributions', methods=['GET'])
def get_distributions():
    """Calculate distribution data for histograms"""
    fraud_df = df[df['is_fraud'] == 1]
    legit_df = df[df['is_fraud'] == 0]
    
    # Transaction amount distribution
    amount_ranges = [
        {'label': '$0-10K', 'min': 0, 'max': 10000},
        {'label': '$10K-25K', 'min': 10000, 'max': 25000},
        {'label': '$25K-50K', 'min': 25000, 'max': 50000},
        {'label': '$50K-100K', 'min': 50000, 'max': 100000},
        {'label': '$100K-150K', 'min': 100000, 'max': 150000},
        {'label': '$150K+', 'min': 150000, 'max': float('inf')}
    ]
    
    amount_dist = []
    for rng in amount_ranges:
        fraud_count = len(fraud_df[(fraud_df['transaction_amount'] >= rng['min']) & 
                                   (fraud_df['transaction_amount'] < rng['max'])])
        legit_count = len(legit_df[(legit_df['transaction_amount'] >= rng['min']) & 
                                   (legit_df['transaction_amount'] < rng['max'])])
        amount_dist.append({
            'range': rng['label'],
            'fraud': fraud_count,
            'legitimate': legit_count
        })
    
    # Account age distribution
    age_ranges = [
        {'label': '0-180 days', 'min': 0, 'max': 180},
        {'label': '180-365 days', 'min': 180, 'max': 365},
        {'label': '1-2 years', 'min': 365, 'max': 730},
        {'label': '2-3 years', 'min': 730, 'max': 1095},
        {'label': '3-5 years', 'min': 1095, 'max': 1825},
        {'label': '5+ years', 'min': 1825, 'max': float('inf')}
    ]
    
    age_dist = []
    for rng in age_ranges:
        fraud_count = len(fraud_df[(fraud_df['account_age_days'] >= rng['min']) & 
                                  (fraud_df['account_age_days'] < rng['max'])])
        legit_count = len(legit_df[(legit_df['account_age_days'] >= rng['min']) & 
                                  (legit_df['account_age_days'] < rng['max'])])
        age_dist.append({
            'range': rng['label'],
            'fraud': fraud_count,
            'legitimate': legit_count
        })
    
    return jsonify({
        'amountDistribution': amount_dist,
        'ageDistribution': age_dist
    })

@app.route('/api/stats/correlations', methods=['GET'])
def get_correlations():
    """Calculate feature correlations with fraud"""
    # Select numerical and binary features
    feature_cols = [
        'transaction_amount', 'account_age_days', 'hour', 'weekday', 'month',
        'is_high_value', 'transaction_amount_log',
        'channel_Atm', 'channel_Mobile', 'channel_Pos', 'channel_Web',
        'kyc_verified_No', 'kyc_verified_Yes'
    ]
    
    correlations = []
    for col in feature_cols:
        if col in df.columns:
            corr = df[col].corr(df['is_fraud'])
            # Handle NaN values - replace with 0
            if pd.isna(corr):
                corr = 0.0
            correlations.append({
                'feature': col,
                'correlation': round(float(corr), 4)
            })
    
    return jsonify(correlations)

@app.route('/api/stats/kyc', methods=['GET'])
def get_kyc_stats():
    """Calculate KYC verification statistics"""
    kyc_verified = df[df['kyc_verified_Yes'] == 1]
    kyc_not_verified = df[df['kyc_verified_No'] == 1]
    
    stats = [
        {
            'name': 'KYC Verified',
            'count': len(kyc_verified),
            'fraudRate': round((kyc_verified['is_fraud'].sum() / len(kyc_verified) * 100) if len(kyc_verified) > 0 else 0, 2),
            'percentage': round((len(kyc_verified) / len(df) * 100) if len(df) > 0 else 0, 2)
        },
        {
            'name': 'KYC Not Verified',
            'count': len(kyc_not_verified),
            'fraudRate': round((kyc_not_verified['is_fraud'].sum() / len(kyc_not_verified) * 100) if len(kyc_not_verified) > 0 else 0, 2),
            'percentage': round((len(kyc_not_verified) / len(df) * 100) if len(df) > 0 else 0, 2)
        }
    ]
    
    return jsonify(stats)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Fraud Detection Backend Server")
    print("="*60)
    print(f"📊 Dataset: {len(df)} transactions loaded")
    print(f"🔴 Fraud cases: {df['is_fraud'].sum()}")
    print(f"🟢 Legitimate: {len(df) - df['is_fraud'].sum()}")
    print(f"📈 Fraud rate: {(df['is_fraud'].sum() / len(df) * 100):.2f}%")
    print("="*60)
    print("🌐 Server running on: http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
