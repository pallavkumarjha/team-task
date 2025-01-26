'use client'
import { Send } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
    const openEmail = () => {
        window.open('mailto:pallavkumarjha26@gmail.com', '_blank');
    };
    
    return (
      <footer className="bg-slate-700 text-slate-200 shadow-lg">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-teal-300">Snap Note</span>
            <p className="mt-2 text-sm text-slate-300">
              Simplifying team communication and task management.
            </p>
            <svg className="w-20 h-20" viewBox="0 0 200 200">
            <rect x="45" y="45" width="110" height="25" fill="#34d399" rx="8" />
            <rect x="45" y="80" width="110" height="15" fill="#34d399" rx="4" />
            <rect x="45" y="105" width="90" height="15" fill="#34d399" rx="4" />
            <rect x="45" y="130" width="70" height="15" fill="#34d399" rx="4" />
          </svg>
          </div>
          <div className="col-span-1 md:col-span-1">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="#features"
                  className="text-base text-slate-300 hover:text-teal-300 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-base text-slate-300 hover:text-teal-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-base text-slate-300 hover:text-teal-300 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-600 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Button
                className="text-slate-400 hover:text-teal-300 transition-colors bg-transparent shadow-none"
                onClick={openEmail}
            >
                <Send className="h-6 w-6" />
            </Button>
          </div>
          <p className="mt-8 text-base text-slate-400 md:mt-0 md:order-1">
            &copy; 2025 Snap Note. All rights reserved. <a href="/privacy" className="text-slate-400 hover:text-teal-300 transition-colors underline bold">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
    )
  }
  