'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import MainLayout from '../../../components/MainLayout';
import Spinner from '../../../components/Spinner';
import toast from 'react-hot-toast';
import { Calendar, Clock, DollarSign, Layers, Users, Edit3, Trash2, ShieldAlert, BadgeCheck, AlertCircle } from 'lucide-react';

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
      // Pre-fill edit form
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
    // Default booking date to today
    const today = new Date().toISOString().split('T')[0];
    setBookingDate(today);
  }, [id]);

  if (loading) {
    return (
      <MainLayout title="Loading Room...">
        <Spinner />
      </MainLayout>
    );
  }

  if (!room) {
    return (
      <MainLayout title="Room Not Found">
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-205">Room Not Found</h2>
          <p className="text-slate-450 mt-1">The study room you are looking for does not exist or has been deleted.</p>
          <button
            onClick={() => router.push('/rooms')}
            className="mt-6 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold rounded-xl"
          >
            Back to All Rooms
          </button>
        </div>
      </MainLayout>
    );
  }

  const isOwner = user && room.ownerId === user._id;

  // Real-time booking duration & total cost calculator
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  const duration = Math.max(0, endHour - startHour);
  const totalCost = duration * room.hourlyRate;

  // Handle Booking
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
      // Reset form
      setSpecialNote('');
      // Refresh details to update booking count
      fetchRoomDetails();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create booking.';
      toast.error(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle Edit Room Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editName || !editDesc || !editImage || !editFloor || !editCapacity || !editHourlyRate) {
      toast.error('Please enter all required fields.');
      return;
    }

    setEditLoading(true);
    try {
      const res = await api.put(`/api/rooms/${room._id}`, {
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

  // Handle Delete Room
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

  return (
    <MainLayout title={room.name}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-4">
        
        {/* Left 2 Columns: Room details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
              }}
            />
            {/* Owner badge */}
            {isOwner && (
              <span className="absolute top-4 right-4 px-3.5 py-1.5 bg-indigo-500 text-white rounded-full text-xs font-bold shadow-lg border border-indigo-400/30">
                You own this room
              </span>
            )}
          </div>

          {/* Details and Description */}
          <div className="bg-slate-900 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{room.name}</h1>
                <p className="text-sm text-slate-400 mt-1">Listed under floor: <span className="text-slate-300 font-semibold">{room.floor}</span></p>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 text-indigo-400">
                <BadgeCheck className="w-5 h-5" />
                <span className="text-sm font-semibold">{room.bookingCount} Bookings</span>
              </div>
            </div>

            <div className="border-t border-slate-800/50 pt-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Description</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {room.description}
              </p>
            </div>

            {/* Quick specifications */}
            <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-800/50 text-center">
              <div className="space-y-1">
                <span className="text-xs text-slate-450 block uppercase tracking-wider">Floor</span>
                <span className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1">
                  <Layers className="w-4 h-4 text-indigo-400" /> {room.floor}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-450 block uppercase tracking-wider">Seat Capacity</span>
                <span className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-indigo-400" /> {room.capacity} people
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-450 block uppercase tracking-wider">Hourly Rate</span>
                <span className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1">
                  <DollarSign className="w-4 h-4 text-indigo-400" /> ${room.hourlyRate}/hr
                </span>
              </div>
            </div>

            {/* Amenities list */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Room Amenities</h3>
              <div className="flex flex-wrap gap-2.5">
                {room.amenities && room.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 rounded-xl"
                  >
                    {amenity}
                  </span>
                ))}
                {(!room.amenities || room.amenities.length === 0) && (
                  <span className="text-slate-500 text-sm">No special amenities listed for this room.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Actions Box */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800/85 p-6 rounded-3xl space-y-6 shadow-xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-450 uppercase block tracking-wider">Reservation Cost</span>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-black">${room.hourlyRate}</span>
                <span className="text-sm text-slate-450 font-semibold">/ hour</span>
              </div>
            </div>

            <div className="space-y-3">
              {user ? (
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-650 hover:from-indigo-600 hover:to-violet-750 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  <Calendar className="w-5 h-5" />
                  Book Now
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/login?redirect=/rooms/${room._id}`)}
                  className="w-full py-3 px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-center transition-colors"
                >
                  Login to Book
                </button>
              )}
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="border-t border-slate-800/60 pt-5 space-y-3">
                <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider block">Owner Controls</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-750 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                    Edit Listing
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 hover:border-rose-900/40 text-rose-400 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Room
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL 1: BOOKING FORM MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="text-indigo-400" /> Book {room.name}
            </h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              
              {/* Date Input */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Slots Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Start Time</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {TIME_SLOTS.slice(0, -1).map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">End Time</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {TIME_SLOTS.filter(t => t > startTime).map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Cost Preview */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-450 block">Duration</span>
                  <span className="text-sm font-bold text-slate-200">{duration} hour{duration > 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-450 block text-right">Total Cost</span>
                  <span className="text-base font-black text-indigo-400">${totalCost}</span>
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Special Note (Optional)</label>
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 h-20 resize-none"
                  placeholder="Any requirements (e.g. need HDMI adapter)..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-1/2 py-3 px-4 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-center border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-1/2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-700 text-white font-bold rounded-xl text-center transition-colors disabled:opacity-50"
                >
                  {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT LISTING MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit3 className="text-indigo-400 w-5 h-5" /> Edit Room Details
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Room Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 h-24"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Floor</label>
                  <input
                    type="text"
                    required
                    value={editFloor}
                    onChange={(e) => setEditFloor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Rate ($/hr)</label>
                  <input
                    type="number"
                    required
                    value={editHourlyRate}
                    onChange={(e) => setEditHourlyRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Amenities checklist */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editAmenities.includes(amenity)}
                        onChange={() => handleEditAmenityChange(amenity)}
                        className="rounded border-slate-800 text-indigo-650 bg-slate-955 w-4 h-4 cursor-pointer"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-805">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-1/2 py-2.5 px-4 bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold rounded-xl text-center transition-colors border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="w-1/2 py-2.5 px-4 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-center transition-colors disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">Delete Listing?</h2>
              <p className="text-sm text-slate-400">
                Are you sure you want to permanently delete this listing? This action cannot be undone and will delete all associated bookings.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="w-1/2 py-2.5 px-4 bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold rounded-xl border border-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  handleDeleteRoom();
                }}
                className="w-1/2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-900/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
}
