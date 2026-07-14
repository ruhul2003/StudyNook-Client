'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, LogOut, User, Folder, CalendarRange, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
  ];

  const privateLinks = [
    { name: 'Add Room', path: '/add-room', icon: PlusCircle },
    { name: 'My Listings', path: '/my-listings', icon: Folder },
    { name: 'My Bookings', path: '/my-bookings', icon: CalendarRange },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent tracking-wider">
                StudyNook
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-indigo-400 ${
                  isActive(link.path) ? 'text-indigo-400 font-semibold' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Private Navigation Links in main Nav (if logged in) */}
            {user && (
              <div className="flex items-center space-x-6 border-l border-slate-800 pl-6">
                {privateLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium transition-all duration-200 hover:text-indigo-400 ${
                      isActive(link.path) ? 'text-indigo-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User Section / Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800/50 border border-transparent hover:border-slate-800 transition-all duration-200"
                >
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-500/30"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
                    }}
                  />
                  <span className="text-sm font-medium text-slate-200">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-200 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg transition-colors"
                      >
                        <CalendarRange className="w-4 h-4 text-slate-400" />
                        My Bookings
                      </Link>
                      <Link
                        href="/my-listings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg transition-colors"
                      >
                        <Folder className="w-4 h-4 text-slate-400" />
                        My Listings
                      </Link>
                      <Link
                        href="/add-room"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-slate-400" />
                        Add Room
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors mt-1 border-t border-slate-850"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 py-3 px-4 space-y-2 animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-slate-800 text-indigo-400'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <>
              <div className="border-t border-slate-900 my-2 pt-2">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Private Dashboard
                </p>
              </div>
              {privateLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-slate-800 text-indigo-400'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-900 my-2 pt-2 flex items-center gap-3 px-3">
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-slate-200">{user.name}</h4>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-450 hover:bg-rose-950/20 rounded-lg text-base font-medium transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          )}

          {!user && (
            <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2 text-base font-medium text-slate-300 border border-slate-800 rounded-lg hover:bg-slate-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2 text-base font-medium bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg hover:opacity-90"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
