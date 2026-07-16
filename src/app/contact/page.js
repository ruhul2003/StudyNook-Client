'use client';

import React, { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <MainLayout title="Contact Us">
      <div className="relative overflow-hidden py-12">
        {/* Background decorative gradient blurs */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-550/20">
              <MessageSquare className="w-3.5 h-3.5" /> Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              We'd Love to{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>
            <p className="text-lg text-slate-350 max-w-2xl mx-auto">
              Have questions, feedback, or need help with a room listing? Drop us a message and our team will get back to you shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            
            {/* Contact details card (Left Column) */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 space-y-8 backdrop-blur-sm">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Contact Information</h3>
                <p className="text-sm text-slate-400">Reach out to us directly through any of these channels.</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Email Us</p>
                    <p className="text-sm font-medium text-slate-200 mt-1">support@studynook.com</p>
                    <p className="text-xs text-slate-500 mt-0.5">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Call Us</p>
                    <p className="text-sm font-medium text-slate-200 mt-1">+1 (555) 019-2834</p>
                    <p className="text-xs text-slate-500 mt-0.5">Mon - Fri, 9am - 5pm EST</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Office Location</p>
                    <p className="text-sm font-medium text-slate-200 mt-1">100 University Ave, Suite 300</p>
                    <p className="text-xs text-slate-500 mt-0.5">Boston, MA 02116</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form (Right Column) */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-sm">
              {submitted ? (
                <div className="text-center py-16 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Thank you for reaching out. We have received your query and will contact you via email as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-sm transition-colors border border-slate-700/60"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold text-slate-350 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 transition-all duration-200 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-semibold text-slate-350 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-semibold text-slate-350 uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 transition-all duration-200 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold text-slate-350 uppercase tracking-wider">Message</label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 transition-all duration-200 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}
