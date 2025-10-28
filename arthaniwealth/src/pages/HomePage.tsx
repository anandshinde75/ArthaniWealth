import React from 'react';
import { Calculator, Target, TrendingUp, PieChart, Wallet, DollarSign, Shield, CheckCircle, Users } from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
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
              <h3 className="text-4xl font-bold text-gray-800 mb-2">Rs. 500Cr+</h3>
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
              { icon: PieChart, title: 'Risk Profile', desc: 'Understand your investment risk tolerance', page: 'risk' },
              { icon: DollarSign, title: 'Income & Expenses', desc: 'Track cash flow and identify savings opportunities', page: 'income' },
              { icon: Wallet, title: 'Asset Tracking', desc: 'Monitor assets, liabilities, and net worth', page: 'assets' },
              { icon: Target, title: 'Goal Setting', desc: 'Set and track your financial goals with precision', page: 'goals' },
              { icon: TrendingUp, title: 'Retirement Planning', desc: 'Plan your retirement with advanced projections', page: 'retirement' },
              { icon: Shield, title: 'Insurance Planning', desc: 'Evaluate and optimize your insurance coverage for better protection', page: 'insurance' },
              { icon: Calculator, title: 'Smart Calculators', desc: 'Loan, mortgage, investment, and savings calculators', page: 'calculators' },           
              
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