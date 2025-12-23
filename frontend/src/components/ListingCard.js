'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ListingCard({ room }) {
  const router = useRouter()

  const handleRequestRoommate = () => {
    // Encode room info in query params
    const params = new URLSearchParams({
      step: '5',
      location: room.location,
      budget: room.price.replace(/\D/g, '') // remove $ and /mo
    })
    router.push(`/dashboard/user/request-roommate?${params.toString()}`)
  }
  
  

  return (
    <div className="relative bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col">
      <div
        className="h-52 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${room.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <span className="absolute bottom-2 left-2 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-semibold shadow">
          💰 {room.price}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {room.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-1">
          {room.description}
        </p>
        <div className="flex items-center justify-between text-gray-700 dark:text-gray-200 gap-2 text-sm font-medium mb-4">
          <span>📍 {room.location}</span>
        </div>

        {/* Request Roommate Button */}
        <button
          onClick={handleRequestRoommate}
          className="mt-auto w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Request Roommate
        </button>
      </div>
    </div>
  )
}
