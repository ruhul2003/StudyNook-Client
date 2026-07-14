import React from 'react';
import Link from 'next/link';
import { Users, Layers, DollarSign } from 'lucide-react';

export default function RoomCard({ room }) {
  const { _id, name, description, image, floor, capacity, hourlyRate, amenities } = room;

  // Truncate description to ~100 characters
  const truncatedDesc = description.length > 100 
    ? `${description.substring(0, 97)}...` 
    : description;

  return (
    <div className="group flex flex-col h-full bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-indigo-550/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
          }}
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        <div className="space-y-2 flex-grow">
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed min-h-[40px]">
            {truncatedDesc}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/60 text-xs text-slate-350">
          <div className="flex items-center gap-1.5 justify-center">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">{floor}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">{capacity} Seats</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate font-semibold text-slate-205">${hourlyRate}/hr</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 min-h-[26px]">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-2xs font-medium bg-slate-800 text-indigo-300 rounded border border-slate-750"
            >
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="px-2 py-0.5 text-2xs font-medium bg-indigo-950/40 text-indigo-400 rounded">
              +{amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <div>
          <Link
            href={`/rooms/${_id}`}
            className="block w-full text-center px-4 py-2.5 text-sm font-semibold bg-slate-850 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl transition-all duration-200 border border-slate-800 hover:border-indigo-500 shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
