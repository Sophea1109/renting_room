'use client'

import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HotelCard({ hotel }) {
  const router = useRouter()

  const handleViewHotel = () => {
    router.push(`/dashboard/user/hotel/${hotel.id}`)
  }

  return (
    <div 
      onClick={handleViewHotel}
      className="relative bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col"
    >
      
      {/* Hotel Image */}
      <div
        className="h-52 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${hotel.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <span className="absolute bottom-2 left-2 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-semibold shadow">
          {hotel.price}
        </span>
        <div className="absolute top-2 right-2 flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs">
          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
          {hotel.rating}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Hotel Title */}
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {hotel.name}
        </h3>

        {/* Hotel Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-1 line-clamp-2">
          {hotel.description}
        </p>

        {/* Amenities Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.slice(0, 3).map(amenity => (
            <span key={amenity} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 text-[10px] rounded-md border border-gray-200 dark:border-gray-500">
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-[10px] text-gray-400 flex items-center">+{hotel.amenities.length - 3}</span>
          )}
        </div>

        {/* Hotel Location */}
        <div className="flex items-center justify-between text-gray-700 dark:text-gray-200 gap-2 text-sm font-medium mb-4">
          <span>📍 {hotel.location}</span>
        </div>

        {/* Manager Info */}
        {hotel.manager && (
          <div className="flex items-center gap-2 mb-4">
            <img
              src={hotel.manager.avatar}
              alt={hotel.manager.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {hotel.manager.name}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewHotel();
            }}
           className="flex-1 px-4 py-2 bg-[#8EB69B] text-white font-semibold rounded-lg hover:bg-[#7aa88c] transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  )
}
