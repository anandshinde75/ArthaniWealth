import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, PlusCircle, TrendingUp } from 'lucide-react';

interface Entry {
  name: string;
  amount: number;
  type: 'income' | 'expense';
}

export default function IncomePage() {
  const [entries, setEntries] = useState<Entry[]>([
    { name: 'Salary', amount: 80000, type: 'income' },
    { name: 'Rent', amount: 20000, type: 'expense' },
    { name: 'Groceries', amount: 8000, type: 'expense' },
  ]);

  const [newEntry, setNewEntry] = useState<Entry>({ name: '', amount: 0, type: 'income' });

  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netSavings = totalIncome - totalExpense;

  const addEntry = () => {
    if (!newEntry.name || newEntry.amount <= 0) return;
    setEntries([...entries, newEntry]);
    setNewEntry({ name: '', amount: 0, type: 'income' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Income & Expenses Tracker
      </h1>

      {/* Summary Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ArrowUpCircle className="text-white" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Income</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-2">₹{totalIncome.toLocaleString()}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ArrowDownCircle className="text-white" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">₹{totalExpense.toLocaleString()}</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="text-white" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Net Savings</h3>
          <p className={`text-2xl font-bold mt-2 ${netSavings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{netSavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Income & Expense Table */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Transactions</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-emerald-50 text-emerald-800">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4 text-center">Type</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-700">{entry.name}</td>
                <td className="py-3 px-4 text-right font-semibold">
                  {entry.type === 'income' ? (
                    <span className="text-emerald-600">+₹{entry.amount.toLocaleString()}</span>
                  ) : (
                    <span className="text-red-600">-₹{entry.amount.toLocaleString()}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center capitalize text-gray-600">{entry.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Entry Section */}
      <div className="card max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Transaction</h2>
        <div className="grid md:grid-cols-4 gap-4 items-center">
          <select
            value={newEntry.type}
            onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as 'income' | 'expense' })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={newEntry.name}
            onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={newEntry.amount || ''}
            onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={addEntry}
            className="btn-gradient flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
