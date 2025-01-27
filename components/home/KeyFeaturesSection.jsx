"use client"
import { NotebookIcon, PenIcon, Users, TicketCheck, Zap } from "lucide-react"

export default function KeyFeaturesSection() {
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