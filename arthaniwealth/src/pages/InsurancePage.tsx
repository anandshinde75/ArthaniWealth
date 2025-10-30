import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Plus, Trash2 } from 'lucide-react';

type LoanEntry = {
  id: string;
  name: string;
  amount: number;
};

type GoalEntry = {
  id: string;
  name: string;
  amount: number;
};

export default function InsurancePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Step I: Outstanding Loans (Dynamic)
  const [loans, setLoans] = useState<LoanEntry[]>([]);

  // Step II: Goal Funding (Dynamic)
  const [goals, setGoals] = useState<GoalEntry[]>([]);

  // Step III: Future Expenses
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [discountingFactor, setDiscountingFactor] = useState(0);
  const [spouseAge, setSpouseAge] = useState(0);
  const [spouseLifeExpectancy, setSpouseLifeExpectancy] = useState(0);
  const [inflationRate, setInflationRate] = useState(0);
  const [postTaxReturns, setPostTaxReturns] = useState(0);

  // Step V: Existing Resources
  const [investmentAssets, setInvestmentAssets] = useState(0);
  const [existingInsurance, setExistingInsurance] = useState(0);

  // Load saved data
  useEffect(() => {
    const saved = storage.get('insuranceCalculator');
    if (saved) {
      setLoans(saved.loans || []);
      setGoals(saved.goals || []);
      setMonthlyExpenses(saved.monthlyExpenses || 0);
      setDiscountingFactor(saved.discountingFactor || 0);
      setSpouseAge(saved.spouseAge || 0);
      setSpouseLifeExpectancy(saved.spouseLifeExpectancy || 0);
      setInflationRate(saved.inflationRate || 0);
      setPostTaxReturns(saved.postTaxReturns || 0);
      setInvestmentAssets(saved.investmentAssets || 0);
      setExistingInsurance(saved.existingInsurance || 0);
    }
    setIsLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (isLoaded) {
      storage.set('insuranceCalculator', {
        loans,
        goals,
        monthlyExpenses,
        discountingFactor,
        spouseAge,
        spouseLifeExpectancy,
        inflationRate,
        postTaxReturns,
        investmentAssets,
        existingInsurance
      });
    }
  }, [isLoaded, loans, goals, monthlyExpenses, discountingFactor, spouseAge,
      spouseLifeExpectancy, inflationRate, postTaxReturns, investmentAssets, existingInsurance]);

  // Loan operations
  const addLoan = () => {
    const newLoan: LoanEntry = {
      id: Date.now().toString(),
      name: '',
      amount: 0
    };
    //setLoans([...loans, newLoan]);
    setLoans([newLoan, ...loans]);
  };

  const updateLoan = (id: string, field: keyof LoanEntry, value: string | number) => {
    setLoans(loans.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  // Goal operations
  const addGoal = () => {
    const newGoal: GoalEntry = {
      id: Date.now().toString(),
      name: '',
      amount: 0
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id: string, field: keyof GoalEntry, value: string | number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  // Calculations
  const totalOutstandingLiabilities = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalGoalFunding = goals.reduce((sum, goal) => sum + goal.amount, 0);
  
  const netMonthlyExpenses = monthlyExpenses * (1 - discountingFactor / 100);
  const currentAnnualExpenses = netMonthlyExpenses * 12;
  const remainingLifeOfSpouse = spouseLifeExpectancy - spouseAge;
  const netReturns = ((1 + postTaxReturns / 100) / (1 + inflationRate / 100) - 1) * 100;

  // Present Value of Annuity formula for corpus calculation
  const r = netReturns / 100;
  const n = remainingLifeOfSpouse > 0 ? remainingLifeOfSpouse : 0;
  const corpusForFutureExpenses = (r > 0 && n > 0)
    ? currentAnnualExpenses * ((1 - Math.pow(1 + r, -n)) / r)
    : currentAnnualExpenses * n;

  const totalInsuranceRequired = totalOutstandingLiabilities + totalGoalFunding + corpusForFutureExpenses;
  const totalResourcesAvailable = investmentAssets + existingInsurance;
  const additionalCoverRequired = Math.max(0, totalInsuranceRequired - totalResourcesAvailable);
  
  const coverageGap = totalInsuranceRequired > 0 ? ((additionalCoverRequired / totalInsuranceRequired) * 100).toFixed(1) : '0';

  const formatCurrency = (amount: number) => {
    return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
  };

  const resetAllData = () => {
    setLoans([]);
    setGoals([]);
    setMonthlyExpenses(0);
    setDiscountingFactor(0);
    setSpouseAge(0);
    setSpouseLifeExpectancy(0);
    setInflationRate(0);
    setPostTaxReturns(0);
    setInvestmentAssets(0);
    setExistingInsurance(0);
    storage.set('insuranceCalculator', {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-gray-800">Life Insurance Calculator</h1>
        <button
          onClick={resetAllData}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          🔄 Reset All
        </button>
      </div>
      <p className="text-center text-gray-600 mb-12">
        Calculate how much life insurance coverage you need to protect your family
      </p>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Total Insurance Needed</span>
            <Shield size={24} />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(totalInsuranceRequired)}</div>
          <div className="text-sm text-blue-100 mt-1">Based on your needs</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-100">Current Coverage</span>
            <CheckCircle size={24} />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(totalResourcesAvailable)}</div>
          <div className="text-sm text-emerald-100 mt-1">Assets + Existing Insurance</div>
        </div>

        <div className={`bg-gradient-to-br rounded-2xl p-6 shadow-lg text-white ${
          additionalCoverRequired > 0 ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={additionalCoverRequired > 0 ? 'text-red-100' : 'text-green-100'}>
              {additionalCoverRequired > 0 ? 'Coverage Gap' : 'Fully Covered'}
            </span>
            <AlertTriangle size={24} />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(additionalCoverRequired)}</div>
          <div className="text-sm mt-1">
            {additionalCoverRequired > 0 ? `${coverageGap}% shortfall` : 'Well protected!'}
          </div>
        </div>
      </div>

      {/* Input Sections */}
      <div className="space-y-6">
        {/* Step I: Outstanding Loans */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Step I: Outstanding Loans</h2>
              <p className="text-sm text-gray-600 mt-1">These debts would burden your family if something happens to you</p>
            </div>
            <button
              onClick={addLoan}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Add Loan
            </button>
          </div>
          
          {loans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No loans added yet</p>
              <p className="text-sm mt-2">Click "Add Loan" to add your outstanding liabilities</p>
            </div>
          ) : (
            <div className="space-y-3 mt-6">
              {loans.map((loan) => (
                <div key={loan.id} className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={loan.name}
                    onChange={(e) => updateLoan(loan.id, 'name', e.target.value)}
                    placeholder="e.g., Home Loan"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    value={loan.amount || ''}
                    onChange={(e) => updateLoan(loan.id, 'amount', Number(e.target.value))}
                    placeholder="Amount"
                    className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => deleteLoan(loan.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Loan"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Outstanding Liabilities:</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(totalOutstandingLiabilities)}</span>
            </div>
          </div>
        </div>

        {/* Step II: Goal Funding */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Step II: Goal Funding (Present Value)</h2>
              <p className="text-sm text-gray-600 mt-1">Amount needed if these goals were due today</p>
            </div>
            <button
              onClick={addGoal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Add Goal
            </button>
          </div>
          
          {goals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No goals added yet</p>
              <p className="text-sm mt-2">Click "Add Goal" to add your financial goals</p>
            </div>
          ) : (
            <div className="space-y-3 mt-6">
              {goals.map((goal) => (
                <div key={goal.id} className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={goal.name}
                    onChange={(e) => updateGoal(goal.id, 'name', e.target.value)}
                    placeholder="e.g., Children's Education"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    value={goal.amount || ''}
                    onChange={(e) => updateGoal(goal.id, 'amount', Number(e.target.value))}
                    placeholder="Amount"
                    className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Goal"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Goal Funding:</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(totalGoalFunding)}</span>
            </div>
          </div>
        </div>

        {/* Step III: Future Expenses */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Step III: Corpus for Future Family Expenses</h2>
          <p className="text-sm text-gray-600 mb-6">Calculate the corpus needed to maintain family's lifestyle</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Monthly Expenses (Current)</label>
              <input
                type="number"
                value={monthlyExpenses || ''}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Discounting Factor (%) ("Insured" Expenses of Total)</label>
              <input
                type="number"
                value={discountingFactor || ''}
                onChange={(e) => setDiscountingFactor(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">% of expenses that won't apply without you</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Current Age of Spouse</label>
              <input
                type="number"
                value={spouseAge || ''}
                onChange={(e) => setSpouseAge(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Life Expectancy of Spouse</label>
              <input
                type="number"
                value={spouseLifeExpectancy || ''}
                onChange={(e) => setSpouseLifeExpectancy(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Inflation Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={inflationRate || ''}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Post-tax Returns on Corpus (%)</label>
              <input
                type="number"
                step="0.1"
                value={postTaxReturns || ''}
                onChange={(e) => setPostTaxReturns(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Net Monthly Expenses:</span>
                  <span className="float-right font-semibold">{formatCurrency(netMonthlyExpenses)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Current Annual Expenses:</span>
                  <span className="float-right font-semibold">{formatCurrency(currentAnnualExpenses)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Remaining Life of Spouse:</span>
                  <span className="float-right font-semibold">{remainingLifeOfSpouse} years</span>
                </div>
                <div>
                  <span className="text-gray-600">Net Real Returns:</span>
                  <span className="float-right font-semibold">{netReturns.toFixed(2)}%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Corpus Required for Future Expenses:</span>
                <span className="text-xl font-bold text-purple-600">{formatCurrency(corpusForFutureExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step V: Existing Resources */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Step V: Existing Resources</h2>
          <p className="text-sm text-gray-600 mb-6">Assets and insurance already available</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Investment Assets (can be liquidated)
              </label>
              <input
                type="number"
                value={investmentAssets || ''}
                onChange={(e) => setInvestmentAssets(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Mutual funds, stocks, bonds, FDs</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Existing Life Insurance
              </label>
              <input
                type="number"
                value={existingInsurance || ''}
                onChange={(e) => setExistingInsurance(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Sum assured of current policies</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Resources Available:</span>
              <span className="text-xl font-bold text-emerald-600">{formatCurrency(totalResourcesAvailable)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Summary */}
      <div className="mt-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Insurance Needs Summary</h2>
        </div>
        
        <div className="p-8">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Outstanding Liabilities (Step I):</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(totalOutstandingLiabilities)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Goal Funding (Step II):</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(totalGoalFunding)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <span className="text-gray-700 font-medium">Future Expenses Corpus (Step IV):</span>
              <span className="text-lg font-bold text-purple-600">{formatCurrency(corpusForFutureExpenses)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300">
              <span className="text-gray-800 font-bold text-lg">Total Life Insurance Required:</span>
              <span className="text-2xl font-bold text-blue-700">{formatCurrency(totalInsuranceRequired)}</span>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Resources Available (Step V):</span>
              <span className="text-lg font-bold text-emerald-600">{formatCurrency(totalResourcesAvailable)}</span>
            </div>
            
            <div className={`flex justify-between items-center p-6 rounded-lg border-2 ${
              additionalCoverRequired > 0 
                ? 'bg-gradient-to-r from-red-100 to-red-200 border-red-300' 
                : 'bg-gradient-to-r from-green-100 to-green-200 border-green-300'
            }`}>
              <div>
                <div className="text-gray-800 font-bold text-xl mb-1">
                  {additionalCoverRequired > 0 ? 'Additional Life Cover Required:' : 'Coverage Status:'}
                </div>
                {additionalCoverRequired > 0 && (
                  <div className="text-sm text-gray-600">
                    You need {coverageGap}% more coverage to be fully protected
                  </div>
                )}
              </div>
              <span className={`text-3xl font-bold ${
                additionalCoverRequired > 0 ? 'text-red-700' : 'text-green-700'
              }`}>
                {additionalCoverRequired > 0 ? formatCurrency(additionalCoverRequired) : '✓ Fully Covered'}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h3>
            
            {additionalCoverRequired > 0 ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-200">
                  <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Insurance Gap Identified</p>
                    <p className="text-sm text-gray-700">
                      You currently have a coverage shortfall of {formatCurrency(additionalCoverRequired)}. 
                      We recommend purchasing additional term life insurance to protect your family adequately.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <TrendingUp className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Recommended Action</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Purchase a term life insurance policy with coverage of at least {formatCurrency(additionalCoverRequired)}</li>
                      <li>• Consider getting quotes from multiple insurers for best rates</li>
                      <li>• Opt for a policy term that covers until your spouse's life expectancy</li>
                      <li>• Add critical illness and accidental death riders for comprehensive protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-gray-800 mb-2">Well Protected!</p>
                  <p className="text-sm text-gray-700">
                    Your current resources and insurance coverage are sufficient to meet your family's needs. 
                    Remember to review this annually as your financial situation changes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}