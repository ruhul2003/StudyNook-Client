'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import MainLayout from '../../components/MainLayout';
import RoomCard from '../../components/RoomCard';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { Plus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyListings() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Private route check
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view your room listings.');
      router.push('/login?redirect=/my-listings');
    }
  }, [user, authLoading, router]);

  const fetchMyRooms = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/api/rooms');
      const myRooms = res.data.filter((room) => room.ownerId === user._id);
      setRooms(myRooms);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, [user, authLoading]);

  if (authLoading || !user) {
    return (
      <MainLayout title="Authenticating...">
        <Spinner />
      </MainLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <MainLayout title="My Listings">
      <motion.div 
        className="space-y-6 py-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        {/* Header section */}
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-900"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              My Study Rooms
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage the study room listings you own and control.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/add-room"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Room
            </Link>
          </motion.div>
        </motion.div>

        {/* Listings content */}
        {loading ? (
          <Spinner />
        ) : rooms.length === 0 ? (
          <motion.div 
            className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-850/80"
            variants={itemVariants}
          >
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-300">No rooms listed yet</h2>
            <p className="text-slate-450 text-sm mt-1 mb-6">
              You haven't listed any private study rooms for bookings yet.
            </p>
            <Link
              href="/add-room"
              className="px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-550/20 hover:border-transparent text-sm font-semibold rounded-xl transition-all cursor-pointer inline-block"
            >
              List Your First Room
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={itemVariants}
          >
            {rooms.map((room) => (
              <motion.div 
                key={room._id} 
                className="relative"
                variants={itemVariants}
              >
                <RoomCard room={room} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </motion.div>
    </MainLayout>
  );
}
