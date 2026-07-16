'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api-client';
import MainLayout from '../../components/MainLayout';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { PlusCircle, Layers, Users, DollarSign, Image, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

export default function AddRoom() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [floor, setFloor] = useState('1st Floor');
  const [capacity, setCapacity] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Private Route Check
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to list a study room.');
      router.push('/login?redirect=/add-room');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <MainLayout title="Authenticating...">
        <Spinner />
      </MainLayout>
    );
  }

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !imageUrl || !floor || !capacity || !hourlyRate) {
      toast.error('Please enter all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/api/rooms', {
        name,
        description,
        image: imageUrl,
        floor,
        capacity: Number(capacity),
        hourlyRate: Number(hourlyRate),
        amenities: selectedAmenities,
      });

      toast.success(res.data.message || 'Room added successfully!');
      router.push('/my-listings');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to list room.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15,
        staggerChildren: 0.08,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <MainLayout title="Add Room">
      <div className="max-w-3xl mx-auto py-4">
        <motion.div 
          className="bg-slate-900 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl relative"
          initial="hidden"
          animate="visible"
          variants={formContainerVariants}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <motion.div className="pb-4 border-b border-slate-800/50" variants={inputVariants}>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <PlusCircle className="text-indigo-400 w-7 h-7" /> List a Study Room
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Add details about the room you control for users to browse and book.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Name and Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={inputVariants}>
                <label className="text-sm font-semibold text-slate-300 block mb-1.5">
                  Room Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 block w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="e.g. Quiet Area Group Room 3B"
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants}>
                <label className="text-sm font-semibold text-slate-300 block mb-1.5">
                  Image URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Image className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="pl-11 block w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <motion.div variants={inputVariants}>
              <label className="text-sm font-semibold text-slate-300 block mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 text-slate-500">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-11 block w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all min-h-[120px]"
                  placeholder="Describe the room, visual guides, keys, whiteboard details..."
                />
              </div>
            </motion.div>

            {/* Row 2: Floor, Capacity, Hourly Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div variants={inputVariants}>
                <label className="text-sm font-semibold text-slate-300 block mb-1.5">
                  Floor <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Layers className="w-5 h-5" />
                  </div>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="pl-11 block w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-205 focus:outline-none text-sm transition-all"
                  >
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                  </select>
                </div>
              </motion.div>

              <motion.div variants={inputVariants}>
                <label className="text-sm font-semibold text-slate-300 block mb-1.5">
                  Seat Capacity <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="pl-11 block w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="e.g. 4"
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants}>
                <label className="text-sm font-semibold text-slate-300 block mb-1.5">
                  Hourly Rate ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="pl-11 block w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                    placeholder="e.g. 5"
                  />
                </div>
              </motion.div>
            </div>

            {/* Amenities Checklist */}
            <motion.div className="space-y-3" variants={inputVariants}>
              <label className="text-sm font-semibold text-slate-300 block">
                Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-850">
                {AMENITY_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm text-slate-300 hover:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(option)}
                      onChange={() => handleAmenityChange(option)}
                      className="rounded border-slate-850 text-indigo-600 bg-slate-900 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Form Actions */}
            <motion.div className="flex gap-4 pt-4 border-t border-slate-800/40" variants={inputVariants}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.back()}
                className="w-1/2 py-3 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 font-semibold rounded-xl text-center border border-slate-850 transition-colors cursor-pointer"
              >
                Back
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="w-1/2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white font-bold rounded-xl text-center transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Creating listing...' : 'Create Room Listing'}
              </motion.button>
            </motion.div>

          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
}
