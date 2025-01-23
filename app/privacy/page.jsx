export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-slate-800 dark:text-slate-200">
          Privacy Policy
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
            1. Information We Collect
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            When you sign in with Slack, we collect the following information:
          </p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
            <li>Your email address</li>
            <li>Your name</li>
            <li>Profile picture</li>
            <li>Slack user ID</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
            2. How We Use Your Information
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            We use the collected information to:
          </p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
            <li>Authenticate and manage your account</li>
            <li>Personalize your experience</li>
            <li>Communicate with you about our service</li>
            <li>Improve our application and user experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
            3. Data Storage and Security
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            We store your data securely using Firebase Firestore with strict access controls. 
            Your personal information is encrypted and protected against unauthorized access.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
            4. Third-Party Access
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We do not sell or share your personal information with third parties 
            except as necessary to provide our service (e.g., authentication via Slack).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
            5. Your Rights
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
            <li>Access your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of non-essential communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
            6. Contact Us
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            If you have any questions about this Privacy Policy, 
            please contact us at: 
            <a 
              href="mailto:privacy@teamtask.com" 
              className="text-blue-600 hover:underline ml-2"
            >
              pallavkumarjha26@gmail.com
            </a>
          </p>
        </section>

        <div className="text-center mt-10 text-slate-500 dark:text-slate-600">
          <p>Last Updated: January 2025</p>
        </div>
      </div>
    </div>
  );
}