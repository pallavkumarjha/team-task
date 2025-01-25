import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Check, Linkedin, Loader2, Mail, X } from "lucide-react";
import Link from "next/link";
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function JoinTheWaitlistSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if email already exists in waitlist
      const waitlistRef = collection(db, 'waitlist');
      const emailQuery = query(waitlistRef, where('email', '==', email));
      const existingEmails = await getDocs(emailQuery);

      if (!existingEmails.empty) {
        toast.error('This email is already on the waitlist');
        setIsSubmitting(false);
        return;
      }

      // Add email to waitlist
      await addDoc(waitlistRef, {
        email,
        timestamp: serverTimestamp(),
        status: 'pending'
      });

      toast.success('Successfully joined the waitlist!');
      setEmail('');
      setSubmitStatus('Successfully joined the waitlist!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast.error('An error occurred. Please try again.');
      setSubmitStatus('An error occurred. Please try again.');
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="waitlist" 
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 opacity-50 -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
            Join the Future of Team Collaboration
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Be the first to transform how your team communicates. Limited early access spots available!
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 max-w-xl mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your work email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Mail className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full hover:bg-emerald-600 transition duration-300 group"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-4">
                  <Check className="h-12 w-12 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                You're on the List!
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We'll send you an exclusive invite as soon as we launch. Stay tuned!
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <Link
                  href="https://twitter.com/snapnote" 
                  target="_blank"
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </Link>
                <Link 
                  href="https://linkedin.com/company/snapnote" 
                  target="_blank"
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <Linkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
            No spam, promise.
          </p>
        </div>
      </div>
    </section>
  );

}