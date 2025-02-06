"use client"
import { MessageSquare, Users, Zap } from "lucide-react"

export default function ProblemSection() {
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