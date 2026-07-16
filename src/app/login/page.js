'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../components/MainLayout';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { user, login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Get redirect path
  const redirect = searchParams.get('redirect') || '/';

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, redirect, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast.success('Logged in successfully!');
      router.push(redirect);
    } else {
      setErrorMsg(res.message);
      toast.error(res.message);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    const res = await loginWithGoogle(response.credential);
    setLoading(false);

    if (res.success) {
      toast.success('Logged in successfully!');
      router.push(redirect);
    } else {
      toast.error(res.message || 'Google sign in failed');
    }
  };

  const initializeGoogleSignIn = () => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'filled_black', size: 'large', type: 'standard', shape: 'pill', text: 'continue_with', width: '382' }
      );
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      initializeGoogleSignIn();
    }
  }, []);

  return (
    <MainLayout title="Login">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800/80 p-8 rounded-2xl shadow-xl relative"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to book rooms and manage your listings
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errorMsg && (
              <motion.div 
                className="p-3.5 text-sm bg-rose-950/30 border border-rose-800/30 text-rose-450 rounded-xl"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errorMsg}
              </motion.div>
            )}

            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-indigo-550 focus:ring-1 focus:ring-indigo-550 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-indigo-550 focus:ring-1 focus:ring-indigo-550 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
                </span>
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center w-full">
            <div id="google-signin-btn" className="w-full flex justify-center" />
          </div>
          <Script
            src="https://accounts.google.com/gsi/client"
            onLoad={initializeGoogleSignIn}
            strategy="afterInteractive"
          />

          <div className="text-center pt-4 border-t border-slate-800/40">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-indigo-400 hover:text-indigo-350 transition-colors inline-flex items-center gap-1"
              >
                Register <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
