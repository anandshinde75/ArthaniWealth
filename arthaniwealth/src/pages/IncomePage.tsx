/*import React from 'react';

export default function IncomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Income & Expenses</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <p className="text-gray-600">Income tracker coming soon!</p>
      </div>
    </div>
  );
}*/

import React, { useState, useMemo } from 'react';
import { Plus, X, Edit2, Check, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

// --- Types ---
type TransactionItem = {
  id: string;
  name: string;
  value: number; // Amount
  type: 'income' | 'expense';
};

type TransactionsData = TransactionItem[];

type ActiveEdit = {
    id: string;
    value: number;
    name: string;
};

// --- Utility Functions ---
const formatCurrency = (value: number) => `₹${Math.abs(Math.round(value)).toLocaleString('en-IN')}`;


// --- React Component ---
export default function IncomeExpensesPage() {
  // Use a single array for all transactions
  const [transactions, setTransactions] = useState<TransactionsData>([]);
  const [activeEdit, setActiveEdit] = useState<ActiveEdit | null>(null);
  
  // Input states for adding new items
  const [newItemType, setNewItemType] = useState<'income' | 'expense'>('income');
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState<string | ''>(''); 


  // --- Calculation Logic ---
  const { totalIncome, totalExpenses, netFlow, incomeList, expenseList } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income');
    const expense = transactions.filter(t => t.type === 'expense');

    const totalI = income.reduce((sum, item) => sum + item.value, 0);
    const totalE = expense.reduce((sum, item) => sum + item.value, 0);
    const netF = totalI - totalE;
    
    return {
      totalIncome: totalI,
      totalExpenses: totalE,
      netFlow: netF,
      incomeList: income,
      expenseList: expense,
    };
  }, [transactions]);

  // --- Handlers for Adding/Editing/Deleting ---

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string input to number for validation and storage
    const valueAsNumber = parseFloat(newItemValue.toString());
    
    if (!newItemName || newItemValue === '' || isNaN(valueAsNumber) || valueAsNumber <= 0) {
        console.error("Invalid input for new item.");
        return;
    }

    const newItem: TransactionItem = {
      id: crypto.randomUUID(), 
      name: newItemName.trim(),
      value: valueAsNumber,
      type: newItemType,
    };

    setTransactions(prev => [...prev, newItem]);

    // Reset inputs
    setNewItemName('');
    setNewItemValue('');
  };

  const handleEdit = (item: TransactionItem) => {
    setActiveEdit({ id: item.id, value: item.value, name: item.name });
  };

  const handleSaveEdit = (id: string) => {
    if (!activeEdit || activeEdit.id !== id) return;
    
    // Update the state with the edited value
    setTransactions(prev => prev.map(item =>
        item.id === id 
            ? { ...item, value: activeEdit.value, name: activeEdit.name.trim() }
            : item
    ));
    
    setActiveEdit(null);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  const isEditing = (id: string) => activeEdit && activeEdit.id === id;


  // --- Component Helpers (Item List) ---

  const ItemList = ({ items, type }: { items: TransactionItem[], type: 'income' | 'expense' }) => (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-center text-gray-500 italic py-4">No {type} items added yet.</p>
      )}
      {items.map((item) => (
        <div key={item.id} className={`flex items-center p-3 rounded-xl transition shadow-sm ${type === 'income' ? 'bg-indigo-50 border border-indigo-200' : 'bg-red-50 border border-red-200'}`}>
            
            <div className="flex-1 min-w-0 pr-3">
                {isEditing(item.id) ? (
                    <input
                        type="text"
                        value={activeEdit!.name} 
                        onChange={(e) => setActiveEdit(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                        className="w-full text-lg font-semibold bg-white border border-gray-300 rounded-lg p-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                ) : (
                    <p className="text-lg font-semibold text-gray-800 truncate">{item.name}</p>
                )}
            </div>

            <div className="flex-shrink-0 w-32 min-w-0 pr-3">
                {isEditing(item.id) ? (
                    <input
                        type="number"
                        value={activeEdit!.value}
                        onChange={(e) => setActiveEdit(prev => prev ? ({ ...prev, value: parseFloat(e.target.value) || 0 }) : null)}
                        className="w-full text-lg font-bold text-right bg-white border border-gray-300 rounded-lg p-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                ) : (
                    <p className={`text-lg font-bold text-right ${type === 'income' ? 'text-indigo-700' : 'text-red-700'}`}>
                        {formatCurrency(item.value)}
                    </p>
                )}
            </div>
          
            <div className="flex-shrink-0 ml-2 space-x-2">
                {isEditing(item.id) ? (
                    <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="p-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition shadow"
                        title="Save"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
                
                <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                    title="Delete"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      ))}
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-2 text-indigo-700">
        <DollarSign className="inline-block w-8 h-8 mr-3 align-text-bottom" /> Income & Expenses Tracker
      </h1>
      <p className="text-center text-gray-600 mb-8">Track your monthly cash flow to better understand where your money is going.</p>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Income */}
        <div className="p-6 bg-indigo-50 rounded-2xl shadow-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase text-indigo-600">Total Income</p>
            <TrendingUp className="w-6 h-6 text-indigo-500"/>
          </div>
          <p className="text-4xl font-extrabold text-indigo-800 mt-2">{formatCurrency(totalIncome)}</p>
        </div>

        {/* Total Expenses */}
        <div className="p-6 bg-red-50 rounded-2xl shadow-lg border border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase text-red-600">Total Expenses</p>
            <TrendingDown className="w-6 h-6 text-red-500"/>
          </div>
          <p className="text-4xl font-extrabold text-red-800 mt-2">{formatCurrency(totalExpenses)}</p>
        </div>

        {/* Net Flow */}
        <div className={`p-6 rounded-2xl shadow-xl transition border ${netFlow >= 0 ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-400'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm font-semibold uppercase ${netFlow >= 0 ? 'text-green-700' : 'text-gray-700'}`}>Net Cash Flow (Income - Expenses)</p>
            <Target className={`w-6 h-6 ${netFlow >= 0 ? 'text-green-600' : 'text-gray-600'}`}/>
          </div>
          <p className={`text-4xl font-extrabold mt-2 ${netFlow >= 0 ? 'text-green-900' : 'text-gray-900'}`}>{formatCurrency(netFlow)}</p>
        </div>
      </div>


      {/* Main Tracker Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* -------------------- ADD NEW ITEM FORM (Left Column) -------------------- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl h-fit sticky top-4 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Plus className="w-6 h-6 mr-3 text-indigo-600"/> Add Transaction
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
                
                {/* Type Selector */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => setNewItemType('income')}
                            className={`flex-1 py-2 px-4 rounded-xl text-center font-semibold transition border-2 ${
                                newItemType === 'income' ? 'bg-indigo-100 text-indigo-800 border-indigo-500' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setNewItemType('expense')}
                            className={`flex-1 py-2 px-4 rounded-xl text-center font-semibold transition border-2 ${
                                newItemType === 'expense' ? 'bg-red-100 text-red-800 border-red-500' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            Expense
                        </button>
                    </div>
                </div>

                {/* Name Input */}
                <div>
                    <label htmlFor="itemName" className="text-sm font-medium text-gray-700 block mb-1">
                        Name ({newItemType === 'income' ? 'e.g., Salary' : 'e.g., Rent Payment'})
                    </label>
                    <input
                        id="itemName"
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Source/Category Name"
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>

                {/* Value Input */}
                <div>
                    <label htmlFor="itemValue" className="text-sm font-medium text-gray-700 block mb-1">
                        Amount (₹)
                    </label>
                    <div className="flex items-center">
                        <span className="absolute pl-3 text-gray-500">₹</span>
                        <input
                            id="itemValue"
                            type="number"
                            value={newItemValue}
                            onChange={(e) => setNewItemValue(e.target.value)}
                            placeholder="Amount"
                            required
                            min={0.01}
                            className="w-full p-3 pl-8 border border-gray-300 rounded-xl font-mono text-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
                    disabled={!newItemName || newItemValue === '' || parseFloat(newItemValue.toString()) <= 0}
                >
                    Add {newItemType === 'income' ? 'Income' : 'Expense'}
                </button>
            </form>
        </div>
        

        {/* -------------------- INCOME & EXPENSE LISTS (Right Column) -------------------- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Income List */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
            <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3"/> Income ({formatCurrency(totalIncome)})
            </h3>
            <ItemList items={incomeList} type="income" />
          </div>

          {/* Expenses List */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-100">
            <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center">
              <TrendingDown className="w-6 h-6 mr-3"/> Expenses ({formatCurrency(totalExpenses)})
            </h3>
            <ItemList items={expenseList} type="expense" />
          </div>

        </div>
      </div>
    </div>
  );
}
