'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import MainLayout from '../../../components/MainLayout';
import Spinner from '../../../components/Spinner';
import toast from 'react-hot-toast';
import { Calendar, Clock, DollarSign, Layers, Users, Edit3, Trash2, ShieldAlert, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const AMENITIES_LIST = [
  'Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'
];

export default function RoomDetails() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Booking Form state
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [specialNote, setSpecialNote] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Edit Room Form state
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editFloor, setEditFloor] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [editHourlyRate, setEditHourlyRate] = useState('');
  const [editAmenities, setEditAmenities] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  const fetchRoomDetails = async () => {
    try {
      const res = await api.get(`/api/rooms/${id}`);
      setRoom(res.data);
      setEditName(res.data.name);
      setEditDesc(res.data.description);
      setEditImage(res.data.image);
      setEditFloor(res.data.floor);
      setEditCapacity(res.data.capacity);
      setEditHourlyRate(res.data.hourlyRate);
      setEditAmenities(res.data.amenities || []);
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Failed to load room details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
    const today = new Date().toISOString().split('T')[0];
    setBookingDate(today);
  }, [id]);

  if (loading) {
    return (
      <MainLayout title="Loading Room...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  if (!room) {
    return (
      <MainLayout title="Room Not Found">
        <div className="text-center py-24 max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4 stroke-1" />
          <h2 className="text-xl font-medium text-zinc-200">Room Not Found</h2>
          <p className="text-zinc-500 mt-2 text-sm leading-relaxed">The study room you are looking for does not exist or has been removed.</p>
          <button
            onClick={() => router.push('/rooms')}
            className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
          >
            Back to All Rooms
          </button>
        </div>
      </MainLayout>
    );
  }

  const isOwner = user && room.ownerId === user._id;

  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  const duration = Math.max(0, endHour - startHour);
  const totalCost = duration * room.hourlyRate;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (endHour <= startHour) {
      toast.error('End time must be after start time.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (bookingDate < today) {
      toast.error('Booking date must be today or a future date.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/api/bookings', {
        roomId: room._id,
        date: bookingDate,
        startTime,
        endTime,
        specialNote,
      });
      toast.success(res.data.message || 'Room booked successfully!');
      setBookingModalOpen(false);
      setSpecialNote('');
      fetchRoomDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName || !editDesc || !editImage || !editFloor || !editCapacity || !editHourlyRate) {
      toast.error('Please enter all required fields.');
      return;
    }

    setEditLoading(true);
    try {
      await api.put(`/api/rooms/${room._id}`, {
        name: editName,
        description: editDesc,
        image: editImage,
        floor: editFloor,
        capacity: Number(editCapacity),
        hourlyRate: Number(editHourlyRate),
        amenities: editAmenities,
      });
      toast.success('Room updated successfully!');
      setEditModalOpen(false);
      fetchRoomDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update room.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await api.delete(`/api/rooms/${room._id}`);
      toast.success('Room deleted successfully!');
      router.push('/rooms');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room.');
    }
  };

  const handleEditAmenityChange = (amenity) => {
    if (editAmenities.includes(amenity)) {
      setEditAmenities(editAmenities.filter((a) => a !== amenity));
    } else {
      setEditAmenities([...editAmenities, amenity]);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  };

  return (
    <MainLayout title={room.name}>
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >

        {/* Left Columns: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image Viewport */}
          <motion.div 
            className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800"
            variants={elementVariants}
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500 hover:scale-101"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
              }}
            />
            {isOwner && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-zinc-900/90 text-zinc-350 border border-zinc-700 backdrop-blur-sm rounded-md text-xs font-medium tracking-wide">
                Owner Managed
              </span>
            )}
          </motion.div>

          {/* Details & Core Specification */}
          <motion.div className="space-y-6" variants={elementVariants}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-100">{room.name}</h1>
                <p className="text-sm text-zinc-500 mt-1.5">
                  Location & Floor: <span className="text-zinc-400 font-medium">{room.floor}</span>
                </p>
              </div>
              <div className="text-xs font-medium tracking-wider uppercase px-3 py-1.5 bg-zinc-850 text-zinc-400 rounded border border-zinc-700/60">
                {room.bookingCount} Bookings Completed
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Overview</h3>
              <p className="text-zinc-450 text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-3xl">
                {room.description}
              </p>
            </div>

            {/* Micro Specs Bar */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-zinc-800 text-left">
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500 block uppercase tracking-wider">Floor</span>
                <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500 stroke-1" /> {room.floor}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500 block uppercase tracking-wider">Seat Capacity</span>
                <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-500 stroke-1" /> {room.capacity} seats
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500 block uppercase tracking-wider">Base Rate</span>
                <span className="text-sm font-medium text-zinc-300 flex items-center gap-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-500 stroke-1" />{room.hourlyRate}/hr
                </span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Room Provisions</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities && room.amenities.map((amenity, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 text-xs font-medium bg-zinc-900 border border-zinc-800/80 text-zinc-400 rounded-md"
                  >
                    {amenity}
                  </motion.span>
                ))}
                {(!room.amenities || room.amenities.length === 0) && (
                  <span className="text-zinc-650 text-sm italic">No special provisions specified.</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Execution Panels */}
        <motion.div className="space-y-6" variants={elementVariants}>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-lg">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 uppercase block tracking-wider">Pricing details</span>
              <div className="flex items-baseline gap-1 text-zinc-100">
                <span className="text-3xl font-semibold tracking-tight">${room.hourlyRate}</span>
                <span className="text-xs text-zinc-500 font-medium">USD / hour</span>
              </div>
            </div>

            <div className="pt-2">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4 stroke-1" />
                  Reserve Space
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/login?redirect=/rooms/${room._id}`)}
                  className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-205 text-sm font-medium rounded-lg text-center transition-colors border border-zinc-705 cursor-pointer"
                >
                  Sign In to Book
                </motion.button>
              )}
            </div>

            {/* Structural Admin Control Row */}
            {isOwner && (
              <div className="border-t border-zinc-800 pt-5 space-y-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Management tools</p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-md text-xs font-medium transition-colors border border-zinc-750 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                    Edit Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-405 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Listing
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>

      {/* MODAL Overlay & Dialogs with AnimatePresence */}
      <AnimatePresence>
        {/* MODAL 1: MINIMAL RESERVATION */}
        {bookingModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 space-y-6 shadow-xl max-h-[95vh] overflow-y-auto"
            >
              <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                Configure Reservation
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">Selected Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">Start</label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {TIME_SLOTS.slice(0, -1).map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">End</label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {TIME_SLOTS.filter(t => t > startTime).map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Costing Breakout Box */}
                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-500 block">Total Hours</span>
                    <span className="text-sm font-medium text-zinc-300">{duration} hour{duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 block">Calculated Net Cost</span>
                    <span className="text-base font-semibold text-zinc-200">${totalCost}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">Notes or Adapter Requests (Optional)</label>
                  <textarea
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-20 resize-none"
                    placeholder="Specify hardware additions here..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="w-1/2 py-2 px-4 bg-transparent hover:bg-zinc-800 text-zinc-400 text-sm font-medium rounded-lg border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-1/2 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {bookingLoading ? 'Processing...' : 'Complete Reservation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 2: MINIMAL EDIT FORM */}
        {editModalOpen && (
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
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                Update Resource Parameters
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Room Title</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Asset Image URI</label>
                    <input
                      type="url"
                      required
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Resource Description</label>
                  <textarea
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Floor Level</label>
                    <input
                      type="text"
                      required
                      value={editFloor}
                      onChange={(e) => setEditFloor(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Max Capacity</label>
                    <input
                      type="number"
                      required
                      value={editCapacity}
                      onChange={(e) => setEditCapacity(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Rate ($/hr)</label>
                    <input
                      type="number"
                      required
                      value={editHourlyRate}
                      onChange={(e) => setEditHourlyRate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Toggled Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AMENITIES_LIST.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editAmenities.includes(amenity)}
                          onChange={() => handleEditAmenityChange(amenity)}
                          className="rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="w-1/2 py-2 px-4 bg-transparent hover:bg-zinc-800 text-zinc-400 text-sm font-medium rounded-lg border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="w-1/2 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {editLoading ? 'Saving...' : 'Commit Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 3: DESTRUCTIVE CONFIRMATION */}
        {deleteConfirmOpen && (
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
              className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 text-center space-y-4 shadow-xl"
            >
              <ShieldAlert className="w-10 h-10 text-red-500 mx-auto stroke-1" />
              <div className="space-y-1">
                <h2 className="text-md font-medium text-zinc-200">Permanently delete listing?</h2>
                <p className="text-xs text-zinc-500 leading-relaxed px-2">
                  This process removes all historical asset indices and unfulfilled bookings. This choice cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="w-1/2 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 text-xs font-medium rounded-lg border border-zinc-800 transition-colors cursor-pointer"
                >
                  Abort
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    handleDeleteRoom();
                  }}
                  className="w-1/2 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Deletion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </MainLayout>
  );
}