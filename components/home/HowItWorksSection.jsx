'use client';
import { ArrowRight, Clock1, MessageSquare, PenIcon, User2Icon, Users, Workflow, Zap } from "lucide-react"

export default function HowItWorksSection() {
    const funFacts = [
      {
        stat: "2.5 hrs/week",
        title: "Time Saver",
        description: "Reclaim lost time with streamlined task management",
        icon: <Clock1 className="h-6 w-6 text-emerald-600" />,
        backgroundIcon: <Clock1 className="h-24 w-24 text-emerald-500" />,
        detail: "That's almost a full workday saved every week!"
      },
      {
        stat: "40% Less",
        title: "Workflow Optimizer",
        description: "Reduce context switching and boost focus",
        icon: <Workflow className="h-6 w-6 text-emerald-600" />,
        backgroundIcon: <Workflow className="h-24 w-24 text-emerald-500" />,
        detail: "More doing, less app hopping."
      },
      {
        stat: "100% Aligned",
        title: "Team Harmony",
        description: "Keep everyone on the same page, effortlessly",
        icon: <Users className="h-6 w-6 text-emerald-600" />,
        backgroundIcon: <Users className="h-24 w-24 text-emerald-500" />,
        detail: "Real-time updates, zero communication gaps."
      }
    ];

    return (
      <section 
        id="how-it-works" 
        className="relative py-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 opacity-50 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">
              Workflow Magic
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Team Collaboration, Reimagined
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 lg:mx-auto">
              Transform how your team communicates and tracks tasks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Animated Illustration */}
            <div className="hidden md:block relative">
              <svg 
                className="w-full h-auto animate-float" 
                viewBox="0 0 500 400" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="50" y="50" width="400" height="300" rx="20" fill="#d1fae5" />
                <rect x="75" y="80" width="350" height="50" rx="10" fill="#34d399" />
                <rect x="75" y="150" width="300" height="30" rx="5" fill="#34d399" />
                <rect x="75" y="200" width="250" height="30" rx="5" fill="#34d399" />
                <rect x="75" y="250" width="200" height="30" rx="5" fill="#34d399" />
              </svg>
            </div>

            <div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mr-4">
                      <PenIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Instant Task Creation
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Create and assign tasks in seconds. No more endless email chains or forgotten Slack messages.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mr-4">
                      <MessageSquare className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Seamless Slack Integration
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Add tasks directly from Slack with a simple command. Stay in your workflow, keep everything tracked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Facts Section */}
          <div className="mt-16 dark:from-slate-800 dark:to-slate-900 p-8">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              Productivity Superpowers 🚀
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {funFacts.map((fact, index) => (
                <div 
                  key={index} 
                  className="relative group bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    {fact.backgroundIcon}
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-4">
                        {fact.icon}
                      </div>
                      <span className="text-xl font-bold text-emerald-600">
                        {fact.title}
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                      {fact.stat}
                    </p>
                    <p className="text-m font-semibold text-slate-800 dark:text-slate-200 mb-4">
                      {fact.description}
                    </p>
                    <div className="mt-xs text-sm text-slate-500 dark:text-slate-400">
                      {fact.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-xl text-slate-600 dark:text-slate-300 italic">
                "Productivity doesn't have to be boring" - Your New Favorite Tool
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }