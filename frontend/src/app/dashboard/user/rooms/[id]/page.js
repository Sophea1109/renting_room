'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sparkles, Star, MapPin, ChevronRight, Heart, Share2 } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import PaymentModal from '@/components/PaymentModal'

// Fix default marker issue with Next.js + Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

// Predefined coordinates for known locations
const LOCATION_COORDINATES = {
  'Chamkarmon':      { lat: 11.5449, lng: 104.9220 },
  'Toul Kork':       { lat: 11.5796, lng: 104.9078 },
  '7 Makara':        { lat: 11.5625, lng: 104.9160 },
  'Boeung Keng Kang':{ lat: 11.5530, lng: 104.9270 },
  'Sen Sok':         { lat: 11.6050, lng: 104.8780 },
  'Chroy Changvar':  { lat: 11.5990, lng: 104.9380 },
  'Dangkao':         { lat: 11.4870, lng: 104.9100 },
  'Meanchey':        { lat: 11.5250, lng: 104.9350 },
  // Fallback — city center of Phnom Penh
  'default':         { lat: 11.5564, lng: 104.9282 },
}

const redIcon = new L.Icon({
  iconUrl: '/leaflet/marker-icon-red.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function getCoordinates(location) {
  if (!location) return LOCATION_COORDINATES['default']
  // Try exact match first, then partial match
  const exact = LOCATION_COORDINATES[location]
  if (exact) return exact
  const key = Object.keys(LOCATION_COORDINATES).find(k =>
    location.toLowerCase().includes(k.toLowerCase())
  )
  return key ? LOCATION_COORDINATES[key] : LOCATION_COORDINATES['default']
}

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [months, setMonths] = useState(1)

  useEffect(() => {
    if (!params?.id) return
    const fetchRoom = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE_URL}/rooms/${params.id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Room not found')
        const data = await res.json()
        setRoom(data)
        setTotalPrice(data.monthly_rent || 0)
      } catch (err) {
        setRoom(null)
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [params?.id])

  useEffect(() => {
    if (startDate && endDate && room) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
      const m = monthsDiff > 0 ? monthsDiff : 1
      setMonths(m)
      setTotalPrice(room.monthly_rent * m)
    }
  }, [startDate, endDate, room])

  if (loading) return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    </div>
  )

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
          className="relative h-96 w-full rounded-3xl overflow-hidden mb-8 bg-cover bg-center bg-gray-200"
          style={{ backgroundImage: room.image ? `url(${room.image})` : undefined }}
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
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                <MapPin className="w-5 h-5 text-emerald-500" />
                {room.location}
              </div>

              {/* Room specs */}
              {(room.beds || room.baths || room.size) && (
                <div className="flex gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {room.beds && <span>🛏 {room.beds} Bed{room.beds > 1 ? 's' : ''}</span>}
                  {room.baths && <span>🚿 {room.baths} Bath{room.baths > 1 ? 's' : ''}</span>}
                  {room.size && <span>📐 {room.size} sqft</span>}
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300">{room.description}</p>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What this place offers</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map(amenity => (
                      <span key={amenity} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-100">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Map — derived from room location name */}
              {!isPaymentOpen && (() => {
                const coords = getCoordinates(room.location)
                return (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
                    <div className="h-72 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <MapContainer
                        center={[coords.lat, coords.lng]}
                        zoom={15}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker position={[coords.lat, coords.lng]} icon={redIcon}>
                          <Popup>{room.title}<br />{room.location}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
          {/* Sidebar / Booking */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              {/* Owner */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={room.owner?.avatar || '/users/default-avatar.svg'}
                  alt={room.owner?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{room.owner?.name}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">4.8</span>
                  </div>
                </div>
              </div>

              {/* Occupied banner */}
              {room.occupancy_status === 'occupied' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                  <span className="text-red-600 font-semibold text-sm">🔒 This room is currently occupied</span>
                  <p className="text-red-400 text-xs mt-1">Not available for booking at this time</p>
                </div>
              )}

              {/* Date Pickers */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Move-in Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={room.occupancy_status === 'occupied'}
                    style={{ colorScheme: 'light' }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Move-out Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={room.occupancy_status === 'occupied'}
                    style={{ colorScheme: 'light' }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Price per month</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{room.price}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Total months</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{months} {months > 1 ? 'Months' : 'Month'}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentOpen(true)}
                disabled={room.occupancy_status === 'occupied' || !startDate || !endDate}
                className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg mb-2 hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={room.occupancy_status === 'occupied' ? 'This room is currently occupied' : (!startDate || !endDate ? 'Please select move-in and move-out dates first' : '')}
              >
                {room.occupancy_status === 'occupied' ? 'Room Occupied' : (!startDate || !endDate ? 'Select Dates to Rent' : 'Rent Now')}
              </button>
              <button className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-emerald-500 hover:bg-white transition">
                Message Owner
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        item={room}
        type="room"
        dates={{ startDate, endDate }}
        totalPrice={`$${totalPrice}`}
        roomId={room.id}
        ownerId={room.owner_id}
        startDate={startDate}
        endDate={endDate}
        totalAmount={totalPrice}
      />
    </div>
  )
}
