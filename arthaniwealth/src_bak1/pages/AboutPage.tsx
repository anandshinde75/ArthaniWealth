import React from 'react';
import { TrendingUp, Target, Wallet, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Title Section */}
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        About ArthaniWealth
      </h1>

      {/* Intro Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
        <p className="text-lg text-gray-700 mb-4">
          ArthaniWealth is your intelligent financial companion designed to help you
          <span className="font-semibold text-emerald-600"> plan, grow, and manage</span> your wealth with confidence.
        </p>
        <p className="text-gray-700 mb-4">
          Our mission is simple — to make financial planning smart, accessible, and emotionally empowering for every Indian household.
        </p>
        <p className="text-gray-700">
          With our AI-driven tools, insightful dashboards, and behavioral nudges, ArthaniWealth helps you
          make smarter investment decisions and stay on track toward your goals.
        </p>
      </div>

      {/* Core Values Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: 'Goal-Centric Planning',
              desc: 'We believe every investment should serve a clear life goal — whether it’s buying your dream home, securing education, or retiring early.'
            },
            {
              icon: Wallet,
              title: 'Simplicity & Transparency',
              desc: 'Finance shouldn’t feel complex. Our tools simplify decision-making, so you understand where every rupee goes.'
            },
            {
              icon: TrendingUp,
              title: 'Long-Term Growth',
              desc: 'We encourage disciplined investing, compounding, and a mindset that builds sustainable wealth — not quick wins.'
            }
          ].map((value, idx) => (
            <div
              key={idx}
              className="card text-center hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Vision</h2>
        <div className="max-w-3xl mx-auto">
          <Users className="text-emerald-600 mx-auto mb-6" size={48} />
          <p className="text-gray-700 text-lg leading-relaxed">
            To empower <span className="font-semibold text-emerald-600">10 million Indians</span> to take control of their
            financial lives through smarter planning, emotional awareness, and AI-powered insights.
          </p>
        </div>
      </section>
    </div>
  );
}
