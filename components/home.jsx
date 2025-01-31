"use client"
import { useState } from "react"
import ContactSection from "./ContactForm";
import PricingCard from "./PricingCard";
import JoinTheWaitlistSection from "./home/JoinTheWaitlist";
import { Header } from "./Header";
import HeroSection from "./home/HeroSection";
import HowItWorksSection from "./home/HowItWorksSection";
import ProblemSection from "./home/ProblemSection";
import KeyFeaturesSection from "./home/KeyFeaturesSection";
import { getNavlinks, getMobileNavlinks } from "./home/Navigation";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isReleased = !!process.env.NEXT_PUBLIC_IS_RELEASED

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const renderWaitlist = () => {
    return (
      <div id="waitlist">
        <JoinTheWaitlistSection />
      </div>
    )
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
      className={`min-h-screen dark bg-slate-900 text-slate-100 transition-colors duration-300`}
    >
      <Header navlink={getNavlinks()} mobileNavlink={getMobileNavlinks({ isMenuOpen, toggleMenu })} toggleMenu={toggleMenu} />
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
