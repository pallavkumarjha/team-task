"use client";

import { useState } from 'react';
import Link from "next/link"
import { Mail, Twitter, Linkedin, Loader2, Send, ArrowUpRight, Clock, X } from "lucide-react"
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-emerald-500" />,
      title: "Email",
      value: "hello@snapnote.ai",
      link: "mailto:hello@snapnote.ai"
    },
    {
      icon: <X className="h-6 w-6 text-emerald-500" />,
      title: "X",
      value: "@snapnote",
      link: "https://x.com/snapnote"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const contactSubmissionsRef = collection(db, 'contact_submissions');
      await addDoc(contactSubmissionsRef, {
        ...formData,
        timestamp: serverTimestamp(),
        status: 'new'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      toast.success('Message sent successfully! We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 opacity-50 -z-10"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
            Get in Touch
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Have questions or want to learn more? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  placeholder="How can we help you?"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition duration-300 group"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {submitStatus && (
                <div className={`mt-4 text-center ${
                  submitStatus.type === 'success' 
                    ? 'text-emerald-600' 
                    : 'text-red-500'
                }`}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Contact Methods */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                Alternative Contact Methods
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Link 
                    key={index} 
                    href={method.link}
                    target="_blank"
                    className="flex items-center group hover:bg-emerald-50 dark:hover:bg-slate-700 p-4 rounded-xl transition-all duration-300"
                  >
                    <div className="mr-4 p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {method.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">
                        {method.value}
                      </p>
                    </div>
                    <ArrowUpRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-4">
                  <Clock className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                Response Time
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;