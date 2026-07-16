'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api-client';
import MainLayout from '../../components/MainLayout';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { CalendarRange, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  // Private Route Check
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view your room bookings.');
      router.push('/login?redirect=/my-bookings');
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/api/bookings/my');
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, authLoading]);

  if (authLoading || !user) {
    return (
      <MainLayout title="Authenticating...">
        <Spinner />
      </MainLayout>
    );
  }

  // Check if booking is in the future (today or later)
  const isEligibleForCancel = (booking) => {
    if (booking.status !== 'confirmed') return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return booking.date >= todayStr;
  };

  const handleCancelClick = (id) => {
    setCancellingId(id);
    setCancelConfirmOpen(true);
  };

  const confirmCancelBooking = async () => {
    try {
      const res = await api.patch(`/api/bookings/${cancellingId}/cancel`);
      toast.success(res.data.message || 'Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelConfirmOpen(false);
      setCancellingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <MainLayout title="My Bookings">
      <motion.div 
        className="space-y-6 py-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        {/* Header */}
        <motion.div className="pb-5 border-b border-slate-900" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <CalendarRange className="text-indigo-400 w-7 h-7" /> My Bookings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your study room reservation schedule.
          </p>
        </motion.div>

        {/* Bookings Content */}
        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <motion.div 
            className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-850/80"
            variants={itemVariants}
          >
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-300">You have no bookings yet</h2>
            <p className="text-slate-450 text-sm mt-1 mb-6">
              Browse the catalog to reserve a room for your study slots.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/rooms')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Browse Rooms
            </motion.button>
          </motion.div>
        ) : (
          /* Bookings Table / Cards */
          <motion.div 
            className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
            variants={itemVariants}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Room</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Time Slot</th>
                    <th className="py-4 px-6">Cost</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-350">
                  {bookings.map((booking) => {
                    const room = booking.roomId;
                    return (
                      <tr key={booking._id} className="hover:bg-slate-850/20 transition-colors">
                        
                        {/* Room Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150'}
                              alt={room?.name || 'Study Room'}
                              className="w-12 h-10 object-cover rounded-lg border border-slate-805"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150';
                              }}
                            />
                            <div>
                              <span className="font-semibold text-slate-200 block max-w-[200px] truncate">
                                {room?.name || 'Deleted Room'}
                              </span>
                              <span className="text-2xs text-slate-450 block">{room?.floor || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Date Column */}
                        <td className="py-4 px-6 font-medium whitespace-nowrap">
                          {booking.date}
                        </td>

                        {/* Time Slot Column */}
                        <td className="py-4 px-6 font-medium text-slate-250 whitespace-nowrap">
                          {booking.startTime} - {booking.endTime}
                        </td>

                        {/* Cost Column */}
                        <td className="py-4 px-6 font-extrabold text-slate-100 whitespace-nowrap">
                          ${booking.totalCost}
                        </td>

                        {/* Status badge Column */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          {booking.status === 'confirmed' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Cancelled
                            </span>
                          )}
                        </td>

                        {/* Cancel button Column */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {isEligibleForCancel(booking) ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelClick(booking._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-transparent text-rose-400 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </motion.button>
                          ) : (
                            <span className="text-xs text-slate-500 italic">None</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </motion.div>

      {/* CONFIRM CANCELLATION DIALOG */}
      <AnimatePresence>
        {cancelConfirmOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl"
            >
              <HelpCircle className="w-16 h-16 text-indigo-400 mx-auto" />
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">Cancel Reservation?</h2>
                <p className="text-sm text-slate-400">
                  Are you sure you want to cancel this booking? This will free up the time slot for other students.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCancelConfirmOpen(false)}
                  className="w-1/2 py-2.5 px-4 bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold rounded-xl border border-slate-800 transition-colors cursor-pointer"
                >
                  No, Keep it
                </button>
                <button
                  onClick={confirmCancelBooking}
                  className="w-1/2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-900/20 cursor-pointer"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </MainLayout>
  );
}
