import React, { useState, useEffect } from 'react';
import { Calculator, Target, TrendingUp, PieChart, Wallet, MessageCircle, Menu, X, Home, DollarSign, CheckCircle, Users } from 'lucide-react';
import './App.css';


// Storage utility functions
const storage = {
  get: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  session: {
    get: (key: string, defaultValue: any = null) => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set: (key: string, value: any) => {
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
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const history = storage.session.get('chatHistory', []);
    setChatMessages(history);
  }, []);

  useEffect(() => {
    storage.session.set('chatHistory', chatMessages);
  }, [chatMessages]);

  const openChat = () => {
    setChatOpen(true);
    if (chatMessages.length === 0) {
      const risk = storage.get('riskProfile');
      const goals = storage.get('goals', []);
      
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
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </nav>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

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
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="min-h-[calc(100vh-200px)]">
        {renderPage()}
      </main>

      <footer className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">ArthaniWealth</p>
          <p className="text-emerald-200">Empowering Your Financial Future</p>
          <p className="text-sm text-emerald-300 mt-4">© 2024 ArthaniWealth. All rights reserved.</p>
        </div>
      </footer>

      {!chatOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="text-white" size={28} />
        </button>
      )}

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
            {chatMessages.map((msg: any, idx: number) => (
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

function HomePage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div>
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

function CalculatorsPage() {
  const [activeCalc, setActiveCalc] = useState('loan');
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

function RetirementPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Retirement Planning</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <p className="text-gray-600">Retirement calculator coming soon!</p>
      </div>
    </div>
  );
}

function GoalsPage() {
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

function RiskProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Risk Profile Assessment</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <p className="text-gray-600">Risk assessment coming soon!</p>
      </div>
    </div>
  );
}

function AssetsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Assets & Liabilities</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <p className="text-gray-600">Asset tracker coming soon!</p>
      </div>
    </div>
  );
}

function IncomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Income & Expenses</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <p className="text-gray-600">Income tracker coming soon!</p>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">About ArthaniWealth</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <p className="text-gray-700 mb-4">
          ArthaniWealth is your trusted partner in financial planning and wealth management.
        </p>
        <p className="text-gray-700">
          We provide intelligent tools and insights to help you achieve your financial goals.
        </p>
      </div>
    </div>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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

      <div className="max-w-2xl mx-auto">
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
                  rows={5}
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
      </div>
    </div>
  );
}