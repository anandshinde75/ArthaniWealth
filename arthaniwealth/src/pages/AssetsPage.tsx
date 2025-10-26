/*import React from 'react';

export default function AssetsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Assets & Liabilities</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <p className="text-gray-600">Asset tracker coming soon!</p>
      </div>
    </div>
  );
}*/

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Edit2, Check, DollarSign, Wallet, Banknote, Landmark } from 'lucide-react';

// --- Types ---
type FinancialItem = {
  id: string;
  name: string;
  value: number; // Current market value or outstanding loan amount
};

type NetWorthData = {
  assets: FinancialItem[];
  liabilities: FinancialItem[];
};

type ActiveEdit = {
    id: string;
    value: number;
    name: string;
};

// --- Utility Functions ---
const formatCurrency = (value: number) => `₹${Math.abs(Math.round(value)).toLocaleString('en-IN')}`;


// --- React Component ---
export default function AssetsPage() {
  // Initialize state directly without waiting for a backend load
  const [data, setData] = useState<NetWorthData>({ assets: [], liabilities: [] });
  const [activeEdit, setActiveEdit] = useState<ActiveEdit | null>(null);
  
  // Input states for adding new items
  const [newItemType, setNewItemType] = useState<'asset' | 'liability'>('asset');
  // FIX: Change newItemValue from number | '' to string | '' to better handle large number inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState<string | ''>(''); 


  // --- Calculation Logic ---
  const { totalAssets, totalLiabilities, netWorth } = useMemo(() => {
    const totalA = data.assets.reduce((sum, item) => sum + item.value, 0);
    const totalL = data.liabilities.reduce((sum, item) => sum + item.value, 0);
    const netW = totalA - totalL;
    return { totalAssets: totalA, totalLiabilities: totalL, netWorth: netW };
  }, [data]);

  // --- Handlers for Adding/Editing/Deleting ---

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string input to number for validation and storage
    const valueAsNumber = parseFloat(newItemValue.toString());
    
    if (!newItemName || newItemValue === '' || isNaN(valueAsNumber) || (valueAsNumber <= 0 && newItemType === 'asset')) {
        console.error("Invalid input for new item.");
        return;
    }

    const newItem: FinancialItem = {
      // Use standard UUID generation since crypto is available in most environments
      id: crypto.randomUUID(), 
      name: newItemName.trim(),
      value: valueAsNumber,
    };

    setData(prev => ({
        ...prev,
        [newItemType === 'asset' ? 'assets' : 'liabilities']: [
            ...prev[newItemType === 'asset' ? 'assets' : 'liabilities'], 
            newItem
        ]
    }));

    // Reset inputs
    setNewItemName('');
    setNewItemValue('');
  };

  const handleEdit = (type: 'asset' | 'liability', item: FinancialItem) => {
    setActiveEdit({ id: item.id, value: item.value, name: item.name });
  };

  const handleSaveEdit = (type: 'asset' | 'liability', id: string) => {
    if (!activeEdit || activeEdit.id !== id) return;
    
    // Update the state with the edited value
    setData(prev => ({
        ...prev,
        [type === 'asset' ? 'assets' : 'liabilities']: prev[type === 'asset' ? 'assets' : 'liabilities'].map(item =>
            item.id === id 
                ? { ...item, value: activeEdit.value, name: activeEdit.name.trim() }
                : item
        ),
    }));
    
    setActiveEdit(null);
  };

  const handleDelete = (type: 'asset' | 'liability', id: string) => {
    setData(prev => ({
        ...prev,
        [type === 'asset' ? 'assets' : 'liabilities']: prev[type === 'asset' ? 'assets' : 'liabilities'].filter(item => item.id !== id)
    }));
  };

  const isEditing = (id: string) => activeEdit && activeEdit.id === id;


  // --- Component Helpers (Item List) ---

  const ItemList = ({ items, type }: { items: FinancialItem[], type: 'asset' | 'liability' }) => (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-center text-gray-500 italic py-4">No {type}s added yet. Click '+' above to start tracking!</p>
      )}
      {items.map((item) => (
        <div key={item.id} className={`flex items-center p-3 rounded-xl transition shadow-sm ${type === 'asset' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            
            <div className="flex-1 min-w-0 pr-3">
                {isEditing(item.id) ? (
                    <input
                        type="text"
                        // Since there is no longer a 'null' check on activeEdit, we can safely use the non-null assertion (!)
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
                    <p className={`text-lg font-bold text-right ${type === 'asset' ? 'text-green-700' : 'text-red-700'}`}>
                        {formatCurrency(item.value)}
                    </p>
                )}
            </div>
          
            <div className="flex-shrink-0 ml-2 space-x-2">
                {isEditing(item.id) ? (
                    <button
                        onClick={() => handleSaveEdit(type, item.id)}
                        className="p-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition shadow"
                        title="Save"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => handleEdit(type, item)}
                        className="p-1.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
                
                <button
                    onClick={() => handleDelete(type, item.id)}
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
        <Wallet className="inline-block w-8 h-8 mr-3 align-text-bottom" /> Net Worth Tracker
      </h1>
      <p className="text-center text-gray-600 mb-8">Analyze your financial foundation by tracking what you own and what you owe.</p>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Assets */}
        <div className="p-6 bg-green-50 rounded-2xl shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase text-green-600">Total Assets</p>
            <Banknote className="w-6 h-6 text-green-500"/>
          </div>
          <p className="text-4xl font-extrabold text-green-800 mt-2">{formatCurrency(totalAssets)}</p>
        </div>

        {/* Total Liabilities */}
        <div className="p-6 bg-red-50 rounded-2xl shadow-lg border border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase text-red-600">Total Liabilities</p>
            <Landmark className="w-6 h-6 text-red-500"/>
          </div>
          <p className="text-4xl font-extrabold text-red-800 mt-2">{formatCurrency(totalLiabilities)}</p>
        </div>

        {/* Net Worth */}
        <div className={`p-6 rounded-2xl shadow-xl transition border ${netWorth >= 0 ? 'bg-indigo-100 border-indigo-400' : 'bg-gray-100 border-gray-400'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm font-semibold uppercase ${netWorth >= 0 ? 'text-indigo-700' : 'text-gray-700'}`}>Net Worth (Assets - Liabilities)</p>
            <DollarSign className={`w-6 h-6 ${netWorth >= 0 ? 'text-indigo-600' : 'text-gray-600'}`}/>
          </div>
          <p className={`text-4xl font-extrabold mt-2 ${netWorth >= 0 ? 'text-indigo-900' : 'text-gray-900'}`}>{formatCurrency(netWorth)}</p>
        </div>
      </div>


      {/* Main Tracker Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* -------------------- ADD NEW ITEM FORM (Left Column) -------------------- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl h-fit sticky top-4 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Plus className="w-6 h-6 mr-3 text-indigo-600"/> Add New Item
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
                
                {/* Type Selector */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => setNewItemType('asset')}
                            className={`flex-1 py-2 px-4 rounded-xl text-center font-semibold transition border-2 ${
                                newItemType === 'asset' ? 'bg-green-100 text-green-800 border-green-500' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            Asset
                        </button>
                        <button
                            type="button"
                            onClick={() => setNewItemType('liability')}
                            className={`flex-1 py-2 px-4 rounded-xl text-center font-semibold transition border-2 ${
                                newItemType === 'liability' ? 'bg-red-100 text-red-800 border-red-500' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            Liability
                        </button>
                    </div>
                </div>

                {/* Name Input */}
                <div>
                    <label htmlFor="itemName" className="text-sm font-medium text-gray-700 block mb-1">
                        Name ({newItemType === 'asset' ? 'e.g., Equity Funds' : 'e.g., Home Loan'})
                    </label>
                    <input
                        id="itemName"
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Investment/Debt Name"
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>

                {/* Value Input */}
                <div>
                    <label htmlFor="itemValue" className="text-sm font-medium text-gray-700 block mb-1">
                        Value (₹)
                    </label>
                    <div className="flex items-center">
                        <span className="absolute pl-3 text-gray-500">₹</span>
                        <input
                            id="itemValue"
                            type="number"
                            value={newItemValue}
                            // FIX: When updating state, keep it as a string to avoid browser validation issues with large numbers
                            onChange={(e) => setNewItemValue(e.target.value)}
                            placeholder={newItemType === 'asset' ? 'Current Value' : 'Outstanding Balance'}
                            required
                            min={newItemType === 'asset' ? 0.01 : undefined}
                            className="w-full p-3 pl-8 border border-gray-300 rounded-xl font-mono text-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
                    // Check if value is a valid number *or* a valid non-empty string that can be parsed
                    disabled={!newItemName || newItemValue === '' || (newItemType === 'asset' && parseFloat(newItemValue.toString()) <= 0)}
                >
                    Add {newItemType === 'asset' ? 'Asset' : 'Liability'}
                </button>
            </form>
        </div>
        

        {/* -------------------- ASSETS & LIABILITIES LISTS (Right Column) -------------------- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Assets List */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100">
            <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
              <Banknote className="w-6 h-6 mr-3"/> Assets ({formatCurrency(totalAssets)})
            </h3>
            <ItemList items={data.assets} type="asset" />
          </div>

          {/* Liabilities List */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-100">
            <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center">
              <Landmark className="w-6 h-6 mr-3"/> Liabilities ({formatCurrency(totalLiabilities)})
            </h3>
            <ItemList items={data.liabilities} type="liability" />
          </div>

        </div>
      </div>
    </div>
  );
}
