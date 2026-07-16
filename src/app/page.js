'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../lib/axios';
import MainLayout from '../components/MainLayout';
import RoomCard from '../components/RoomCard';
import Spinner from '../components/Spinner';
import { Calendar, Shield, Zap, BookOpen, Clock, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestRooms = async () => {
      try {
        const res = await api.get('/api/rooms?limit=6');
        setRooms(res.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestRooms();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <MainLayout title="Home">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 flex flex-col items-center text-center">
        {/* Background gradient blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          className="relative max-w-4xl mx-auto space-y-6 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-550/20">
            <Zap className="w-3.5 h-3.5" /> Book Instantly, Focus Better
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Study Room
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse and book quiet, private study rooms in your library. List your own room and earn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/rooms"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all duration-200 block text-center"
              >
                Explore Rooms
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/add-room"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 transition-colors block text-center"
              >
                List a Room
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. Latest Study Rooms Section */}
      <section className="py-12 border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Available Study Rooms
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Handpicked study spaces with top amenities to accelerate your learning.
            </p>
          </div>
          <Link
            href="/rooms"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All Rooms &rarr;
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-850">
            <p className="text-slate-450">No study rooms available at the moment. Try listing one!</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            {rooms.map((room) => (
              <motion.div key={room._id} variants={itemVariants}>
                <RoomCard room={room} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 3. Extra Section 1: How It Works */}
      <section className="py-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            How StudyNook Works
          </h2>
          <p className="text-slate-400 text-sm">
            Simple 3-step process to secure your productivity hub.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div 
            className="flex flex-col items-center text-center p-6 bg-slate-900/40 rounded-2xl border border-slate-900"
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.3)' }}
          >
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">1. Explore Spaces</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Filter through unique private library rooms based on capacity, floor, or amenities like whiteboards.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center text-center p-6 bg-slate-900/40 rounded-2xl border border-slate-900"
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.3)' }}
          >
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">2. Reserve Slot</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Select your date and time slot. Our double-booking protection locks other bookings instantly.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center text-center p-6 bg-slate-900/40 rounded-2xl border border-slate-900"
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.3)' }}
          >
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">3. Focus and Learn</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Check in with complete security. Cancel easily anytime if your schedule changes.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Extra Section 2: Platform Stats */}
      <section className="py-16 border-t border-slate-900 mb-8">
        <motion.div 
          className="bg-gradient-to-r from-indigo-950/20 to-slate-900/40 rounded-3xl border border-indigo-500/10 p-8 sm:p-12"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
                Loved by Students Globally
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                We empower students to collaborate and focus. Join a growing ecosystem of library users.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-300">24/7 dedicated support</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <motion.div whileHover={{ y: -3 }} className="p-6 bg-slate-950/80 rounded-2xl border border-slate-900 text-center">
                <span className="block text-3xl font-extrabold text-indigo-400">99.8%</span>
                <span className="text-xs text-slate-450 mt-1 block">Booking Success</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="p-6 bg-slate-950/80 rounded-2xl border border-slate-900 text-center">
                <span className="block text-3xl font-extrabold text-indigo-400">12k+</span>
                <span className="text-xs text-slate-450 mt-1 block">Hours Reserved</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="p-6 bg-slate-950/80 rounded-2xl border border-slate-900 text-center">
                <span className="block text-3xl font-extrabold text-indigo-400">1.5h</span>
                <span className="text-xs text-slate-450 mt-1 block">Avg. Session Time</span>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="p-6 bg-slate-950/80 rounded-2xl border border-slate-900 text-center">
                <span className="block text-3xl font-extrabold text-indigo-400">5.0★</span>
                <span className="text-xs text-slate-450 mt-1 block">User Rating</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
