'use client'
import { Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";

export default function Footer() {
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: '',
        message: ''
    });
    const [isSending, setIsSending] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const mailtoLink = `mailto:pallavkumarjha26@gmail.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
            window.open(mailtoLink, '_blank');
            setEmailData({ subject: '', message: '' });
            setIsEmailDialogOpen(false);
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setIsSending(false);
        }
    };
    
    return (
      <footer className="bg-slate-700 text-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold text-teal-300">Snap Note</span>
              <p className="mt-2 text-sm text-slate-300">
                Simplifying team communication and task management.
              </p>
              <svg className="w-20 h-20" viewBox="0 0 200 200">
                <rect x="45" y="45" width="110" height="25" fill="#34d399" rx="8" />
                <rect x="45" y="80" width="110" height="15" fill="#34d399" rx="4" />
                <rect x="45" y="105" width="90" height="15" fill="#34d399" rx="4" />
                <rect x="45" y="130" width="70" height="15" fill="#34d399" rx="4" />
              </svg>
            </div>
            <div className="col-span-1 md:col-span-1">
              <div>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a
                      href="/privacy"
                      className="text-base text-slate-300 hover:text-teal-300 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-600 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Button
                className="text-slate-400 hover:text-teal-300 transition-colors bg-transparent shadow-none"
                onClick={() => setIsEmailDialogOpen(true)}
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
            <p className="mt-8 text-base text-slate-400 md:mt-0 md:order-1">
              &copy; 2025 Snap Note. All rights reserved. <a href="/privacy" className="text-slate-400 hover:text-teal-300 transition-colors underline bold">Privacy Policy</a>
            </p>
          </div>
        </div>

        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send us an email</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full text-sm px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your message"
                  value={emailData.message}
                  onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Email'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </footer>
    )
  }
  