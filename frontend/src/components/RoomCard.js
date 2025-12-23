'use client'
import { useRouter } from 'next/navigation'

export default function RoomCard({ room }) {
  const router = useRouter()

  const handleRequestRoommate = () => {
    // Redirect to the form to request a roommate
    router.push('/request-roommate')
  }

  const handleViewRoom = () => {
    // Redirect to room detail page (you can adjust the route as needed)
    router.push(`/dashboard/user/rooms/${room.id}`)
  }

  return (
    <div className="relative bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col">
      
      {/* Room Image */}
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
        {/* Room Title */}
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {room.title}
        </h3>

        {/* Room Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex-1">
          {room.description}
        </p>

        {/* Room Location */}
        <div className="flex items-center justify-between text-gray-700 dark:text-gray-200 gap-2 text-sm font-medium mb-4">
          <span>📍 {room.location}</span>
        </div>

        {/* Owner Info */}
        {room.owner && (
          <div className="flex items-center gap-2 mb-4">
            <img
              src={room.owner.avatar}
              alt={room.owner.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {room.owner.name}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={handleViewRoom}
            className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  )
}
