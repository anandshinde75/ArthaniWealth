import React, { useState, useEffect } from 'react';
import { storage } from '../components/StorageUtils';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>(() => storage.get('goals', []));

  useEffect(() => {
    storage.set('goals', goals);
  }, [goals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Financial Goals</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <p className="text-gray-600">Goals tracker coming soon!</p>
      </div>
    </div>
  );
}
