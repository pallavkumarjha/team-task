"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, MessageSquare, Users, Zap, LogIn, TicketCheck, NotebookIcon, PenIcon, Mail, Twitter, Linkedin, Loader2, Send, ArrowUpRight, Clock, Clock1, Workflow, User2Icon } from "lucide-react"
import { useDarkMode } from '../hooks/useDarkMode'
import ContactSection from "./ContactForm";
import PricingCard from "./PricingCard";
import JoinTheWaitlistSection from "./JoinTheWaitlist";
import { Header } from "./Header";

export default function HomePage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isReleased = !!process.env.NEXT_PUBLIC_IS_RELEASED

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const renderWaitlist = () => {
    return (
      <div id="waitlist">
        <JoinTheWaitlistSection />
      </div>
    )
  }

  const getNavlinks = () => {
    return (
      <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
        <NavLink href="#key-features">Features</NavLink>
        <NavLink href="#how-it-works">How It Works</NavLink>
        {!isReleased && <NavLink href="#pricing">Pricing</NavLink>}
        <NavLink href="#contact">Contact</NavLink>
      </div>
    )
  }

  const getMobileNavlinks = () => {
    if (!isMenuOpen) return null;
    
    return (
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <MobileNavLink href="#key-features" onClick={toggleMenu}>
            Features
          </MobileNavLink>
          <MobileNavLink href="#how-it-works" onClick={toggleMenu}>
            How It Works
          </MobileNavLink>
          {!isReleased && (
            <MobileNavLink href="#pricing" onClick={toggleMenu}>
              Pricing
            </MobileNavLink>
          )}
          <MobileNavLink href="#contact" onClick={toggleMenu}>
            Contact
          </MobileNavLink>
        </div>
      </div>
    );
  }

  const ProblemSection = () => {
    const problemPoints = [
      {
        icon: <MessageSquare className="h-6 w-6 text-emerald-500" />,
        text: "Slack pings get lost in endless threads",
        description: "Important messages disappear in the noise of team communication"
      },
      {
        icon: <Users className="h-6 w-6 text-emerald-500" />,
        text: "Jira feels like overkill for small tasks",
        description: "Complex project management tools create unnecessary overhead"
      },
      {
        icon: <Zap className="h-6 w-6 text-emerald-500" />,
        text: "Quick requests get forgotten",
        description: "Critical small tasks fall through the cracks of communication"
      }
    ];

    return (
      <section 
        id="problem" 
        className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 m-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">
              The Problem
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Small Tasks Are Slipping Through the Cracks
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 lg:mx-auto">
              Team collaboration is broken. Existing tools are either too noisy or too complex.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {problemPoints.map((point, index) => (
                <div key={index} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                      {point.icon}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-slate-900 dark:text-slate-100">
                      {point.text}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
                    {point.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              That's why we created a lightweight collaboration tool for the little things.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const KeyFeaturesSection = () => {
    const features = [
      {
        icon: <NotebookIcon className="h-6 w-6 text-emerald-500" />,
        title: "Sticky Notes for Everyone",
        description: "Each teammate gets a personal sticky note. Easily add tasks to a colleague's note, keeping everyone aligned.",
        comingSoon: false
      },
      {
        icon: <PenIcon className="h-6 w-6 text-emerald-500" />,
        title: "Quick Task Updates from Slack",
        description: "Add a request directly to your's sticky note—right from Slack. No more switching tools or losing track.",
        comingSoon: false
      },
      {
        icon: <Users className="h-6 w-6 text-emerald-500" />,
        title: "Real-Time Updates",
        description: "Changes are instantly visible to everyone. Stay aligned without needing to refresh or check in repeatedly.",
        comingSoon: true
      },
      {
        icon: <TicketCheck className="h-6 w-6 text-emerald-500" />,
        title: "Mark Tasks as Done or Critical",
        description: "Keep the board clean and organized by marking requests as complete or critical with a single click.",
        comingSoon: false
      },
      {
        icon: <Zap className="w-8 h-8 text-emerald-500" />,
        title: "Lightweight and Fast",
        description: "Built for speed—no bloated features or steep learning curves. Just simple task management that works.",
        comingSoon: false
      }
    ];

    return (
      <section 
        id="key-features" 
        className="py-16 bg-white dark:bg-slate-800 transition-colors duration-300 rounded-3xl mb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">
              Key Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              The Only Tool You Need for Quick, Clutter-Free Team Tasks
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 lg:mx-auto">
              Streamline your team's communication and task management with our intuitive platform.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                      {feature.icon}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-slate-900 dark:text-slate-100">
                      {feature.title}
                      {feature.comingSoon && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-emerald-600 bg-emerald-100 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    );
  }

  const HowItWorksSection = () => {
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

            {/* Step-by-Step Process */}
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

  const HeroSection = () => {
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
                  {/* Background Shape */}
                  <path 
                    d="M250 50 
                       Q350 150, 300 250 
                       Q250 350, 150 300 
                       Q50 250, 250 50" 
                    fill="#d1fae5" 
                    className="animate-morph"
                  />
                  
                  {/* Task Cards */}
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
    );
  }

  const PricingSection = () => {
    return (
      <section id="pricing" className="mb-24">
        <h2 className="text-3xl font-semibold mb-8 text-center">Pricing Plans</h2>
        <div className="grid md:grid-cols-2 gap-16">
          <PricingCard
            title="Basic"
            price="Free"
            features={["Up to 5 team members", "100 notes per month", "Basic integrations", "Email support"]}
            highlighted={true}
          />
          {/* <PricingCard
            title="Pro"
            price="$29"
            features={["Up to 20 team members", "Unlimited notes", "Advanced integrations", "Priority support"]}
            highlighted={true}
          /> */}
          <PricingCard
            title="Enterprise"
            price="Custom"
            features={["Unlimited team members", "Unlimited notes", "Custom integrations", "24/7 dedicated support"]}
          />
        </div>
      </section>
    )
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"} transition-colors duration-300`}
    >
      <Header navlink={getNavlinks()} mobileNavlink={getMobileNavlinks()} setDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HeroSection />
        <ProblemSection />
        <KeyFeaturesSection />
        <HowItWorksSection />
        {renderWaitlist()}
        {!isReleased && <PricingSection />}
        <ContactSection />
      </main>
    </div>
  )
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="
      inline-flex
      items-center
      px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:border-slate-700"
    >
      {children}
    </a>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <a
      href={href}
      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 dark:hover:border-slate-600"
      onClick={onClick}
    >
      {children}
    </a>
  )
}
