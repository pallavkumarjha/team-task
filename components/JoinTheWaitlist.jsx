import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function JoinTheWaitlistSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast.error('An error occurred. Please try again.');
      setSubmitStatus('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join-the-waitlist" className="mb-24 container mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">Join the Waitlist</h2>
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-full shadow-neomorphic-light dark:shadow-neomorphic-dark p-2">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-grow">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email to join the waitlist"
              className="w-full px-4 py-2 bg-transparent focus:outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="rounded-full px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white flex items-center"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Join Waitlist'
            )}
          </Button>
        </form>
        {/* {submitStatus && (
          <p className={`text-center mt-2 text-sm ${submitStatus.includes('Successfully') ? 'text-emerald-600' : 'text-red-500'}`}>
            {submitStatus}
          </p>
        )} */}
      </div>
    </section>
  );
}