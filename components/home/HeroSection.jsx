"use client"
import { ArrowRight, User2Icon } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 opacity-50 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                New: Lightweight Team Collaboration
              </span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Streamline Team <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                Requests & Notes
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl">
              Transform how your team communicates. Create, track, and resolve tasks with unprecedented ease.
            </p>
            
            <div className="flex space-x-4">
              <Link
                href="/#waitlist"
                className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition duration-300 shadow-lg hover:shadow-xl group"
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#problem"
                className="inline-flex items-center px-6 py-3 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition duration-300 group"
              >
                Learn More
                <User2Icon className="ml-2 h-5 w-5 text-emerald-500 transform group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center relative">
            <div className="w-full max-w-md aspect-square relative">
              <svg 
                viewBox="0 0 500 500" 
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full animate-float"
              >
                <path 
                  d="M250 50 
                     Q350 150, 300 250 
                     Q250 350, 150 300 
                     Q50 250, 250 50" 
                  fill="#d1fae5" 
                  className="animate-morph"
                />
                
                <rect 
                  x="100" y="150" 
                  width="300" height="50" 
                  rx="10" 
                  fill="#34d399" 
                  className="animate-slide"
                />
                <rect 
                  x="150" y="250" 
                  width="250" height="50" 
                  rx="10" 
                  fill="#34d399" 
                  className="animate-slide delay-200"
                />
                <rect 
                  x="200" y="350" 
                  width="200" height="50" 
                  rx="10" 
                  fill="#34d399" 
                  className="animate-slide delay-500"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes morph {
          0%, 100% { d: path('M250 50 Q350 150, 300 250 Q250 350, 150 300 Q50 250, 250 50'); }
          50% { d: path('M250 100 Q400 200, 300 300 Q200 400, 100 250 Q50 200, 250 100'); }
        }

        @keyframes slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }

        .animate-slide {
          animation: slide 3s ease-in-out infinite;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  )
}