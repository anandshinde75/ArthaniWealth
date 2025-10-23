import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';

export default function AssetsPage() {
  const [assets, setAssets] = useState([
    { name: 'Mutual Funds', value: 500000 },
    { name: 'Fixed Deposits', value: 200000 },
    { name: 'Stocks', value: 150000 },
  ]);

  const [liabilities, setLiabilities] = useState([
    { name: 'Home Loan', value: 400000 },
    { name: 'Credit Card', value: 20000 },
  ]);

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const [newItem, setNewItem] = useState({ type: 'asset', name: '', value: '' });

  const addItem = () => {
    if (!newItem.name || !newItem.value) return;
    const value = Number(newItem.value);
    if (newItem.type === 'asset') setAssets([...assets, { name: newItem.name, value }]);
    else setLiabilities([...liabilities, { name: newItem.name, value }]);
    setNewItem({ type: 'asset', name: '', value: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Assets & Liabilities
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="text-white" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Assets</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-2">₹{totalAssets.toLocaleString()}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingDown className="text-white" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Liabilities</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">₹{totalLiabilities.toLocaleString()}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Wallet className="text-white" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Net Worth</h3>
          <p className={`text-2xl font-bold mt-2 ${netWorth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{netWorth.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Assets List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Assets</h2>
          <ul className="space-y-2">
            {assets.map((a, idx) => (
              <li key={idx} className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-700">{a.name}</span>
                <span className="font-semibold text-emerald-600">₹{a.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Liabilities List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Liabilities</h2>
          <ul className="space-y-2">
            {liabilities.map((l, idx) => (
              <li key={idx} className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-700">{l.name}</span>
                <span className="font-semibold text-red-600">₹{l.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add New Item Section */}
      <div className="card max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Entry</h2>
        <div className="grid md:grid-cols-4 gap-4 items-center">
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="Value (₹)"
            value={newItem.value}
            onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={addItem}
            className="btn-gradient flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
