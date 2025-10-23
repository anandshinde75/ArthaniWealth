import React, { useState } from 'react';

export default function CalculatorsPage() {
  const [loanData, setLoanData] = useState({ amount: 100000, rate: 10, tenure: 5 });

  const calculateLoan = () => {
    const P = loanData.amount;
    const r = loanData.rate / 12 / 100;
    const n = loanData.tenure * 12;
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = EMI * n;
    const interest = total - P;
    return { EMI: EMI.toFixed(2), total: total.toFixed(2), interest: interest.toFixed(2) };
  };

  const loanResult = calculateLoan();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Financial Calculators</h1>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Loan EMI Calculator</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Loan Amount (₹)</label>
              <input
                type="number"
                value={loanData.amount}
                onChange={(e) => setLoanData({ ...loanData, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={loanData.rate}
                onChange={(e) => setLoanData({ ...loanData, rate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Tenure (Years)</label>
              <input
                type="number"
                value={loanData.tenure}
                onChange={(e) => setLoanData({ ...loanData, tenure: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly EMI:</span>
                <span className="font-bold text-emerald-600">₹{loanResult.EMI}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payment:</span>
                <span className="font-bold text-gray-800">₹{loanResult.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-bold text-teal-600">₹{loanResult.interest}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
