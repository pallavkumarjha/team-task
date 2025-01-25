"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, MessageSquare, Users, Zap, LogIn, TicketCheck, NotebookIcon, PenIcon, Mail, Twitter, Linkedin, Loader2, Send, ArrowUpRight, Clock } from "lucide-react"
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
        <NavLink href="#features">Features</NavLink>
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
        icon: <Zap className="h-6 w-6 text-emerald-600" />,
        backgroundIcon: <Zap className="h-24 w-24 text-emerald-500" />,
        detail: "That's almost a full workday saved every week!"
      },
      {
        stat: "40% Less",
        title: "Workflow Optimizer",
        description: "Reduce context switching and boost focus",
        icon: <Users className="h-6 w-6 text-emerald-600" />,
        backgroundIcon: <Users className="h-24 w-24 text-emerald-500" />,
        detail: "More doing, less app hopping."
      },
      {
        stat: "100% Aligned",
        title: "Team Harmony",
        description: "Keep everyone on the same page, effortlessly",
        icon: <MessageSquare className="h-6 w-6 text-emerald-600" />,
        backgroundIcon: <MessageSquare className="h-24 w-24 text-emerald-500" />,
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
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                      {fact.stat}
                    </p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                      {fact.description}
                    </p>
                    <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
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
      <section className="mb-24">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to <span className="text-emerald-600 dark:text-emerald-400">SnapNote</span>
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
            <svg 
              className="w-64 h-64 animate-svg" 
              viewBox="0 0 200 200"
              style={{
                animation: 'gentle-float 3s ease-in-out infinite alternate',
              }}
            >
              <rect 
                x="30" y="30" width="140" height="140" 
                fill="#d1fae5" 
                rx="20" 
                style={{
                  animation: 'gentle-scale 3s ease-in-out infinite alternate',
                }}
              />
              <rect 
                x="45" y="45" width="110" height="25" 
                fill="#34d399" 
                rx="8" 
                style={{
                  animation: 'gentle-move-x 3s ease-in-out infinite alternate',
                }}
              />
              <rect 
                x="45" y="80" width="110" height="15" 
                fill="#34d399" 
                rx="4" 
                style={{
                  animation: 'gentle-move-x 3s ease-in-out infinite alternate 0.2s',
                }}
              />
              <rect 
                x="45" y="105" width="90" height="15" 
                fill="#34d399" 
                rx="4" 
                style={{
                  animation: 'gentle-move-x 3s ease-in-out infinite alternate 0.4s',
                }}
              />
              <rect 
                x="45" y="130" width="70" height="15" 
                fill="#34d399" 
                rx="4" 
                style={{
                  animation: 'gentle-move-x 3s ease-in-out infinite alternate 0.6s',
                }}
              />
            </svg>
          </div>
          <style jsx>{`
            @keyframes gentle-float {
              from { transform: translateY(0); }
              to { transform: translateY(-10px); }
            }

            @keyframes gentle-scale {
              from { transform: scale(1); }
              to { transform: scale(1.02); }
            }

            @keyframes gentle-move-x {
              from { transform: translateX(0); }
              to { transform: translateX(5px); }
            }
          `}</style>
        </div>
      </section>
    );
  }

  const FeaturesSection = () => {
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

  const FeatureCard = ({ icon, title, description }) => {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-6 text-center transition-transform hover:scale-105">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
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

  // const ContactSection = () => {
  //   const [formData, setFormData] = useState({
  //     name: '',
  //     email: '',
  //     message: ''
  //   });
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  //   const [submitStatus, setSubmitStatus] = useState(null);

  //   const contactMethods = [
  //     {
  //       icon: <Mail className="h-6 w-6 text-emerald-500" />,
  //       title: "Email",
  //       value: "hello@snapnote.ai",
  //       link: "mailto:hello@snapnote.ai"
  //     },
  //     {
  //       icon: <Twitter className="h-6 w-6 text-emerald-500" />,
  //       title: "Twitter",
  //       value: "@snapnote",
  //       link: "https://twitter.com/snapnote"
  //     },
  //     {
  //       icon: <Linkedin className="h-6 w-6 text-emerald-500" />,
  //       title: "LinkedIn",
  //       value: "SnapNote",
  //       link: "https://linkedin.com/company/snapnote"
  //     }
  //   ];

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);
  //     setSubmitStatus(null);

  //     try {
  //       // Simulate form submission
  //       await new Promise(resolve => setTimeout(resolve, 1500));
        
  //       // Reset form
  //       setFormData({
  //         name: '',
  //         email: '',
  //         message: ''
  //       });
        
  //       setSubmitStatus({
  //         type: 'success',
  //         message: 'Message sent successfully! We\'ll get back to you soon.'
  //       });
  //     } catch (error) {
  //       setSubmitStatus({
  //         type: 'error',
  //         message: 'Failed to send message. Please try again.'
  //       });
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  //   return (
  //     <section 
  //       id="contact" 
  //       className="relative py-24 overflow-hidden"
  //     >
  //       <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 opacity-50 -z-10"></div>
        
  //       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
  //         <div className="text-center mb-12">
  //           <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
  //             Get in Touch
  //           </h2>
  //           <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
  //             Have questions or want to learn more? We'd love to hear from you!
  //           </p>
  //         </div>

  //         <div className="grid md:grid-cols-2 gap-12">
  //           {/* Contact Form */}
  //           <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
  //             <form onSubmit={handleSubmit} className="space-y-6">
  //               <div>
  //                 <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
  //                   Name
  //                 </label>
  //                 <input
  //                   type="text"
  //                   id="name"
  //                   name="name"
  //                   value={formData.name}
  //                   onChange={handleChange}
  //                   required
  //                   className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
  //                   placeholder="Your Name"
  //                 />
  //               </div>

  //               <div>
  //                 <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
  //                   Email
  //                 </label>
  //                 <input
  //                   type="email"
  //                   id="email"
  //                   name="email"
  //                   value={formData.email}
  //                   onChange={handleChange}
  //                   required
  //                   className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
  //                   placeholder="you@company.com"
  //                 />
  //               </div>

  //               <div>
  //                 <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
  //                   Message
  //                 </label>
  //                 <textarea
  //                   id="message"
  //                   name="message"
  //                   value={formData.message}
  //                   onChange={handleChange}
  //                   required
  //                   rows={4}
  //                   className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
  //                   placeholder="How can we help you?"
  //                 />
  //               </div>

  //               <button 
  //                 type="submit"
  //                 disabled={isSubmitting}
  //                 className="w-full flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition duration-300 group"
  //               >
  //                 {isSubmitting ? (
  //                   <Loader2 className="mr-2 h-5 w-5 animate-spin" />
  //                 ) : (
  //                   <>
  //                     Send Message
  //                     <Send className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
  //                   </>
  //                 )}
  //               </button>

  //               {submitStatus && (
  //                 <div className={`mt-4 text-center ${
  //                   submitStatus.type === 'success' 
  //                     ? 'text-emerald-600' 
  //                     : 'text-red-500'
  //                 }`}>
  //                   {submitStatus.message}
  //                 </div>
  //               )}
  //             </form>
  //           </div>

  //           {/* Contact Methods */}
  //           <div className="space-y-8">
  //             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
  //               <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
  //                 Alternative Contact Methods
  //               </h3>
  //               <div className="space-y-4">
  //                 {contactMethods.map((method, index) => (
  //                   <Link 
  //                     key={index} 
  //                     href={method.link}
  //                     target="_blank"
  //                     className="flex items-center group hover:bg-emerald-50 dark:hover:bg-slate-700 p-4 rounded-xl transition-all duration-300"
  //                   >
  //                     <div className="mr-4 p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
  //                       {method.icon}
  //                     </div>
  //                     <div>
  //                       <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
  //                         {method.title}
  //                       </h4>
  //                       <p className="text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">
  //                         {method.value}
  //                       </p>
  //                     </div>
  //                     <ArrowUpRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
  //                   </Link>
  //                 ))}
  //               </div>
  //             </div>

  //             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center">
  //               <div className="mb-4 flex justify-center">
  //                 <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-4">
  //                   <Clock className="h-8 w-8 text-emerald-600" />
  //                 </div>
  //               </div>
  //               <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
  //                 Response Time
  //               </h3>
  //               <p className="text-slate-600 dark:text-slate-300">
  //                 We typically respond within 24 hours during business days.
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"} transition-colors duration-300`}
    >
      <Header navlink={getNavlinks()} mobileNavlink={getMobileNavlinks()} setDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HeroSection />
        <ProblemSection />
        <KeyFeaturesSection />
        {/* <FeaturesSection /> */}
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
