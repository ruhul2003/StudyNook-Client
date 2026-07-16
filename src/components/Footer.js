import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand/About */}
          <div className="space-y-4">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              StudyNook
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find and book quiet, private study rooms in libraries and university buildings. Create an environment for focus and productivity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@studynook.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>+1 (555) 019-2834</span>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Follow Us
            </h3>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* X Logo (New logo) SVG */}
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} StudyNook. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
