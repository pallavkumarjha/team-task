export default function PricingCard({
    title,
    price,
    features,
    highlighted = false,
  }) {
    return (
      <div
        className={`bg-white dark:bg-slate-800 rounded-3xl shadow-neomorphic-light dark:shadow-neomorphic-dark p-6 text-center ${highlighted ? "ring-2 ring-emerald-500 dark:ring-emerald-400" : ""}`}
      >
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <div className="text-4xl font-bold mb-4">
          {price}
          <span className="text-sm font-normal">/month</span>
        </div>
        <ul className="text-left mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center mb-2">
              <svg
                className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-2 px-4 rounded-full font-semibold ${highlighted ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"} shadow-neomorphic-light dark:shadow-neomorphic-dark hover:opacity-90 transition-opacity`}
        >
          Choose Plan
        </button>
      </div>
    )
  }