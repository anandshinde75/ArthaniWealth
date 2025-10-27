import React, { useState, useEffect } from 'react';
import { Calculator, Target, TrendingUp, PieChart, Wallet, MessageCircle, Menu, X, Home, DollarSign, CheckCircle, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; 
import './css/App.css';
import { storage, getSessionId } from './utils/storage';  // ADD THIS

// Import pages
import HomePage from './pages/HomePage';
import CalculatorsPage from './pages/CalculatorsPage';
import RetirementPage from './pages/RetirementPage';
import GoalsPage from './pages/GoalsPage';
import RiskProfilePage from './pages/RiskProfilePage';
import AssetsPage from './pages/AssetsPage';
import IncomePage from './pages/IncomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

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
      
      let greeting = "👋 Hello! I’m your ArthaniWealth assistant. The information and insights provided here are for educational and informational purposes only. They do not constitute financial advice. Please consult a certified financial advisor before making any investment or financial decisions.";
      
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

  const sendMessage = async () => {
  
    if (!chatInput.trim()) return;
    
    const userMsg = { type: 'user', text: chatInput, time: new Date().toLocaleTimeString() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    
    // ✅ Clear input immediately
    setChatInput('');
    
    // Show loading state
    const loadingMsg = { type: 'bot', text: '...', time: '' };
    setChatMessages([...newMessages, loadingMsg]);
    
    try {
      	
      	// Get persistent session ID
      	const sessionId = getSessionId();
      	
      	 // Build conversation history (last 10 messages)
	    const conversationHistory = chatMessages.slice(-10).map(msg => ({
	      role: msg.type === 'user' ? 'user' : 'assistant',
	      content: msg.text
      }));
      
      // Gather ALL financial data from storage
          const financialContext = {
            // Risk Profile
            riskProfile: storage.get('riskProfile'),
            riskProfileAnswers: storage.get('riskProfileAnswers', {}),
            
            // Goals
            goals: storage.get('financialGoals', []),
            
            // Assets & Liabilities
            assets: storage.get('assets', []),
            liabilities: storage.get('liabilities', []),
            netWorth: (() => {
              const assets = storage.get('assets', []);
              const liabilities = storage.get('liabilities', []);
              const totalAssets = assets.reduce((sum: number, a: any) => sum + a.value, 0);
              const totalLiabilities = liabilities.reduce((sum: number, l: any) => sum + l.amount, 0);
              return totalAssets - totalLiabilities;
            })(),
            
            // Income & Expenses
            incomes: storage.get('incomes', []),
            expenses: storage.get('expenses', []),
            monthlyIncome: (() => {
              const incomes = storage.get('incomes', []);
              const getMonthlyAmount = (amount: number, frequency: string) => {
                switch (frequency) {
                  case 'Monthly': return amount;
                  case 'Quarterly': return amount / 3;
                  case 'Yearly': return amount / 12;
                  default: return 0;
                }
              };
              return incomes.reduce((sum: number, i: any) => sum + getMonthlyAmount(i.amount, i.frequency), 0);
            })(),
            monthlyExpenses: (() => {
              const expenses = storage.get('expenses', []);
              const getMonthlyAmount = (amount: number, frequency: string) => {
                switch (frequency) {
                  case 'Monthly': return amount;
                  case 'Quarterly': return amount / 3;
                  case 'Yearly': return amount / 12;
                  default: return 0;
                }
              };
              return expenses.reduce((sum: number, e: any) => sum + getMonthlyAmount(e.amount, e.frequency), 0);
            })(),
            
            // Retirement Planning
            retirementPlan: storage.get('retirementCalculator', {}),
            
            // Summary statistics
            summary: {
              hasRiskProfile: !!storage.get('riskProfile'),
              goalsCount: storage.get('financialGoals', []).length,
              assetsCount: storage.get('assets', []).length,
              liabilitiesCount: storage.get('liabilities', []).length,
              incomesCount: storage.get('incomes', []).length,
              expensesCount: storage.get('expenses', []).length,
              hasRetirementPlan: Object.keys(storage.get('retirementCalculator', {})).length > 0
            }
    };
      
        	
      // Replace with YOUR n8n webhook URL
      const response = await fetch('https://anand-n8n-1234.app.n8n.cloud/webhook/arthaniwealth-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
	      	message: chatInput,
	      	sessionId: sessionId,  // Now persistent per browser
	      	userId: sessionId,     // Now persistent per browser
	      	history: conversationHistory,  // NEW: Include history
	      	context: {
	      	  riskProfile: storage.get('riskProfile'),
	      	  goals: storage.get('goals', []),
	      	  assets: storage.get('assets', [])
	      	}
	      })
      	});
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
       
      // Extract response from n8n - adjust based on your workflow's response format
      const botResponse = data.reply || data.output || data.response || data.message || data.text || "I couldn't process that. Please try again.";
      
      const botMsg = { 
        type: 'bot', 
        text: botResponse, 
        time: new Date().toLocaleTimeString() 
      };
      
      // Replace loading message with actual response
      setChatMessages([...newMessages, botMsg]);
      
    } catch (error) {
      console.error('Error calling n8n:', error);
      const errorMsg = { 
        type: 'bot', 
        text: "Sorry, I'm having trouble connecting. Please check your internet connection and try again.", 
        time: new Date().toLocaleTimeString() 
      };
      setChatMessages([...newMessages, errorMsg]);
    }
    
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
                
                {/* THIS IS THE FIX: */}
		 {msg.type === 'user' ? (
		    // 1. User messages are rendered as simple text.
		    <p className="text-sm">{msg.text}</p>
		  ) : (
		    // 2. Bot messages are wrapped in a div with the styling class 
		    //    and the content is passed to ReactMarkdown.
		    <div className="prose prose-sm">
		      <ReactMarkdown>
			{msg.text}
		      </ReactMarkdown>
		    </div>
                  )}
                
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

