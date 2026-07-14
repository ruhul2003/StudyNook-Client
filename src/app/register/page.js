'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../components/MainLayout';
import toast from 'react-hot-toast';
import { User, Mail, Image, Lock, UserPlus, ArrowRight } from 'lucide-react';

export default function Register() {
  const { user, register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password rules helper
  const [passLength, setPassLength] = useState(false);
  const [passUpper, setPassUpper] = useState(false);
  const [passLower, setPassLower] = useState(false);

  useEffect(() => {
    setPassLength(password.length >= 6);
    setPassUpper(/[A-Z]/.test(password));
    setPassLower(/[a-z]/.test(password));
  }, [password]);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !photoUrl || !password) {
      setErrorMsg('All fields are required.');
      return;
    }

    // Validate password constraints
    if (!passLength || !passUpper || !passLower) {
      setErrorMsg('Please satisfy all password complexity rules.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    const res = await register(name, email, photoUrl, password);
    setLoading(false);

    if (res.success) {
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } else {
      setErrorMsg(res.message);
      toast.error(res.message);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const mockNames = ['Emily Johnson', 'David Miller', 'Sophia Brown', 'James Davis'];
    const mockPhotos = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    ];
    const randomIndex = Math.floor(Math.random() * mockNames.length);
    const mockName = mockNames[randomIndex];
    const mockEmail = `${mockName.toLowerCase().replace(' ', '')}@gmail.com`;
    const mockPhoto = mockPhotos[randomIndex % mockPhotos.length];

    const res = await loginWithGoogle(mockName, mockEmail, mockPhoto);
    setLoading(false);

    if (res.success) {
      toast.success(`Registered with Google! Welcome, ${mockName}!`);
      router.push('/');
    } else {
      toast.error('Google register failed');
    }
  };

  return (
    <MainLayout title="Register">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800/80 p-8 rounded-2xl shadow-xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Join StudyNook to list and book study rooms
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3.5 text-sm bg-rose-950/30 border border-rose-800/30 text-rose-400 rounded-xl animate-shake">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="text-sm font-medium text-slate-350 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-indigo-550 focus:ring-1 focus:ring-indigo-550 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-355 block mb-1.5">
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
                    className="pl-10 block w-full bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-indigo-550 focus:ring-1 focus:ring-indigo-550 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-355 block mb-1.5">
                  Photo URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Image className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    required
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="pl-10 block w-full bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-indigo-550 focus:ring-1 focus:ring-indigo-550 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-355 block mb-1.5">
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
                    className="pl-10 block w-full bg-slate-950 border border-slate-850 hover:border-slate-750 focus:border-indigo-550 focus:ring-1 focus:ring-indigo-550 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-550 focus:outline-none text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {/* Password Checklist */}
                <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs">
                  <span className={`flex items-center gap-1 font-medium transition-colors ${passLength ? 'text-emerald-450' : 'text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${passLength ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                    6+ characters
                  </span>
                  <span className={`flex items-center gap-1 font-medium transition-colors ${passUpper ? 'text-emerald-450' : 'text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${passUpper ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                    1 uppercase
                  </span>
                  <span className={`flex items-center gap-1 font-medium transition-colors ${passLower ? 'text-emerald-450' : 'text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${passLower ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                    1 lowercase
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-650 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
                </span>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in */}
          <div>
            <button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-sm font-semibold rounded-xl text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.98 1 12 1 7.28 1 3.24 3.72 1.25 7.7l3.77 2.92C5.9 7.42 8.72 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.45 12.27c0-.82-.07-1.6-.2-2.38H12v4.51h6.43c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.98 3.37-4.89 3.37-8.52z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.02 10.62a7.1 7.1 0 0 1 0-4.44l-3.77-2.92A11.96 11.96 0 0 0 0 12c0 2.45.74 4.73 2.01 6.64l3.77-2.92a7.07 7.07 0 0 1-.76-5.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.9 1.09-3.28 0-6.1-2.38-7.09-5.58l-3.77 2.92C3.24 20.28 7.28 23 12 23z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          <div className="text-center pt-4 border-t border-slate-800/40">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-350 transition-colors inline-flex items-center gap-1"
              >
                Login <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
