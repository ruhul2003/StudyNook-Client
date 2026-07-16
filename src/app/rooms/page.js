'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import MainLayout from '../../components/MainLayout';
import RoomCard from '../../components/RoomCard';
import Spinner from '../../components/Spinner';
import { Search, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

const FLOOR_OPTIONS = [
  { label: 'All Floors', value: '' },
  { label: '1st Floor', value: '1st Floor' },
  { label: '2nd Floor', value: '2nd Floor' },
  { label: '3rd Floor', value: '3rd Floor' },
  { label: 'Floor 1', value: 'Floor 1' },
  { label: 'Floor 2', value: 'Floor 2' },
  { label: 'Floor 3', value: 'Floor 3' },
  { label: 'Floor 4', value: 'Floor 4' },
];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [floor, setFloor] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [budgetPreset, setBudgetPreset] = useState(''); // '', 'under-10', '10-20', '20-plus'

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (minRate) params.minRate = minRate;
      if (maxRate) params.maxRate = maxRate;
      if (floor) params.floor = floor;
      if (selectedAmenities.length > 0) {
        params.amenities = selectedAmenities.join(',');
      }

      const res = await api.get('/api/rooms', { params });
      setRooms(res.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRooms();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, floor, minRate, maxRate, selectedAmenities]);

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleBudgetPreset = (preset) => {
    setBudgetPreset(preset);
    if (preset === 'under-10') {
      setMinRate('');
      setMaxRate('10');
    } else if (preset === '10-20') {
      setMinRate('10');
      setMaxRate('20');
    } else if (preset === '20-plus') {
      setMinRate('20');
      setMaxRate('');
    } else {
      setMinRate('');
      setMaxRate('');
    }
  };

  const handleMinRateChange = (val) => {
    setMinRate(val);
    setBudgetPreset('');
  };

  const handleMaxRateChange = (val) => {
    setMaxRate(val);
    setBudgetPreset('');
  };

  const handleResetFilters = () => {
    setSearch('');
    setMinRate('');
    setMaxRate('');
    setFloor('');
    setSelectedAmenities([]);
    setBudgetPreset('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
    <MainLayout title="Available Rooms">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Premium Filtering Dashboard */}
        <motion.div 
          className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl backdrop-blur-md"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Line: Search & Quick Reset */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-5 border-b border-zinc-800/60">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-550">
                <Search className="w-4 h-4 stroke-1" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 block w-full bg-zinc-950 border border-zinc-800/85 hover:border-zinc-700/80 focus:border-indigo-500 rounded-xl py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm transition-all focus:ring-1 focus:ring-indigo-500"
                placeholder="Search resources by workspace title..."
              />
            </div>

            <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto">
              <span className="text-xs font-semibold text-zinc-450 tracking-wider">
                {rooms.length} {rooms.length === 1 ? 'workspace' : 'workspaces'} matching
              </span>
              {(search || floor || minRate || maxRate || selectedAmenities.length > 0) && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleResetFilters}
                  className="text-xs text-rose-450 hover:text-rose-400 flex items-center gap-1 font-semibold transition-colors px-3 py-2 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
                </motion.button>
              )}
            </div>
          </div>

          {/* Filtering Categories Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">

            {/* 1. Floor Level Selector (Pill Badges) */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Floor Plan</span>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
                {FLOOR_OPTIONS.map((opt) => {
                  const isActive = floor === opt.value;
                  return (
                    <motion.button
                      key={opt.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFloor(opt.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${isActive
                          ? 'bg-indigo-600 border-indigo-550 text-white shadow-md shadow-indigo-500/15'
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-405 hover:border-zinc-700/80 hover:text-zinc-200'
                        }`}
                    >
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Budget Controls */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Hourly Budget</span>
              <div className="space-y-3">
                {/* Presets */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBudgetPreset('')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${budgetPreset === '' && !minRate && !maxRate
                        ? 'bg-indigo-600 border-indigo-550 text-white'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-405 hover:border-zinc-700'
                      }`}
                  >
                    Any
                  </button>
                  <button
                    onClick={() => handleBudgetPreset('under-10')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${budgetPreset === 'under-10'
                        ? 'bg-indigo-600 border-indigo-550 text-white'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-405 hover:border-zinc-700'
                      }`}
                  >
                    Under $10
                  </button>
                  <button
                    onClick={() => handleBudgetPreset('10-20')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${budgetPreset === '10-20'
                        ? 'bg-indigo-600 border-indigo-550 text-white'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-405 hover:border-zinc-700'
                      }`}
                  >
                    $10 - $20
                  </button>
                  <button
                    onClick={() => handleBudgetPreset('20-plus')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${budgetPreset === '20-plus'
                        ? 'bg-indigo-600 border-indigo-550 text-white'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-405 hover:border-zinc-700'
                      }`}
                  >
                    $20+
                  </button>
                </div>

                {/* Range inputs */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-550">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minRate}
                      onChange={(e) => handleMinRateChange(e.target.value)}
                      className="pl-6 pr-2 py-1.5 block w-full bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-indigo-550"
                    />
                  </div>
                  <span className="text-zinc-650 text-xs font-bold px-0.5">to</span>
                  <div className="relative flex-grow">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-550">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxRate}
                      onChange={(e) => handleMaxRateChange(e.target.value)}
                      className="pl-6 pr-2 py-1.5 block w-full bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-indigo-550"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Amenities Multi-selection (Pill Buttons) */}
            <div className="space-y-3.5 md:col-span-2 lg:col-span-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Amenities</span>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((option) => {
                  const isSelected = selectedAmenities.includes(option);
                  return (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAmenityChange(option)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${isSelected
                          ? 'bg-indigo-600 border-indigo-555 text-white shadow-md shadow-indigo-500/15'
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-405 hover:border-zinc-700/80'
                        }`}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner />
            </div>
          ) : rooms.length === 0 ? (
            <motion.div 
              className="text-center py-20 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl max-w-2xl mx-auto shadow-md"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm font-semibold text-zinc-350">No workspaces match your parameters</p>
              <p className="text-zinc-500 text-xs mt-1.5 px-6 max-w-md mx-auto leading-relaxed">
                Try expanding your hourly budget scope, selecting different floor layers, or resetting active amenities to view available library rooms.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-4.5 py-2.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 text-zinc-350 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Clear Selected Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {rooms.map((room) => (
                <motion.div key={room._id} variants={itemVariants}>
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}