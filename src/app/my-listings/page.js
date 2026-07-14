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
import { FolderList, Plus, AlertCircle } from 'lucide-react';

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
      // Filter rooms where ownerId matches current user's ID
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

  return (
    <MainLayout title="My Listings">
      <div className="space-y-6 py-4">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              My Study Rooms
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage the study room listings you own and control.
            </p>
          </div>
          <Link
            href="/add-room"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Add Room
          </Link>
        </div>

        {/* Listings content */}
        {loading ? (
          <Spinner />
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-850/80">
            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-300">No rooms listed yet</h2>
            <p className="text-slate-450 text-sm mt-1 mb-6">
              You haven't listed any private study rooms for bookings yet.
            </p>
            <Link
              href="/add-room"
              className="px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-550/20 hover:border-transparent text-sm font-semibold rounded-xl transition-all"
            >
              List Your First Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rooms.map((room) => (
              <div key={room._id} className="relative">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
}
