import React, { useState } from "react";

type Option = { label: string; score: number };
type Question = { id: number; question: string; options: Option[] };

const questions: Question[] = [
  { id: 1, question: "What is your age?", options: [{ label: "Under 30", score: 3 }, { label: "31-45", score: 2 }, { label: "Over 45", score: 1 }] },
  { id: 2, question: "What is your investment horizon?", options: [{ label: "More than 10 years", score: 3 }, { label: "5-10 years", score: 2 }, { label: "Less than 5 years", score: 1 }] },
  { id: 3, question: "How would you describe your investment knowledge?", options: [{ label: "Extensive", score: 3 }, { label: "Moderate", score: 2 }, { label: "Limited", score: 1 }] },
  { id: 4, question: "How would you react to a 20% drop in your investment value?", options: [{ label: "I would buy more", score: 3 }, { label: "I would stay invested", score: 2 }, { label: "I would sell", score: 1 }] },
  { id: 5, question: "What is your primary investment goal?", options: [{ label: "Wealth creation", score: 3 }, { label: "Balanced growth & safety", score: 2 }, { label: "Capital preservation", score: 1 }] },
  { id: 6, question: "How often do you review your investment portfolio?", options: [{ label: "Quarterly", score: 3 }, { label: "Annually", score: 2 }, { label: "Rarely/Never", score: 1 }] },
  { id: 7, question: "How much of your annual income do you invest?", options: [{ label: "> 20%", score: 3 }, { label: "10-20%", score: 2 }, { label: "< 10%", score: 1 }] },
  { id: 8, question: "How would you rate your ability to handle financial losses?", options: [{ label: "High tolerance", score: 3 }, { label: "Moderate tolerance", score: 2 }, { label: "Low tolerance", score: 1 }] },
  { id: 9, question: "What percentage of your investments are in high-risk assets?", options: [{ label: "> 50%", score: 3 }, { label: "20-50%", score: 2 }, { label: "< 20%", score: 1 }] },
  { id: 10, question: "What is your current financial situation?", options: [{ label: "Stable, surplus income", score: 3 }, { label: "Manageable, break-even", score: 2 }, { label: "Tight, limited savings", score: 1 }] },
];

export default function RiskProfile() {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const handleOptionSelect = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const resetAnswers = () => setAnswers({});

  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

  // Determine risk profile dynamically
  let riskProfile: string | null = null;
  if (Object.keys(answers).length > 0) {
    if (totalScore >= 27) riskProfile = "Aggressive";
    else if (totalScore >= 18) riskProfile = "Moderate";
    else riskProfile = "Conservative";
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">📊 Investment Risk Profile</h1>

      {/* Top Reset Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={resetAnswers}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm"
        >
          🔄 Reset
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-white shadow rounded-lg p-3">
            <p className="font-semibold text-gray-700 mb-1">{q.id}. {q.question}</p>
            <div className="flex flex-col gap-1">
              {q.options.map((opt) => (
                <label
                  key={opt.label}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 ${
                    answers[q.id] === opt.score ? "bg-indigo-50 border border-indigo-400" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={answers[q.id] === opt.score}
                    onChange={() => handleOptionSelect(q.id, opt.score)}
                    className="accent-indigo-600"
                  />
                  <span className="text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-indigo-600"
            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 text-right">{Object.keys(answers).length}/{questions.length} answered</p>
      </div>

      {/* Risk Profile Result */}
      {riskProfile && (
        <div className="mt-6 p-4 rounded-lg shadow bg-white text-center">
          <p className="text-lg font-semibold text-gray-800 mb-1">Risk Appetite:</p>
          <p className={`text-xl font-bold ${
            riskProfile === "Aggressive" ? "text-red-600" :
            riskProfile === "Moderate" ? "text-yellow-600" :
            "text-green-600"
          }`}>
            {riskProfile}
          </p>

          {/* Bottom Reset Button AFTER Results */}
          <div className="flex justify-center mt-4">
            <button
              onClick={resetAnswers}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
