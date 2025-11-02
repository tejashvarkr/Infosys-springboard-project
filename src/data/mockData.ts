import type { Transaction } from '../types';

// Generate mock transaction data based on EDA statistics
export const generateMockData = (): Transaction[] => {
  const data: Transaction[] = [];
  const fraudCount = 432;
  const totalCount = 5000;
  
  for (let i = 0; i < totalCount; i++) {
    const isFraud = i < fraudCount ? 1 : 0;
    const hour = Math.floor(Math.random() * 24);
    const weekday = Math.floor(Math.random() * 7);
    
    // Generate transaction amount based on fraud status
    const transactionAmount = isFraud
      ? Math.floor(Math.random() * 200000) + 50000 // Higher amounts for fraud
      : Math.floor(Math.random() * 100000) + 1000; // Lower amounts for legitimate
    
    // Determine channel (one-hot encoded)
    const channelRand = Math.random();
    const channel = {
      Atm: channelRand < 0.098 ? 1 : 0,
      Mobile: channelRand >= 0.098 && channelRand < 0.496 ? 1 : 0,
      Pos: channelRand >= 0.496 && channelRand < 0.653 ? 1 : 0,
      Web: channelRand >= 0.653 ? 1 : 0,
    };
    
    // Determine KYC status (one-hot encoded)
    const kycRand = Math.random();
    const kyc = {
      No: isFraud && kycRand < 0.3 ? 1 : (kycRand < 0.158 ? 1 : 0),
      Yes: 0,
    };
    kyc.Yes = kyc.No === 0 ? 1 : 0;
    
    data.push({
      transaction_id: `TXN_${200000 + i}`,
      customer_id: `CUST_${Math.floor(Math.random() * 800)}`,
      account_age_days: Math.floor(Math.random() * 2990) + 10,
      transaction_amount: transactionAmount,
      timestamp: `2025-08-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      is_fraud: isFraud,
      hour,
      weekday,
      month: 8,
      is_high_value: transactionAmount > 100000 ? 1 : 0,
      transaction_amount_log: Math.log(transactionAmount),
      channel_Atm: channel.Atm,
      channel_Mobile: channel.Mobile,
      channel_Pos: channel.Pos,
      channel_Web: channel.Web,
      kyc_verified_No: kyc.No,
      kyc_verified_Yes: kyc.Yes,
    });
  }
  
  return data;
};

export const mockTransactions = generateMockData();
