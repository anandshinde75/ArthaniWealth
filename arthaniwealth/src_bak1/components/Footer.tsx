import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Start Your Wealth Journey Today 🚀</h2>
          <p className="text-emerald-200 max-w-2xl mx-auto mb-6">
            Take control of your financial future with intelligent tools and personalized insights from ArthaniWealth.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-full hover:bg-emerald-50 transition-all"
          >
            Get Started <ArrowRight size={18} />
          </a>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-3">ArthaniWealth</h3>
            <p className="text-emerald-200 mb-4">
              Empowering your financial journey with clarity, confidence, and intelligent planning tools.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="hover:text-emerald-200"><Facebook size={20} /></a>
              <a href="#" className="hover:text-emerald-200"><Instagram size={20} /></a>
              <a href="#" className="hover:text-emerald-200"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-emerald-100">
              {['Home', 'Calculators', 'Goals', 'Risk Profile', 'About', 'Contact'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Get in Touch</h4>
            <ul className="space-y-3 text-emerald-100">
              <li className="flex justify-center md:justify-start items-center gap-2">
                <Mail size={18} className="text-emerald-300" /> support@arthaniwealth.com
              </li>
              <li className="flex justify-center md:justify-start items-center gap-2">
                <Phone size={18} className="text-emerald-300" /> +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-700 my-8"></div>

        {/* Bottom Line */}
        <div className="text-center text-sm text-emerald-300">
          © {new Date().getFullYear()} <span className="font-semibold text-white">ArthaniWealth</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
