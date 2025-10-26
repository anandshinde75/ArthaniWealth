import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

type SimulationRow = {
  age: number;
  corpusAtBeginning: number;
  incrementalSavings: number;
  returnOnInvestment: number;
  withdrawals: number;
  lumpSumWithdrawal: number;
  withdrawalRate: number;
  alive: string;
  fundStatus: string;
};

type LumpSumWithdrawal = {
  age: number;
  amount: number;
};

export default function RetirementPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Input states
  const [currentAge, setCurrentAge] = useState(50);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [currentSavings, setCurrentSavings] = useState(70000000);
  const [monthlySaving, setMonthlySaving] = useState(600000);
  const [savingsIncrease, setSavingsIncrease] = useState(10);
  const [preRetirementROI, setPreRetirementROI] = useState(13);
  const [capitalGainTax, setCapitalGainTax] = useState(12.5);
  const [preRetirementExpenses, setPreRetirementExpenses] = useState(250000);
  const [householdInflation, setHouseholdInflation] = useState(7);
  const [postRetirementExpensesAuto, setPostRetirementExpensesAuto] = useState(0);
  const [postRetirementExpensesManual, setPostRetirementExpensesManual] = useState(0);
  const [lumpSumWithdrawals, setLumpSumWithdrawals] = useState<LumpSumWithdrawal[]>([]);
  
  const [simulationData, setSimulationData] = useState<SimulationRow[]>([]);
  const [showLumpSumModal, setShowLumpSumModal] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = storage.get('retirementCalculator');
    console.log('Loading retirement data:', saved); // Debug log
    if (saved) {
      setCurrentAge(saved.currentAge || 50);
      setRetirementAge(saved.retirementAge || 60);
      setLifeExpectancy(saved.lifeExpectancy || 90);
      setCurrentSavings(saved.currentSavings || 70000000);
      setMonthlySaving(saved.monthlySaving || 600000);
      setSavingsIncrease(saved.savingsIncrease || 10);
      setPreRetirementROI(saved.preRetirementROI || 13);
      setCapitalGainTax(saved.capitalGainTax || 12.5);
      setPreRetirementExpenses(saved.preRetirementExpenses || 250000);
      setHouseholdInflation(saved.householdInflation || 7);
      setLumpSumWithdrawals(saved.lumpSumWithdrawals || []);
      if (saved.postRetirementExpensesManual) {
        setPostRetirementExpensesManual(saved.postRetirementExpensesManual);
      }
    }
    setIsLoaded(true);
  }, []);

  // Calculate auto post-retirement expenses
  useEffect(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const futureExpenses = preRetirementExpenses * Math.pow(1 + householdInflation / 100, yearsToRetirement);
    setPostRetirementExpensesAuto(futureExpenses);
    setPostRetirementExpensesManual(futureExpenses);
  }, [currentAge, retirementAge, preRetirementExpenses, householdInflation]);

  // Calculate simulation
  useEffect(() => {
    calculateSimulation();
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlySaving, savingsIncrease, 
      preRetirementROI, capitalGainTax, postRetirementExpensesManual, householdInflation, lumpSumWithdrawals]);

  // Save data (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving retirement data'); // Debug log
      storage.set('retirementCalculator', {
        currentAge,
        retirementAge,
        lifeExpectancy,
        currentSavings,
        monthlySaving,
        savingsIncrease,
        preRetirementROI,
        capitalGainTax,
        preRetirementExpenses,
        householdInflation,
        postRetirementExpensesManual,
        lumpSumWithdrawals
      });
    }
  }, [isLoaded, currentAge, retirementAge, lifeExpectancy, currentSavings, monthlySaving, 
      savingsIncrease, preRetirementROI, capitalGainTax, preRetirementExpenses, 
      householdInflation, postRetirementExpensesManual, lumpSumWithdrawals]);

  const calculateSimulation = () => {
    const data: SimulationRow[] = [];
    let corpus = currentSavings;
    let annualSavings = monthlySaving * 12;
    let annualExpenses = postRetirementExpensesManual * 12;
    
    // Post-tax ROI (tax only applies during withdrawal phase)
    const postTaxROI = preRetirementROI * (1 - capitalGainTax / 100);
    
    for (let age = currentAge; age <= lifeExpectancy + 5; age++) {
      const isRetired = age > retirementAge; // Withdrawal starts AFTER retirement
      const isAlive = age <= lifeExpectancy;
      
      // Beginning corpus
      const corpusAtBeginning = corpus;
      
      // Calculate returns on beginning corpus
      // Use full ROI during accumulation, post-tax ROI during withdrawal
      const applicableROI = isRetired ? postTaxROI : preRetirementROI;
      const returnOnInvestment = corpusAtBeginning * (applicableROI / 100);
      
      // Incremental savings (only before and during retirement year)
      const incrementalSavings = age <= retirementAge ? annualSavings : 0;
      
      // Add savings and returns to corpus
      corpus += incrementalSavings;
      corpus += returnOnInvestment;
      
      // Check for lump sum withdrawal at this age
      const lumpSumAtAge = lumpSumWithdrawals.find(ls => ls.age === age);
      const lumpSumWithdrawal = lumpSumAtAge ? lumpSumAtAge.amount : 0;
      corpus -= lumpSumWithdrawal;
      
      // Withdrawals (only after retirement year and while alive)
      const withdrawals = (isRetired && isAlive) ? annualExpenses : 0;
      corpus -= withdrawals;
      
      // Withdrawal rate
      const totalWithdrawals = withdrawals + lumpSumWithdrawal;
      const withdrawalRate = corpusAtBeginning > 0 ? (totalWithdrawals / corpusAtBeginning) * 100 : 0;
      
      // Status
      const aliveStatus = isAlive ? "Alive and kicking" : "You are dead";
      let fundStatus = "";
      if (!isAlive && corpus > 0) {
        fundStatus = "Legacy passed on";
      } else if (age < retirementAge) {
        fundStatus = "Working";
      } else if (age === retirementAge) {
        fundStatus = "Retirement Year";
      } else if (corpus <= 0) {
        fundStatus = "You have run out of funds";
      } else {
        fundStatus = "Retired";
      }
      
      data.push({
        age,
        corpusAtBeginning,
        incrementalSavings,
        returnOnInvestment,
        withdrawals,
        lumpSumWithdrawal,
        withdrawalRate,
        alive: aliveStatus,
        fundStatus
      });
      
      // Stop if out of funds
      if (corpus <= 0 && isRetired) {
        // Add a few more years to show running out of funds
        for (let i = 1; i <= 3; i++) {
          data.push({
            age: age + i,
            corpusAtBeginning: 0,
            incrementalSavings: 0,
            returnOnInvestment: 0,
            withdrawals: 0,
            lumpSumWithdrawal: 0,
            withdrawalRate: 0,
            alive: (age + i) <= lifeExpectancy ? "Alive and kicking" : "You are dead",
            fundStatus: "You have run out of funds"
          });
        }
        break;
      }
      
      // Increase savings annually
      if (age < retirementAge) {
        annualSavings = annualSavings * (1 + savingsIncrease / 100);
      }
      
      // Increase expenses with inflation
      annualExpenses = annualExpenses * (1 + householdInflation / 100);
    }
    
    setSimulationData(data);
  };

  const addLumpSumWithdrawal = (age: number, amount: number) => {
    const existing = lumpSumWithdrawals.find(ls => ls.age === age);
    if (existing) {
      setLumpSumWithdrawals(lumpSumWithdrawals.map(ls => 
        ls.age === age ? { ...ls, amount } : ls
      ));
    } else {
      setLumpSumWithdrawals([...lumpSumWithdrawals, { age, amount }]);
    }
  };

  const removeLumpSumWithdrawal = (age: number) => {
    setLumpSumWithdrawals(lumpSumWithdrawals.filter(ls => ls.age !== age));
  };

  const updateLumpSumInTable = (age: number, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount > 0) {
      addLumpSumWithdrawal(age, numAmount);
    } else {
      removeLumpSumWithdrawal(age);
    }
  };

  const formatCurrency = (num: number) => {
    return `Rs. ${Math.round(num).toLocaleString('en-IN')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Retirement Calculator</h1>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Age Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">Age Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Your Current Age (Years)</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">When You Want to Retire (Years)</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Expect to Live Until (Years)</label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Savings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">Savings Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Current Savings Till Date</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Current Monthly Saving</label>
              <input
                type="number"
                value={monthlySaving}
                onChange={(e) => setMonthlySaving(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Increase in Savings (Annually %)</label>
              <input
                type="number"
                step="0.1"
                value={savingsIncrease}
                onChange={(e) => setSavingsIncrease(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Returns & Expenses Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">Returns & Expenses</h3>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Return on Investment (Pre-Tax %)</label>
              <input
                type="number"
                step="0.1"
                value={preRetirementROI}
                onChange={(e) => setPreRetirementROI(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Capital Gain Tax (%)</label>
              <input
                type="number"
                step="0.1"
                value={capitalGainTax}
                onChange={(e) => setCapitalGainTax(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Pre Retirement Monthly Expenses</label>
              <input
                type="number"
                value={preRetirementExpenses}
                onChange={(e) => setPreRetirementExpenses(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Household Inflation Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={householdInflation}
                onChange={(e) => setHouseholdInflation(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Post Retirement Expenses */}
        <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2 text-gray-700">Post Retirement Monthly Expenses (Auto)</label>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(postRetirementExpensesAuto)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Calculated based on inflation</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Post Retirement Monthly Expenses (Manual)</label>
            <input
              type="number"
              value={Math.round(postRetirementExpensesManual)}
              onChange={(e) => setPostRetirementExpensesManual(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <p className="text-xs text-gray-600 mt-1">You can edit this value</p>
          </div>
        </div>
      </div>

      {/* Simulation Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600">
          <h2 className="text-2xl font-bold text-white">Retirement Simulation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Age</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Corpus at Beginning</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Incremental Savings</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Return on Investment</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Withdrawals</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Lump Sum Withdrawal</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Withdrawal Rate</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Alive?</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Fund Status</th>
              </tr>
            </thead>
            <tbody>
              {simulationData.map((row, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    row.age === retirementAge ? 'bg-yellow-50' : ''
                  } ${
                    row.fundStatus === 'You have run out of funds' ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{row.age}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.corpusAtBeginning)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatCurrency(row.incrementalSavings)}</td>
                  <td className="px-4 py-3 text-right text-blue-600">{formatCurrency(row.returnOnInvestment)}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatCurrency(row.withdrawals)}</td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={row.lumpSumWithdrawal || ''}
                      onChange={(e) => updateLumpSumInTable(row.age, e.target.value)}
                      placeholder="0"
                      className="w-full text-right px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.withdrawalRate.toFixed(2)}%</td>
                  <td className={`px-4 py-3 text-center font-medium ${
                    row.alive === "Alive and kicking" ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {row.alive}
                  </td>
                  <td className={`px-4 py-3 text-center font-medium ${
                    row.fundStatus === 'You have run out of funds' ? 'text-red-600' :
                    row.fundStatus === 'Retired' ? 'text-blue-600' :
                    row.fundStatus === 'Retirement Year' ? 'text-orange-600 font-bold' :
                    row.fundStatus === 'Legacy passed on' ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                    {row.fundStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}