"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, MessageSquare, Users, Zap, Moon, Sun, Menu } from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"
// import { useDarkMode } from "../hooks/useDarkMode"

export default function HomePage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

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
                <NavLink href="#pricing">Pricing</NavLink>
                <NavLink href="#contact">Contact</NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center px-4 mr-16 py-2 border border-transparent text-sm font-medium rounded-full shadow-neomorphic-light dark:shadow-neomorphic-dark text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Dashboard
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 shadow-neomorphic-light dark:shadow-neomorphic-dark mr-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="sm:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                >
                  <Menu className="h-6 w-6" />
                </button>
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
              <MobileNavLink href="#pricing" onClick={toggleMenu}>
                Pricing
              </MobileNavLink>
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
        {/* <PricingSection /> */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:border-slate-700"
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
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full shadow-neomorphic-light dark:shadow-neomorphic-dark hover:bg-emerald-600 transition duration-300"
          >
            Go to Dashboard
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
    { title: "Sign In", description: "Access your NoteHub account securely" },
    { title: "Select Board", description: "Choose a team member's board or create a new one" },
    { title: "Add Note", description: "Click to create a new virtual sticky note" },
    { title: "Write Message", description: "Type your message or request clearly" },
    { title: "Post Note", description: "Share the note on the selected board" }
  ];

  return (
    <section id="how-it-works" className="mb-24">
      <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4 shadow-neomorphic-light dark:shadow-neomorphic-dark">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
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

// function PricingSection() {
//   return (
//     <section id="pricing" className="mb-24">
//       <h2 className="text-3xl font-semibold mb-8 text-center">Pricing Plans</h2>
//       <div className="grid md:grid-cols-3 gap-8">
//         <PricingCard
//           title="Basic"
//           price="$9"
//           features={["Up to 5 team members", "100 notes per month", "Basic integrations", "Email support"]}
//         />
//         <PricingCard
//           title="Pro"
//           price="$29"
//           features={["Up to 20 team members", "Unlimited notes", "Advanced integrations", "Priority support"]}
//           highlighted={true}
//         />
//         <PricingCard
//           title="Enterprise"
//           price="Custom"
//           features={["Unlimited team members", "Unlimited notes", "Custom integrations", "24/7 dedicated support"]}
//         />
//       </div>
//     </section>
//   )
// }

// function PricingCard({
//   title,
//   price,
//   features,
//   highlighted = false,
// }) {
//   return (
//     <div
//       className={`bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-6 text-center ${highlighted ? "ring-2 ring-emerald-500 dark:ring-emerald-400" : ""}`}
//     >
//       <h3 className="text-2xl font-semibold mb-2">{title}</h3>
//       <div className="text-4xl font-bold mb-4">
//         {price}
//         <span className="text-sm font-normal">/month</span>
//       </div>
//       <ul className="text-left mb-6">
//         {features.map((feature, index) => (
//           <li key={index} className="flex items-center mb-2">
//             <svg
//               className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//             </svg>
//             {feature}
//           </li>
//         ))}
//       </ul>
//       <button
//         className={`w-full py-2 px-4 rounded-full font-semibold ${highlighted ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"} shadow-neomorphic-light dark:shadow-neomorphic-dark hover:opacity-90 transition-opacity`}
//       >
//         Choose Plan
//       </button>
//     </div>
//   )
// }

function ContactSection() {
  return (
    <section id="contact" className="mb-24">
      <h2 className="text-3xl font-semibold mb-8 text-center">Contact Us</h2>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Have questions or feedback? We'd love to hear from you. Fill out the form, and we'll get back to you as
              soon as possible.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-emerald-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-slate-600 dark:text-slate-300">support@notehub.com</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-emerald-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span className="text-slate-600 dark:text-slate-300">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-neomorphic-light dark:shadow-neomorphic-dark text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-700 text-slate-200 shadow-lg">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <span className="text-2xl font-bold text-teal-300">Team Task</span>
          <p className="mt-2 text-sm text-slate-300">
            Simplifying team communication and task management.
          </p>
        </div>
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
                href="#pricing"
                className="text-base text-slate-300 hover:text-teal-300 transition-colors"
              >
                Pricing
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">
            Company
          </h3>
          <ul className="mt-4 space-y-4">
            <li>
              <a
                href="#about"
                className="text-base text-slate-300 hover:text-teal-300 transition-colors"
              >
                About
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
      <div className="mt-8 border-t border-slate-600 pt-8 md:flex md:items-center md:justify-between">
        <div className="flex space-x-6 md:order-2">
          {['Facebook', 'Twitter', 'GitHub'].map((social) => (
            <a 
              key={social} 
              href="#" 
              className="text-slate-400 hover:text-teal-300 transition-colors"
            >
              <span className="sr-only">{social}</span>
              {/* Add appropriate social media icon here */}
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                {/* Placeholder path, replace with actual icon paths */}
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          ))}
        </div>
        <p className="mt-8 text-base text-slate-400 md:mt-0 md:order-1">
          &copy; 2024 Team Task. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

