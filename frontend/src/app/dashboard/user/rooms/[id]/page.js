
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { rooms } from '@/data/roomData'
import { Sparkles, Star, MapPin, ChevronRight, Heart, Share2, Users } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

// Fix default marker issue with Next.js + Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [room, setRoom] = useState(null)

  useEffect(() => {
    if (!params?.id) return
    const foundRoom = rooms.find(r => r.id === parseInt(params.id, 10))
    setRoom(foundRoom || null)
  }, [params])

  if (!room) return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold mb-4">Room Not Found</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Go Back
        </button>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="pt-24 container mx-auto px-4 max-w-6xl">
        {/* Hero Image */}
        <div 
          className="relative h-96 w-full rounded-3xl overflow-hidden mb-8 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.image})` }}
        >
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-600 transition"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back
          </button>
          <div className="absolute bottom-6 left-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg">
            {room.price}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-emerald-500" />
                {room.location}
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">{room.description}</p>

              {/* Map Section */}
              {room.coordinates && (
                <div className="mt-6 h-80 w-full rounded-2xl overflow-hidden">
                  <MapContainer
                    center={[room.coordinates.lat, room.coordinates.lng]}
                    zoom={16}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[room.coordinates.lat, room.coordinates.lng]}>
                      <Popup>{room.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Owner */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <img src={room.owner.avatar} alt={room.owner.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{room.owner.name}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">4.8</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push(`/request-roommate?room=${room.id}`)}
                className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg mb-2 hover:bg-emerald-600 transition"
              >
                Request Roommate
              </button>
              <button className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-emerald-500 hover:bg-white transition">
                Message Owner
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
