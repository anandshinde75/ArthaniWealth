import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { storage } from './StorageUtils';

interface Message {
  type: 'user' | 'bot';
  text: string;
  time: string;
}

export default function ChatWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Load previous chat from session
  useEffect(() => {
    const history = storage.session.get('chatHistory', []);
    setChatMessages(history);
  }, []);

  // Save chat to session
  useEffect(() => {
    storage.session.set('chatHistory', chatMessages);
  }, [chatMessages]);

  // Open chat with greeting
  const openChat = () => {
    setChatOpen(true);
    if (chatMessages.length === 0) {
      const risk = storage.get('riskProfile');
      const goals = storage.get('goals', []);
      let greeting = "👋 Hi there! I'm your ArthaniWealth assistant. How can I help you today?";

      if (risk || goals.length > 0) {
        greeting = "👋 Welcome back! ";
        if (risk) greeting += `Your risk profile is ${risk}. `;
        if (goals.length > 0) greeting += `You're tracking ${goals.length} goal${goals.length > 1 ? 's' : ''}. `;
        greeting += "How can I assist you today?";
      }

      setChatMessages([{ type: 'bot', text: greeting, time: new Date().toLocaleTimeString() }]);
    }
  };

  // Send user message and auto-generate bot reply
  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg: Message = { type: 'user', text: chatInput.trim(), time: new Date().toLocaleTimeString() };
    const newMessages = [...chatMessages, userMsg];

    // Determine bot reply
    let botResponse = "That's a great question! I can help you with calculators, goals, risk assessment, and financial planning.";
    const text = chatInput.toLowerCase();

    if (text.includes('risk')) {
      const risk = storage.get('riskProfile');
      botResponse = risk
        ? `Your current risk profile is ${risk}. This helps me tailor investment recommendations for you.`
        : "You can complete your Risk Profile assessment to get personalized recommendations.";
    } else if (text.includes('goal')) {
      const goals = storage.get('goals', []);
      botResponse = goals.length > 0
        ? `You have ${goals.length} active goal${goals.length > 1 ? 's' : ''}. Would you like to review or edit them?`
        : "You can start setting goals in the 'Financial Goals' section to track your progress.";
    } else if (text.includes('invest')) {
      botResponse = "Investment strategy depends on your goals, time horizon, and risk tolerance. Would you like to explore options?";
    } else if (text.includes('save')) {
      botResponse = "A good savings plan starts with budgeting and automation. Use our calculators to see how small savings can grow big!";
    }

    const botMsg: Message = { type: 'bot', text: botResponse, time: new Date().toLocaleTimeString() };
    setChatMessages([...newMessages, botMsg]);
    setChatInput('');
  };

  return (
    <>
      {/* Floating Chat Button */}
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
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-emerald-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold">
              <MessageCircle size={20} />
              <span>ArthaniWealth Assistant</span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} chat-bubble`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-snug">{msg.text}</p>
                  <p
                    className={`text-[11px] mt-1 text-right ${
                      msg.type === 'user' ? 'text-emerald-100' : 'text-gray-500'
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500 text-sm"
              />
              <button
                onClick={sendMessage}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
