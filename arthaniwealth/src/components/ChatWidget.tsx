import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, RotateCcw } from "lucide-react";
import { storage, getSessionId } from "../utils/storage";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const history = storage.session.get("chatHistory", []);
    setChatMessages(history);
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    storage.session.set("chatHistory", chatMessages);
  }, [chatMessages]);

  // Auto-scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (chatOpen && messagesEndRef.current) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [chatMessages, chatOpen]);

  const resetConversation = () => {
    if (window.confirm("Are you sure you want to reset the conversation? This will clear all chat history.")) {
      setChatMessages([]);
      storage.session.set("chatHistory", []);
      
      // Show initial greeting after reset
      const risk = storage.get("riskProfile");
      const goals = storage.get("financialGoals", []);

      let greeting =
        "👋 Hi there! I'm your ArthaniWealth assistant. How can I help you today?";

      if (risk || goals.length > 0) {
        greeting = "👋 Welcome back! ";
        if (risk) {
          greeting += `I see your risk profile is ${risk}. `;
        }
        if (goals.length > 0) {
          greeting += `You're tracking ${goals.length} financial goal${goals.length > 1 ? "s" : ""}. `;
        }
        greeting += "How can I assist you with your financial planning?";
      }

      setChatMessages([
        { type: "bot", text: greeting, time: new Date().toLocaleTimeString() },
      ]);
    }
  };

  const openChat = () => {
    setChatOpen(true);
    if (chatMessages.length === 0) {
      const risk = storage.get("riskProfile");
      const goals = storage.get("financialGoals", []);

      let greeting =
        "👋 Hi there! I'm your ArthaniWealth assistant. How can I help you today?";

      if (risk || goals.length > 0) {
        greeting = "👋 Welcome back! ";
        if (risk) {
          greeting += `I see your risk profile is ${risk}. `;
        }
        if (goals.length > 0) {
          greeting += `You're tracking ${goals.length} financial goal${goals.length > 1 ? "s" : ""}. `;
        }
        greeting += "How can I assist you with your financial planning?";
      }

      setChatMessages([
        { type: "bot", text: greeting, time: new Date().toLocaleTimeString() },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = {
      type: "user",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");

    // Show loading state
    const loadingMsg = { type: "bot", text: "...", time: "" };
    setChatMessages([...newMessages, loadingMsg]);

    try {
      // Get persistent session ID
      const sessionId = getSessionId();

      // Build conversation history (last 10 messages)
      const conversationHistory = chatMessages.slice(-10).map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // Gather ALL financial data from storage
            const financialContext = {
              // Risk Profile
              riskProfile: storage.get("riskProfile"),
              riskProfileAnswers: storage.get("riskProfileAnswers", {}),
      
              // Goals
              goals: storage.get("financialGoals", []),
      
              // Assets & Liabilities
              assets: storage.get("assets", []),
              liabilities: storage.get("liabilities", []),
              netWorth: (() => {
                const assets = storage.get("assets", []);
                const liabilities = storage.get("liabilities", []);
                const totalAssets = assets.reduce(
                  (sum: number, a: any) => sum + (a.value || 0),
                  0,
                );
                const totalLiabilities = liabilities.reduce(
                  (sum: number, l: any) => sum + (l.amount || 0),
                  0,
                );
                return totalAssets - totalLiabilities;
              })(),
      
              // Income & Expenses
              incomes: storage.get("incomes", []),
              expenses: storage.get("expenses", []),
              monthlyIncome: (() => {
                const incomes = storage.get("incomes", []);
                const getMonthlyAmount = (amount: number, frequency: string) => {
                  switch (frequency) {
                    case "Monthly":
                      return amount;
                    case "Quarterly":
                      return amount / 3;
                    case "Yearly":
                      return amount / 12;
                    default:
                      return 0;
                  }
                };
                return incomes.reduce(
                  (sum: number, i: any) =>
                    sum + getMonthlyAmount(i.amount || 0, i.frequency),
                  0,
                );
              })(),
              monthlyExpenses: (() => {
                const expenses = storage.get("expenses", []);
                const getMonthlyAmount = (amount: number, frequency: string) => {
                  switch (frequency) {
                    case "Monthly":
                      return amount;
                    case "Quarterly":
                      return amount / 3;
                    case "Yearly":
                      return amount / 12;
                    default:
                      return 0;
                  }
                };
                return expenses.reduce(
                  (sum: number, e: any) =>
                    sum + getMonthlyAmount(e.amount || 0, e.frequency),
                  0,
                );
              })(),
      
              // Retirement Planning
              retirementPlan: storage.get("retirementCalculator", {}),
      
              // Insurance Assessment
              insurancePlan: (() => {
                const insuranceData = storage.get("insuranceCalculator", {});
                if (Object.keys(insuranceData).length === 0) return {};
      
                const loans = insuranceData.loans || [];
                const goals = insuranceData.goals || [];
                const totalLoans = loans.reduce(
                  (sum: number, l: any) => sum + (l.amount || 0),
                  0,
                );
                const totalGoals = goals.reduce(
                  (sum: number, g: any) => sum + (g.amount || 0),
                  0,
                );
      
                // Calculate corpus for future expenses
                const monthlyExpenses = insuranceData.monthlyExpenses || 0;
                const discountingFactor = insuranceData.discountingFactor || 0;
                const netMonthlyExpenses =
                  monthlyExpenses * (1 - discountingFactor / 100);
                const currentAnnualExpenses = netMonthlyExpenses * 12;
                const spouseAge = insuranceData.spouseAge || 0;
                const spouseLifeExpectancy = insuranceData.spouseLifeExpectancy || 0;
                const remainingLife = spouseLifeExpectancy - spouseAge;
                const inflationRate = insuranceData.inflationRate || 0;
                const postTaxReturns = insuranceData.postTaxReturns || 0;
                const netReturns =
                  ((1 + postTaxReturns / 100) / (1 + inflationRate / 100) - 1) * 100;
                const r = netReturns / 100;
                const n = remainingLife > 0 ? remainingLife : 0;
                const corpusForFutureExpenses =
                  r > 0 && n > 0
                    ? currentAnnualExpenses * ((1 - Math.pow(1 + r, -n)) / r)
                    : currentAnnualExpenses * n;
      
                const totalInsuranceRequired =
                  totalLoans + totalGoals + corpusForFutureExpenses;
                const investmentAssets = insuranceData.investmentAssets || 0;
                const existingInsurance = insuranceData.existingInsurance || 0;
                const totalResourcesAvailable = investmentAssets + existingInsurance;
                const additionalCoverRequired = Math.max(
                  0,
                  totalInsuranceRequired - totalResourcesAvailable,
                );
                const coverageGapPercent =
                  totalInsuranceRequired > 0
                    ? ((additionalCoverRequired / totalInsuranceRequired) * 100).toFixed(1)
                    : "0";
      
                return {
                  loans,
                  goals,
                  monthlyExpenses,
                  spouseAge,
                  spouseLifeExpectancy,
                  corpusForFutureExpenses,
                  totalInsuranceRequired,
                  totalResourcesAvailable,
                  additionalCoverRequired,
                  coverageGapPercent,
                };
              })(),
      
              // Summary statistics
              summary: {
                hasRiskProfile: !!storage.get("riskProfile"),
                goalsCount: storage.get("financialGoals", []).length,
                assetsCount: storage.get("assets", []).length,
                liabilitiesCount: storage.get("liabilities", []).length,
                incomesCount: storage.get("incomes", []).length,
                expensesCount: storage.get("expenses", []).length,
                hasRetirementPlan:
                  Object.keys(storage.get("retirementCalculator", {})).length > 0,
                hasInsurancePlan:
                  Object.keys(storage.get("insuranceCalculator", {})).length > 0,
              },
      };

      // Replace with YOUR n8n webhook URL
      const response = await fetch(
       "https://arthaniwealth.app.n8n.cloud/webhook/arthaniwealth-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: chatInput,
            sessionId: sessionId,
            userId: sessionId,
            history: conversationHistory,
            financialData: financialContext, // Complete financial profile
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Extract response from n8n
      const botResponse =
        data.reply ||
        data.output ||
        data.response ||
        data.message ||
        data.text ||
        "I couldn't process that. Please try again.";

      const botMsg = {
        type: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString(),
      };

      // Replace loading message with actual response
      setChatMessages([...newMessages, botMsg]);
    } catch (error) {
      console.error("Error calling n8n:", error);
      const errorMsg = {
        type: "bot",
        text: "Sorry, I'm having trouble connecting. Please check your internet connection and try again.",
        time: new Date().toLocaleTimeString(),
      };
      setChatMessages([...newMessages, errorMsg]);
    }

    setChatInput("");
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
        <div
          className={`fixed bottom-6 right-1/2 translate-x-1/2 md:right-6 md:translate-x-0 
                ${isMaximized ? "w-[95vw] h-[90vh]" : "w-[90vw] sm:w-96 h-[500px]"}
                bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-white" size={20} />
              <span className="text-white font-semibold">
                ArthaniWealth Assistant
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset Conversation Button */}
              <button
                onClick={resetConversation}
                className="text-white hover:bg-white/20 rounded-full p-1"
                title="Reset conversation"
              >
                <RotateCcw size={18} />
              </button>

              {/* Maximize / Minimize Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-white hover:bg-white/20 rounded-full p-1"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 4h8v16H8z"
                    />
                  </svg>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg: any, idx: number) => (
              <div
                key={idx}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.type === "user"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.type === "user" ? (
                    <p className="text-sm">{msg.text}</p>
                  ) : (
                    <div className="prose prose-sm">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${msg.type === "user" ? "text-emerald-100" : "text-gray-500"}`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {/* Invisible element for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
    </>
  );
}