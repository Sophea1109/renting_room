'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchHotel } from '@/lib/hotelApi'
import { Star, MapPin, Wifi, Coffee, Wind, Car, Shield, Clock } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import PaymentModal from '@/components/PaymentModal'

// Fix default marker issue with Next.js + Leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  })
}

// Predefined coordinates for known locations (same as rooms page)
const LOCATION_COORDINATES = {
  'Chamkarmon':       { lat: 11.5449, lng: 104.9220 },
  'Toul Kork':        { lat: 11.5796, lng: 104.9078 },
  '7 Makara':         { lat: 11.5625, lng: 104.9160 },
  'Boeung Keng Kang': { lat: 11.5530, lng: 104.9270 },
  'Sen Sok':          { lat: 11.6050, lng: 104.8780 },
  'Chroy Changvar':   { lat: 11.5990, lng: 104.9380 },
  'Dangkao':          { lat: 11.4870, lng: 104.9100 },
  'Meanchey':         { lat: 11.5250, lng: 104.9350 },
  'Phnom Penh':       { lat: 11.5564, lng: 104.9282 },
  'Siem Reap':        { lat: 13.3671, lng: 103.8448 },
  'Sihanoukville':    { lat: 10.6093, lng: 103.5296 },
  'Kampot':           { lat: 10.5942, lng: 104.1815 },
  'default':          { lat: 11.5564, lng: 104.9282 },
}

function getCoordinates(location) {
  if (!location) return LOCATION_COORDINATES['default']
  const exact = LOCATION_COORDINATES[location]
  if (exact) return exact
  const key = Object.keys(LOCATION_COORDINATES).find(k =>
    location.toLowerCase().includes(k.toLowerCase())
  )
  return key ? LOCATION_COORDINATES[key] : LOCATION_COORDINATES['default']
}

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [days, setDays] = useState(1)

  useEffect(() => {
    if (!params?.id) return
    fetchHotel(params.id)
      .then(data => {
        setHotel(data)
        setTotalPrice(data.monthly_rent || parseInt(data.price.replace(/\D/g, ''), 10))
      })
      .catch(() => setHotel(null))
      .finally(() => setLoading(false))
  }, [params?.id])

  useEffect(() => {
    if (startDate && endDate && hotel) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24))
      const basePrice = hotel.monthly_rent || parseInt(hotel.price.replace(/\D/g, ''), 10)
      if (diffDays > 0) {
        setDays(diffDays)
        setTotalPrice(basePrice * diffDays)
      } else {
        setDays(1)
        setTotalPrice(basePrice)
      }
    }
  }, [startDate, endDate, hotel])

  if (loading) return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    </div>
  )

  if (!hotel) return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold mb-4">Hotel Not Found</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-[#235347] text-[#DAF1DE] rounded-lg hover:bg-[#0B2B26] transition"
        >
          Go Back
        </button>
      </div>
      <Footer />
    </div>
  )

  const isOccupied = hotel.occupancy_status === 'occupied'
  const canBook = !isOccupied && startDate && endDate
  const coords = getCoordinates(hotel.location)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="pt-24 container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div
          className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden mb-8 bg-cover bg-center shadow-2xl bg-gray-200"
          style={{ backgroundImage: hotel.image ? `url(${hotel.image})` : undefined }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Go Back
          </button>

          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#DAF1DE] text-[#0B2B26] px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {hotel.price}
                </span>
                <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm border border-white/20">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  {hotel.rating} Rating
                </div>
                {isOccupied && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Fully Booked
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">{hotel.name}</h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-20">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-[#235347] dark:text-[#DAF1DE] mb-6 font-medium">
                <MapPin className="w-5 h-5" />
                {hotel.location}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About this hotel</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {hotel.description}
                </p>
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mt-10 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What this place offers</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] flex items-center justify-center text-[#0B2B26]">
                          {amenity.includes('Wifi') || amenity.includes('WiFi') ? <Wifi className="w-5 h-5" /> :
                           amenity.includes('Breakfast') ? <Coffee className="w-5 h-5" /> :
                           amenity.includes('AC') ? <Wind className="w-5 h-5" /> :
                           amenity.includes('Parking') ? <Car className="w-5 h-5" /> :
                           amenity.includes('Pool') ? <Shield className="w-5 h-5" /> :
                           <Clock className="w-5 h-5" />}
                        </div>
                        <span className="text-gray-700 dark:text-gray-200 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map — always shown using location name lookup */}
              {!isPaymentOpen && (
                <div className="mt-10 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Location</h2>
                  <div className="h-80 w-full rounded-3xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                    <MapContainer
                      center={[coords.lat, coords.lng]}
                      zoom={15}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[coords.lat, coords.lng]}>
                        <Popup>{hotel.name}<br />{hotel.location}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Booking */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 sticky top-28">
              {/* Manager info */}
              <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <img
                  src={hotel.manager.avatar}
                  alt={hotel.manager.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#235347]/30 shadow-md"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Manager</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{hotel.manager.name}</p>
                </div>
              </div>

              {/* Occupied banner */}
              {isOccupied && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                  <span className="text-red-600 font-semibold text-sm">🔒 This hotel is fully booked</span>
                  <p className="text-red-400 text-xs mt-1">Not available for new bookings at this time</p>
                </div>
              )}

              {/* Date pickers */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Check-in Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isOccupied}
                    style={{ colorScheme: 'light' }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#235347] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Check-out Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isOccupied}
                    style={{ colorScheme: 'light' }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#235347] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Price summary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Price per night</span>
                  <span className="text-xl font-bold text-[#0B2B26] dark:text-[#DAF1DE]">{hotel.price}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Total nights</span>
                  <span className="font-bold text-[#235347] dark:text-[#DAF1DE]">{days} {days > 1 ? 'Nights' : 'Night'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Service fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-[#235347] dark:text-[#DAF1DE]">${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentOpen(true)}
                disabled={!canBook}
                title={isOccupied ? 'This hotel is fully booked' : (!startDate || !endDate ? 'Please select check-in and check-out dates' : '')}
                className="w-full mt-8 px-4 py-4 bg-[#0B2B26] text-[#DAF1DE] font-black rounded-2xl hover:bg-[#235347] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#0B2B26]/20 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isOccupied ? 'Fully Booked' : (!startDate || !endDate ? 'Select Dates to Book' : 'Reserve Now')}
              </button>

              <button className="w-full mt-3 px-4 py-4 bg-transparent text-[#235347] dark:text-[#DAF1DE] font-bold rounded-2xl border-2 border-[#235347] hover:bg-[#DAF1DE]/20 transition-all uppercase tracking-widest text-sm">
                Contact Manager
              </button>

              <p className="mt-6 text-center text-xs text-gray-400">
                You won&apos;t be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        item={hotel}
        type="hotel"
        dates={{ startDate, endDate }}
        totalPrice={`$${totalPrice}`}
        roomId={hotel.id}
        ownerId={hotel.owner_id}
        startDate={startDate}
        endDate={endDate}
        totalAmount={totalPrice}
      />
    </div>
  )
}
