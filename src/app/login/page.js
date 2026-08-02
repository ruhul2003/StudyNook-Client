'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../components/MainLayout';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginForm() {
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
                className="p-3.5 text-sm bg-rose-950/30 border border-rose-800/30 text-rose-455 rounded-xl"
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
                    className="pl-10 block w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
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
                    className="pl-10 block w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await loginWithGoogle();
                } catch (err) {
                  toast.error(err.message || 'Google sign in failed');
                  setLoading(false);
                }
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </motion.button>
          </div>

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

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading login...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
