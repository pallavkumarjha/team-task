"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, MessageSquare, Users, Zap, Moon, Sun, Menu, LogOut, Loader2, LogIn } from "lucide-react"
import { signOut, useSession } from "next-auth/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useDarkMode } from '../hooks/useDarkMode'
import { Button } from "../components/ui/button"
import ContactSection from "./ContactForm"
import PricingCard from "./PricingCard";
import JoinTheWaitlistSection from "./JoinTheWaitlist";

export default function HomePage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGettingProfile, setIsGettingProfile] = useState(true)
  const { data: session, status } = useSession();
  const { user } = session || {};
  const isReleased = !!process.env.NEXT_PUBLIC_IS_RELEASED

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    if (status !== 'loading') {
      setIsGettingProfile(false)
    }
  }, [status])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const renderLoginArea = () => {
    if (isReleased) {
      return null
    }

    if (isGettingProfile) {
      return (
        <div className="flex items-center mr-8">
          <Loader2 className="animate-spin h-5 w-5" />
        </div>
      )
    }

    return user ? (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button 
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 mr-8 rounded-full border-2 border-emerald-500 hover:ring-2 hover:ring-emerald-300 transition-all"
          >
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className="z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1 min-w-[200px] transition-colors duration-300"
            sideOffset={5}
          >
            <DropdownMenu.Item 
              className="flex items-center px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md cursor-pointer text-slate-900 dark:text-slate-200 transition-colors"
              onSelect={handleLogout}
            >
              Hello, {session.user.name}
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1" />
            <DropdownMenu.Item 
              className="flex items-center px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-md cursor-pointer text-red-500 transition-colors"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenu.Item>
            <DropdownMenu.Arrow className="fill-slate-200 dark:fill-slate-700" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ) : (
      <Link
        href="/login"
        className="hidden sm:inline-flex items-center px-4 mr-16 py-2 border border-transparent text-sm font-medium rounded-full shadow-neomorphic-light dark:shadow-neomorphic-dark text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        Login
      </Link>
    )
  }

  const renderWaitlist = () => {
    return (
      <div id="waitlist">

      <JoinTheWaitlistSection />

      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"} transition-colors duration-300`}
    >
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-neomorphic-light dark:shadow-neomorphic-dark">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">NoteHub</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#how-it-works">How It Works</NavLink>
                {!isReleased && <NavLink href="#pricing">Pricing</NavLink>}
                <NavLink href="#contact">Contact</NavLink>
              </div>
            </div>
            <div className="flex items-center">
              {renderLoginArea()}
              <Button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 shadow-neomorphic-light dark:shadow-neomorphic-dark mr-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="sm:hidden">
                <Button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <MobileNavLink href="#features" onClick={toggleMenu}>
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
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HeroSection />
        <FeaturesSection />
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

function HeroSection() {
  return (
    <section className="mb-24">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-emerald-600 dark:text-emerald-400">NoteHub</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
          Effortless note-sharing without the boring setup. Collaborate in seconds!
          </p>
          <Link
            href="/#how-it-works"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full shadow-neomorphic-light dark:shadow-neomorphic-dark hover:bg-emerald-600 transition duration-300"
          >
            Join waitlist
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <svg className="w-64 h-64" viewBox="0 0 200 200">
            <defs>
              <filter id="neomorphism">
                <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
                <feOffset in="blur" dx="5" dy="5" result="offsetBlur" />
                <feFlood floodColor="#ffffff" floodOpacity="0.5" result="offsetColor" />
                <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="30" y="30" width="140" height="140" fill="#d1fae5" rx="20" filter="url(#neomorphism)" />
            <rect x="45" y="45" width="110" height="25" fill="#34d399" rx="8" />
            <rect x="45" y="80" width="110" height="15" fill="#34d399" rx="4" />
            <rect x="45" y="105" width="90" height="15" fill="#34d399" rx="4" />
            <rect x="45" y="130" width="70" height="15" fill="#34d399" rx="4" />
          </svg>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="mb-24">
      <h2 className="text-3xl font-semibold mb-8 text-center">Key Features</h2>
      <div className="grid md:grid-cols-3 gap-12">
        <FeatureCard
          icon={<MessageSquare className="w-8 h-8 text-emerald-500" />}
          title="Clear Communication"
          description="Organize requests and messages in an easy-to-read format."
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8 text-emerald-500" />}
          title="Quick Updates"
          description="Skip the endless Slack threads. Drop quick notes, requests, and updates in seconds."
        />
        <FeatureCard
          icon={<Users className="w-8 h-8 text-emerald-500" />}
          title="Team Collaboration"
          description="Add members to your board and share notes with your team."
        />
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-6 text-center transition-transform hover:scale-105">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  )
}

function HowItWorksSection() {
  const steps = [
    { title: "Sign In using Slack", description: "Access your NoteHub account securely using slack", icon: <LogIn className="w-8 h-8 text-emerald-500" /> },
    { title: "Select Board", description: "Choose a board which you are part of or create new one", icon: <Users className="w-8 h-8 text-emerald-500" /> },
    { title: "Add a Note", description: "Write something on your team member's note. Mark it as crtitical if necessary", icon: <MessageSquare className="w-8 h-8 text-emerald-500" /> }
  ];

  return (
    <section id="how-it-works" className="mb-24">
      <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex flex-col items-center text-center max-h-36 min-h-36">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4 shadow-neomorphic-light dark:shadow-neomorphic-dark">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{step.icon}</span>
                </div>
                <h3 className="text-lg h-8 font-semibold mb-2">{step.title}</h3>
                <p className="text-sm h-8 text-slate-600 dark:text-slate-300">{step.description}</p>
              </div>
              {index < steps.length && (
                <div className="hidden md:block w-full h-0.5 bg-emerald-200 dark:bg-emerald-700 mt-8 relative">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 dark:bg-emerald-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
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
