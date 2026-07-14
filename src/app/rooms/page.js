'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import MainLayout from '../../components/MainLayout';
import RoomCard from '../../components/RoomCard';
import Spinner from '../../components/Spinner';
import { Search, Filter, RefreshCw, SlidersHorizontal } from 'lucide-react';

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [floor, setFloor] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    // Debounced search / fetching
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

  const handleResetFilters = () => {
    setSearch('');
    setMinRate('');
    setMaxRate('');
    setFloor('');
    setSelectedAmenities([]);
  };

  return (
    <MainLayout title="Available Rooms">
      <div className="flex flex-col lg:flex-row gap-8 py-4">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-72 bg-slate-900 border border-slate-800/80 p-6 rounded-2xl h-fit space-y-6 shrink-0 relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="font-bold text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-400 hover:text-indigo-305 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Floor filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Floor
            </label>
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">All Floors</option>
              <option value="1st Floor">1st Floor</option>
              <option value="2nd Floor">2nd Floor</option>
              <option value="3rd Floor">3rd Floor</option>
              <option value="Floor 1">Floor 1</option>
              <option value="Floor 2">Floor 2</option>
              <option value="Floor 3">Floor 3</option>
              <option value="Floor 4">Floor 4</option>
            </select>
          </div>

          {/* Rate Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Hourly Rate ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-slate-500 text-xs">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Amenities
            </label>
            <div className="space-y-2">
              {AMENITY_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(option)}
                    onChange={() => handleAmenityChange(option)}
                    className="rounded border-slate-800 text-indigo-600 bg-slate-955 focus:ring-offset-slate-900 focus:ring-indigo-550 w-4 h-4 cursor-pointer"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow space-y-6">
          {/* Search Header Bar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800/80 p-4 rounded-2xl">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 block w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none text-sm transition-all"
                placeholder="Search by study room name..."
              />
            </div>
            
            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-sm font-semibold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              Filters
            </button>
          </div>

          {/* Mobile Filters Drawer */}
          {showMobileFilters && (
            <div className="lg:hidden p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-5 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-slate-150">Mobile Filters</span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Floor</label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-200"
                  >
                    <option value="">All</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Max Rate ($)</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITY_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(option)}
                        onChange={() => handleAmenityChange(option)}
                        className="rounded border-slate-800 text-indigo-650 bg-slate-955 w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <Spinner />
          ) : rooms.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/45 rounded-3xl border border-slate-850/80">
              <p className="text-lg font-bold text-slate-300">No rooms found</p>
              <p className="text-slate-450 text-sm mt-1">
                Try adjusting your search filters or clear the keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-550/20 hover:border-transparent text-sm font-semibold rounded-xl transition-all"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}
