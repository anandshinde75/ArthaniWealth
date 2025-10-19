import React, { useState, useEffect } from 'react';
import { Calculator, Target, TrendingUp, PieChart, Wallet, MessageCircle, Menu, X, Home, DollarSign, CheckCircle, Users } from 'lucide-react';

// Storage utility functions
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  session: {
    get: (key, defaultValue = null) => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Session storage error:', e);
      }
    }
  }
};

// Main App Component
export default function ArthaniWealth() {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // Load chat history from session storage
    const history = storage.session.get('chatHistory', []);
    setChatMessages(history);
  }, []);

  useEffect(() => {
    // Save chat history
    storage.session.set('chatHistory', chatMessages);
  }, [chatMessages]);

  const openChat = () => {
    setChatOpen(true);
    if (chatMessages.length === 0) {
      // Context-aware greeting
      const risk = storage.get('riskProfile');
      const goals = storage.get('goals', []);
      const assets = storage.get('assets', []);
      
      let greeting = "👋 Hi there! I'm your ArthaniWealth assistant. How can I help you today?";
      
      if (risk || goals.length > 0) {
        greeting = "👋 Welcome back! ";
        if (risk) {
          greeting += `I see your risk profile is ${risk}. `;
        }
        if (goals.length > 0) {
          greeting += `You're tracking ${goals.length} financial goal${goals.length > 1 ? 's' : ''}. `;
        }
        greeting += "How can I assist you with your financial planning?";
      }
      
      setChatMessages([{ type: 'bot', text: greeting, time: new Date().toLocaleTimeString() }]);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { type: 'user', text: chatInput, time: new Date().toLocaleTimeString() };
    const newMessages = [...chatMessages, userMsg];
    
    // Simple bot responses based on keywords
    let botResponse = "I understand you're asking about " + chatInput + ". ";
    
    if (chatInput.toLowerCase().includes('risk')) {
      const risk = storage.get('riskProfile');
      botResponse = risk 
        ? `Your current risk profile is ${risk}. This helps me recommend suitable investment options for you.`
        : "I recommend completing the Risk Profile assessment first. It will help me provide personalized investment advice.";
    } else if (chatInput.toLowerCase().includes('goal')) {
      const goals = storage.get('goals', []);
      botResponse = goals.length > 0
        ? `You have ${goals.length} active goal(s). Would you like to review or adjust any of them?`
        : "Start by setting up your financial goals in the Goal Setting section. It's a great first step!";
    } else if (chatInput.toLowerCase().includes('invest')) {
      botResponse = "Investment strategy depends on your risk profile, time horizon, and goals. Have you completed your risk assessment yet?";
    } else if (chatInput.toLowerCase().includes('save')) {
      botResponse = "Great question! Start by tracking your income and expenses to identify saving opportunities. Then use our calculators to plan your savings journey.";
    } else {
      botResponse = "That's a great question! I can help you with calculators, goal setting, risk assessment, and financial planning. What would you like to explore?";
    }
    
    const botMsg = { type: 'bot', text: botResponse, time: new Date().toLocaleTimeString() };
    setChatMessages([...newMessages, botMsg]);
    setChatInput('');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'calculators': return <CalculatorsPage />;
      case 'retirement': return <RetirementPage />;
      case 'goals': return <GoalsPage />;
      case 'risk': return <RiskProfilePage />;
      case 'assets': return <AssetsPage />;
      case 'income': return <IncomePage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ArthaniWealth
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {['home', 'calculators', 'retirement', 'goals', 'risk', 'assets', 'income', 'about', 'contact'].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="flex flex-col p-4 gap-2">
              {['home', 'calculators', 'retirement', 'goals', 'risk', 'assets', 'income', 'about', 'contact'].map(page => (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); setMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg text-left font-medium transition-all ${
                    currentPage === page
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-200px)]">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">ArthaniWealth</p>
          <p className="text-emerald-200">Empowering Your Financial Future</p>
          <p className="text-sm text-emerald-300 mt-4">© 2024 ArthaniWealth. All rights reserved.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      {!chatOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="text-white" size={28} />
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-white" size={20} />
              <span className="text-white font-semibold">ArthaniWealth Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-lg transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Home Page Component
function HomePage({ setCurrentPage }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Master Your Financial Future</h1>
          <p className="text-xl mb-8 text-emerald-100">
            Intelligent tools and insights to help you achieve your financial goals
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setCurrentPage('calculators')}
              className="px-8 py-3 bg-white text-emerald-600 rounded-full font-semibold hover:shadow-xl transition-all"
            >
              Explore Calculators
            </button>
            <button
              onClick={() => setCurrentPage('risk')}
              className="px-8 py-3 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 transition-all"
            >
              Start Risk Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="text-emerald-600" size={48} />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">10,000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="text-emerald-600" size={48} />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">50,000+</h3>
              <p className="text-gray-600">Goals Achieved</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="text-emerald-600" size={48} />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">₹500Cr+</h3>
              <p className="text-gray-600">Wealth Managed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Powerful Financial Tools at Your Fingertips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Calculator, title: 'Smart Calculators', desc: 'Loan, mortgage, investment, and savings calculators', page: 'calculators' },
              { icon: Target, title: 'Goal Setting', desc: 'Set and track your financial goals with precision', page: 'goals' },
              { icon: PieChart, title: 'Risk Profile', desc: 'Understand your investment risk tolerance', page: 'risk' },
              { icon: TrendingUp, title: 'Retirement Planning', desc: 'Plan your retirement with advanced projections', page: 'retirement' },
              { icon: Wallet, title: 'Asset Tracking', desc: 'Monitor assets, liabilities, and net worth', page: 'assets' },
              { icon: DollarSign, title: 'Income & Expenses', desc: 'Track cash flow and identify savings opportunities', page: 'income' }
            ].map((feature, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentPage(feature.page)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Calculators Page Component
function CalculatorsPage() {
  const [activeCalc, setActiveCalc] = useState('loan');
  const [loanData, setLoanData] = useState({ amount: 100000, rate: 10, tenure: 5 });
  const [mortgageData, setMortgageData] = useState({ amount: 5000000, rate: 8.5, tenure: 20 });
  const [investmentData, setInvestmentData] = useState({ initial: 100000, monthly: 5000, rate: 12, years: 10 });
  const [savingsData, setSavingsData] = useState({ target: 1000000, monthly: 10000, rate: 7, years: 5 });

  const calculateLoan = () => {
    const P = loanData.amount;
    const r = loanData.rate / 12 / 100;
    const n = loanData.tenure * 12;
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = EMI * n;
    const interest = total - P;
    return { EMI: EMI.toFixed(2), total: total.toFixed(2), interest: interest.toFixed(2) };
  };

  const calculateMortgage = () => {
    const P = mortgageData.amount;
    const r = mortgageData.rate / 12 / 100;
    const n = mortgageData.tenure * 12;
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = EMI * n;
    const interest = total - P;
    return { EMI: EMI.toFixed(2), total: total.toFixed(2), interest: interest.toFixed(2) };
  };

  const calculateInvestment = () => {
    const P = investmentData.initial;
    const PMT = investmentData.monthly;
    const r = investmentData.rate / 12 / 100;
    const n = investmentData.years * 12;
    const FV = P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
    const invested = P + PMT * n;
    const returns = FV - invested;
    return { future: FV.toFixed(2), invested: invested.toFixed(2), returns: returns.toFixed(2) };
  };

  const calculateSavings = () => {
    const target = savingsData.target;
    const monthly = savingsData.monthly;
    const r = savingsData.rate / 12 / 100;
    const n = savingsData.years * 12;
    const FV = monthly * ((Math.pow(1 + r, n) - 1) / r);
    const invested = monthly * n;
    const shortfall = Math.max(0, target - FV);
    return { accumulated: FV.toFixed(2), invested: invested.toFixed(2), shortfall: shortfall.toFixed(2) };
  };

  const loanResult = calculateLoan();
  const mortgageResult = calculateMortgage();
  const investmentResult = calculateInvestment();
  const savingsResult = calculateSavings();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Financial Calculators</h1>
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'loan', name: 'Loan Calculator' },
          { id: 'mortgage', name: 'Mortgage Calculator' },
          { id: 'investment', name: 'Investment Calculator' },
          { id: 'savings', name: 'Savings Calculator' }
        ].map(calc => (
          <button
            key={calc.id}
            onClick={() => setActiveCalc(calc.id)}
            className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
              activeCalc === calc.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-emerald-50'
            }`}
          >
            {calc.name}
          </button>
        ))}
      </div>

      {activeCalc === 'loan' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Loan EMI Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanData.amount}
                  onChange={(e) => setLoanData({...loanData, amount: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={loanData.rate}
                  onChange={(e) => setLoanData({...loanData, rate: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tenure (Years)</label>
                <input
                  type="number"
                  value={loanData.tenure}
                  onChange={(e) => setLoanData({...loanData, tenure: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Future Value:</span>
                  <span className="font-bold text-emerald-600">₹{investmentResult.future}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Invested:</span>
                  <span className="font-bold text-gray-800">₹{investmentResult.invested}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Returns:</span>
                  <span className="font-bold text-teal-600">₹{investmentResult.returns}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCalc === 'savings' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Savings Goal Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Target Amount (₹)</label>
                <input
                  type="number"
                  value={savingsData.target}
                  onChange={(e) => setSavingsData({...savingsData, target: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Monthly Savings (₹)</label>
                <input
                  type="number"
                  value={savingsData.monthly}
                  onChange={(e) => setSavingsData({...savingsData, monthly: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={savingsData.rate}
                  onChange={(e) => setSavingsData({...savingsData, rate: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Time Period (Years)</label>
                <input
                  type="number"
                  value={savingsData.years}
                  onChange={(e) => setSavingsData({...savingsData, years: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accumulated:</span>
                  <span className="font-bold text-emerald-600">₹{savingsResult.accumulated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Saved:</span>
                  <span className="font-bold text-gray-800">₹{savingsResult.invested}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shortfall:</span>
                  <span className={`font-bold ${Number(savingsResult.shortfall) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{savingsResult.shortfall}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Retirement Calculator Page
function RetirementPage() {
  const [data, setData] = useState(() => {
    const saved = storage.get('retirementData');
    return saved || {
      currentAge: 30,
      retirementAge: 60,
      lifeExpectancy: 85,
      currentSavings: 500000,
      monthlyContribution: 10000,
      expectedReturn: 10,
      monthlyExpenseAfterRetirement: 50000,
      inflation: 6
    };
  });

  useEffect(() => {
    storage.set('retirementData', data);
  }, [data]);

  const calculate = () => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const yearsInRetirement = data.lifeExpectancy - data.retirementAge;
    const r = data.expectedReturn / 12 / 100;
    const n = yearsToRetirement * 12;
    
    const futureValue = data.currentSavings * Math.pow(1 + r, n) + 
                        data.monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    
    const inflationAdjustedExpense = data.monthlyExpenseAfterRetirement * 
                                     Math.pow(1 + data.inflation / 100, yearsToRetirement);
    
    const corpusRequired = inflationAdjustedExpense * 12 * yearsInRetirement / 
                          (1 + data.expectedReturn / 100);
    
    const shortfall = Math.max(0, corpusRequired - futureValue);
    
    return {
      futureValue: futureValue.toFixed(0),
      corpusRequired: corpusRequired.toFixed(0),
      shortfall: shortfall.toFixed(0),
      readyForRetirement: shortfall === 0
    };
  };

  const result = calculate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Retirement Planning Calculator</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Current Age</label>
              <input
                type="number"
                value={data.currentAge}
                onChange={(e) => setData({...data, currentAge: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Retirement Age</label>
              <input
                type="number"
                value={data.retirementAge}
                onChange={(e) => setData({...data, retirementAge: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Life Expectancy</label>
              <input
                type="number"
                value={data.lifeExpectancy}
                onChange={(e) => setData({...data, lifeExpectancy: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Current Savings (₹)</label>
              <input
                type="number"
                value={data.currentSavings}
                onChange={(e) => setData({...data, currentSavings: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Monthly Contribution (₹)</label>
              <input
                type="number"
                value={data.monthlyContribution}
                onChange={(e) => setData({...data, monthlyContribution: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Expected Return (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={data.expectedReturn}
                onChange={(e) => setData({...data, expectedReturn: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Monthly Expense After Retirement (₹)</label>
              <input
                type="number"
                value={data.monthlyExpenseAfterRetirement}
                onChange={(e) => setData({...data, monthlyExpenseAfterRetirement: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Inflation Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={data.inflation}
                onChange={(e) => setData({...data, inflation: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Retirement Projection</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Projected Retirement Corpus</p>
                <p className="text-2xl font-bold text-emerald-600">₹{(Number(result.futureValue) / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Required Corpus</p>
                <p className="text-2xl font-bold text-gray-800">₹{(Number(result.corpusRequired) / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Shortfall</p>
                <p className={`text-2xl font-bold ${Number(result.shortfall) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Number(result.shortfall) > 0 ? `₹${(Number(result.shortfall) / 10000000).toFixed(2)} Cr` : 'On Track! ✓'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Recommendations</h3>
            <ul className="space-y-3">
              {Number(result.shortfall) > 0 ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span className="text-gray-700">Increase monthly contributions by ₹{Math.ceil(Number(result.shortfall) / ((data.retirementAge - data.currentAge) * 12))}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span className="text-gray-700">Consider higher-return investment options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span className="text-gray-700">Review and reduce post-retirement expenses</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">You're on track for retirement!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Maintain current savings discipline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Consider diversifying investments</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Goals Page Component
function GoalsPage() {
  const [goals, setGoals] = useState(() => storage.get('goals', []));
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    deadline: ''
  });

  useEffect(() => {
    storage.set('goals', goals);
  }, [goals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...goals];
      updated[editIndex] = formData;
      setGoals(updated);
      setEditIndex(null);
    } else {
      setGoals([...goals, formData]);
    }
    setFormData({ name: '', target: '', current: '', deadline: '' });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(goals[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const calculateProgress = (current, target) => {
    return Math.min(100, (Number(current) / Number(target)) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Financial Goals</h1>
        <button
          onClick={() => { setShowForm(true); setEditIndex(null); setFormData({ name: '', target: '', current: '', deadline: '' }); }}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          + Add New Goal
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editIndex !== null ? 'Edit Goal' : 'Create New Goal'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Goal Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., House Down Payment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Current Savings (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.current}
                  onChange={(e) => setFormData({...formData, current: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Target Date</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editIndex !== null ? 'Update' : 'Create'} Goal
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditIndex(null); }}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Target className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600">No goals yet. Start by adding your first financial goal!</p>
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress = calculateProgress(goal.current, goal.target);
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target: ₹{Number(goal.target).toLocaleString()}</span>
                    <span className="text-gray-600">Current: ₹{Number(goal.current).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-emerald-600">{progress.toFixed(1)}% Complete</span>
                    <span className="text-gray-600">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Risk Profile Page Component
function RiskProfilePage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(storage.get('riskProfile'));

  const questions = [
    {
      q: "What is your primary investment goal?",
      options: [
        { text: "Preserve capital", score: 1 },
        { text: "Generate steady income", score: 2 },
        { text: "Grow wealth moderately", score: 3 },
        { text: "Maximize long-term growth", score: 4 }
      ]
    },
    {
      q: "What is your investment time horizon?",
      options: [
        { text: "Less than 3 years", score: 1 },
        { text: "3-5 years", score: 2 },
        { text: "5-10 years", score: 3 },
        { text: "More than 10 years", score: 4 }
      ]
    },
    {
      q: "How would you react if your portfolio dropped 20% in value?",
      options: [
        { text: "Sell everything immediately", score: 1 },
        { text: "Sell some investments", score: 2 },
        { text: "Hold and wait for recovery", score: 3 },
        { text: "Buy more at lower prices", score: 4 }
      ]
    },
    {
      q: "What percentage of your income can you invest?",
      options: [
        { text: "Less than 10%", score: 1 },
        { text: "10-20%", score: 2 },
        { text: "20-30%", score: 3 },
        { text: "More than 30%", score: 4 }
      ]
    },
    {
      q: "How much investment experience do you have?",
      options: [
        { text: "None - I'm a beginner", score: 1 },
        { text: "Limited - Basic knowledge", score: 2 },
        { text: "Moderate - Several years", score: 3 },
        { text: "Extensive - Very experienced", score: 4 }
      ]
    },
    {
      q: "Which statement best describes your attitude?",
      options: [
        { text: "I prefer guaranteed returns", score: 1 },
        { text: "I want stability with some growth", score: 2 },
        { text: "I accept moderate risk for growth", score: 3 },
        { text: "I embrace high risk for high returns", score: 4 }
      ]
    },
    {
      q: "How important is liquidity to you?",
      options: [
        { text: "Very important - need quick access", score: 1 },
        { text: "Somewhat important", score: 2 },
        { text: "Not very important", score: 3 },
        { text: "Not important - long-term focused", score: 4 }
      ]
    }
  ];

  const handleAnswer = (score) => {
    const newAnswers = { ...answers, [currentQ]: score };
    setAnswers(newAnswers);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateRisk(newAnswers);
    }
  };

  const calculateRisk = (allAnswers) => {
    const total = Object.values(allAnswers).reduce((sum, score) => sum + score, 0);
    const avg = total / questions.length;
    
    let profile;
    if (avg <= 2) profile = 'Conservative';
    else if (avg <= 3) profile = 'Moderate';
    else profile = 'Aggressive';
    
    setResult(profile);
    storage.set('riskProfile', profile);
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Risk Profile</h1>
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full mb-6">
            <p className="text-3xl font-bold text-emerald-600">{result}</p>
          </div>
          
          <div className="text-left max-w-2xl mx-auto space-y-4 mb-8">
            {result === 'Conservative' && (
              <>
                <p className="text-gray-700">You prefer safety and capital preservation over high returns. Your ideal portfolio includes:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>70-80% in fixed deposits, bonds, and debt funds</li>
                  <li>15-25% in balanced/hybrid funds</li>
                  <li>5-10% in equity for long-term growth</li>
                </ul>
              </>
            )}
            {result === 'Moderate' && (
              <>
                <p className="text-gray-700">You seek a balance between growth and stability. Your ideal portfolio includes:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>40-50% in equity and equity funds</li>
                  <li>30-40% in bonds and debt instruments</li>
                  <li>10-20% in balanced funds</li>
                </ul>
              </>
            )}
            {result === 'Aggressive' && (
              <>
                <p className="text-gray-700">You're comfortable with market volatility for higher returns. Your ideal portfolio includes:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>70-80% in equity, stocks, and equity funds</li>
                  <li>15-25% in alternative investments</li>
                  <li>5-10% in debt for stability</li>
                </ul>
              </>
            )}
          </div>
          
          <button
            onClick={restart}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Risk Profile Assessment</h1>
          <span className="text-emerald-600 font-semibold">Question {currentQ + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{questions[currentQ].q}</h2>
        <div className="space-y-3">
          {questions[currentQ].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.score)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 border-2 border-gray-200 hover:border-emerald-500 rounded-xl text-left font-medium text-gray-700 hover:text-emerald-700 transition-all"
            >
              {option.text}
            </button>
          ))}
        </div>
        
        {currentQ > 0 && (
          <button
            onClick={() => setCurrentQ(currentQ - 1)}
            className="mt-6 px-6 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all"
          >
            ← Previous Question
          </button>
        )}
      </div>
    </div>
  );
}

// Assets & Liabilities Page
function AssetsPage() {
  const [assets, setAssets] = useState(() => storage.get('assets', []));
  const [liabilities, setLiabilities] = useState(() => storage.get('liabilities', []));
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [assetForm, setAssetForm] = useState({ name: '', value: '', type: 'Property' });
  const [liabilityForm, setLiabilityForm] = useState({ name: '', value: '', type: 'Loan' });

  useEffect(() => {
    storage.set('assets', assets);
  }, [assets]);

  useEffect(() => {
    storage.set('liabilities', liabilities);
  }, [liabilities]);

  const totalAssets = assets.reduce((sum, a) => sum + Number(a.value), 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + Number(l.value), 0);
  const netWorth = totalAssets - totalLiabilities;

  const addAsset = (e) => {
    e.preventDefault();
    setAssets([...assets, assetForm]);
    setAssetForm({ name: '', value: '', type: 'Property' });
    setShowAssetForm(false);
  };

  const deleteAsset = (index) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const addLiability = (e) => {
    e.preventDefault();
    setLiabilities([...liabilities, liabilityForm]);
    setLiabilityForm({ name: '', value: '', type: 'Loan' });
    setShowLiabilityForm(false);
  };

  const deleteLiability = (index) => {
    setLiabilities(liabilities.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Assets & Liabilities</h1>

      {/* Net Worth Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-emerald-100 mb-2">Total Assets</p>
          <p className="text-3xl font-bold">₹{totalAssets.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-red-100 mb-2">Total Liabilities</p>
          <p className="text-3xl font-bold">₹{totalLiabilities.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-gray-300 mb-2">Net Worth</p>
          <p className="text-3xl font-bold">₹{netWorth.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Assets Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Assets</h2>
            <button
              onClick={() => setShowAssetForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              + Add Asset
            </button>
          </div>

          {showAssetForm && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
              <form onSubmit={addAsset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({...assetForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
                  <select
                    value={assetForm.type}
                    onChange={(e) => setAssetForm({...assetForm, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option>Property</option>
                    <option>Investments</option>
                    <option>Savings</option>
                    <option>Vehicle</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={assetForm.value}
                    onChange={(e) => setAssetForm({...assetForm, value: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssetForm(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {assets.map((asset, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{asset.name}</p>
                  <p className="text-sm text-gray-600">{asset.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-emerald-600">₹{Number(asset.value).toLocaleString()}</p>
                  <button
                    onClick={() => deleteAsset(idx)}
                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {assets.length === 0 && (
              <p className="text-center text-gray-500 py-8">No assets added yet</p>
            )}
          </div>
        </div>

        {/* Liabilities Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Liabilities</h2>
            <button
              onClick={() => setShowLiabilityForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              + Add Liability
            </button>
          </div>

          {showLiabilityForm && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
              <form onSubmit={addLiability} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Liability Name</label>
                  <input
                    type="text"
                    required
                    value={liabilityForm.name}
                    onChange={(e) => setLiabilityForm({...liabilityForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
                  <select
                    value={liabilityForm.type}
                    onChange={(e) => setLiabilityForm({...liabilityForm, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option>Loan</option>
                    <option>Credit Card</option>
                    <option>Mortgage</option>
                    <option>Other Debt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={liabilityForm.value}
                    onChange={(e) => setLiabilityForm({...liabilityForm, value: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-semibold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLiabilityForm(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {liabilities.map((liability, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{liability.name}</p>
                  <p className="text-sm text-gray-600">{liability.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-red-600">₹{Number(liability.value).toLocaleString()}</p>
                  <button
                    onClick={() => deleteLiability(idx)}
                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {liabilities.length === 0 && (
              <p className="text-center text-gray-500 py-8">No liabilities added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Income & Expense Page
function IncomePage() {
  const [income, setIncome] = useState(() => storage.get('income', []));
  const [expenses, setExpenses] = useState(() => storage.get('expenses', []));
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ source: '', amount: '', frequency: 'Monthly' });
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', frequency: 'Monthly' });

  useEffect(() => {
    storage.set('income', income);
  }, [income]);

  useEffect(() => {
    storage.set('expenses', expenses);
  }, [expenses]);

  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const savings = totalIncome - totalExpenses;

  const addIncome = (e) => {
    e.preventDefault();
    setIncome([...income, incomeForm]);
    setIncomeForm({ source: '', amount: '', frequency: 'Monthly' });
    setShowIncomeForm(false);
  };

  const deleteIncome = (index) => {
    setIncome(income.filter((_, i) => i !== index));
  };

  const addExpense = (e) => {
    e.preventDefault();
    setExpenses([...expenses, expenseForm]);
    setExpenseForm({ category: '', amount: '', frequency: 'Monthly' });
    setShowExpenseForm(false);
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Income & Expenses</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-emerald-100 mb-2">Total Income</p>
          <p className="text-3xl font-bold">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-red-100 mb-2">Total Expenses</p>
          <p className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className={`bg-gradient-to-br ${savings >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-600 to-red-800'} rounded-2xl p-6 text-white shadow-lg`}>
          <p className="text-white/80 mb-2">{savings >= 0 ? 'Savings' : 'Deficit'}</p>
          <p className="text-3xl font-bold">₹{Math.abs(savings).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Income Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Income Sources</h2>
            <button
              onClick={() => setShowIncomeForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              + Add Income
            </button>
          </div>

          {showIncomeForm && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
              <form onSubmit={addIncome} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Source</label>
                  <input
                    type="text"
                    required
                    value={incomeForm.source}
                    onChange={(e) => setIncomeForm({...incomeForm, source: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., Salary, Freelance, Rental"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={incomeForm.amount}
                    onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Frequency</label>
                  <select
                    value={incomeForm.frequency}
                    onChange={(e) => setIncomeForm({...incomeForm, frequency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                    <option>One-time</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIncomeForm(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {income.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{item.source}</p>
                  <p className="text-sm text-gray-600">{item.frequency}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-emerald-600">₹{Number(item.amount).toLocaleString()}</p>
                  <button
                    onClick={() => deleteIncome(idx)}
                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {income.length === 0 && (
              <p className="text-center text-gray-500 py-8">No income sources added yet</p>
            )}
          </div>
        </div>

        {/* Expenses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              + Add Expense
            </button>
          </div>

          {showExpenseForm && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
              <form onSubmit={addExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                  <input
                    type="text"
                    required
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., Rent, Groceries, Utilities"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Frequency</label>
                  <select
                    value={expenseForm.frequency}
                    onChange={(e) => setExpenseForm({...expenseForm, frequency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                    <option>One-time</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-semibold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExpenseForm(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {expenses.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{item.category}</p>
                  <p className="text-sm text-gray-600">{item.frequency}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-red-600">₹{Number(item.amount).toLocaleString()}</p>
                  <button
                    onClick={() => deleteExpense(idx)}
                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-center text-gray-500 py-8">No expenses added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// About Page
function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">About ArthaniWealth</h1>
        <p className="text-xl text-gray-600">Empowering Indian Professionals with Financial Intelligence</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At ArthaniWealth, we believe that financial literacy is the key to prosperity. Our mission is to democratize 
            financial planning by providing powerful, easy-to-use tools that help individuals take control of their 
            financial future. We strive to make complex financial concepts accessible to everyone, regardless of their 
            background or experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            We envision a future where every Indian professional has the knowledge and tools to achieve financial 
            independence. Through innovative technology and personalized insights, we aim to transform the way people 
            approach wealth management, retirement planning, and goal setting. Our platform bridges the gap between 
            financial aspirations and actionable strategies.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-white text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">Why Choose ArthaniWealth?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Goal-Oriented</h3>
            <p className="text-emerald-100">Set clear financial goals and track progress with precision</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
            <p className="text-emerald-100">Get personalized insights based on your unique financial profile</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-emerald-100">Your financial data stays private and secure in your browser</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Transparency</h3>
              <p className="text-gray-600">Clear, honest communication with no hidden fees or complex jargon</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">Continuously improving our tools to serve you better</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Empowerment</h3>
              <p className="text-gray-600">Helping you make informed decisions about your financial future</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Education</h3>
              <p className="text-gray-600">Building financial literacy through accessible tools and resources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Page
function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Get in Touch</h2>
          
          {submitted ? (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600">We've received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
                <textarea
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & FAQ */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <p className="text-gray-600">support@arthaniwealth.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Phone</p>
                  <p className="text-gray-600">+91 1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🕐</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Office Hours</p>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is my financial data secure?</h3>
                <p className="text-gray-600 text-sm">Yes! All your data is stored locally in your browser. We don't store any personal information on our servers.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Are the calculators accurate?</h3>
                <p className="text-gray-600 text-sm">Our calculators use industry-standard formulas. However, they provide estimates and should not replace professional financial advice.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is ArthaniWealth free to use?</h3>
                <p className="text-gray-600 text-sm">Yes! All our basic tools and features are completely free. We believe everyone deserves access to quality financial planning tools.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can I export my data?</h3>
                <p className="text-gray-600 text-sm">Currently, data is stored in your browser. We're working on export features for future releases.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}-gray-800">Results</h3>
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
      )}

      {activeCalc === 'mortgage' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Mortgage Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Property Value (₹)</label>
                <input
                  type="number"
                  value={mortgageData.amount}
                  onChange={(e) => setMortgageData({...mortgageData, amount: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mortgageData.rate}
                  onChange={(e) => setMortgageData({...mortgageData, rate: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tenure (Years)</label>
                <input
                  type="number"
                  value={mortgageData.tenure}
                  onChange={(e) => setMortgageData({...mortgageData, tenure: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly EMI:</span>
                  <span className="font-bold text-emerald-600">₹{mortgageResult.EMI}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payment:</span>
                  <span className="font-bold text-gray-800">₹{mortgageResult.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-bold text-teal-600">₹{mortgageResult.interest}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCalc === 'investment' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Investment Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Initial Investment (₹)</label>
                <input
                  type="number"
                  value={investmentData.initial}
                  onChange={(e) => setInvestmentData({...investmentData, initial: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={investmentData.monthly}
                  onChange={(e) => setInvestmentData({...investmentData, monthly: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Expected Return (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={investmentData.rate}
                  onChange={(e) => setInvestmentData({...investmentData, rate: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Time Period (Years)</label>
                <input
                  type="number"
                  value={investmentData.years}
                  onChange={(e) => setInvestmentData({...investmentData, years: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text