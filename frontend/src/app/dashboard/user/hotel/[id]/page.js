'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { hotels } from '@/data/hotelData'
import { Star, MapPin, ChevronRight, Wifi, Coffee, Wind, Car, Shield, Clock } from 'lucide-react'
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
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  })
}

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [days, setDays] = useState(0)

  useEffect(() => {
    if (!params?.id) return
    const foundHotel = hotels.find(h => h.id === parseInt(params.id, 10))
    setHotel(foundHotel || null)
    if (foundHotel) {
      setTotalPrice(parseInt(foundHotel.price.replace(/\D/g, ''), 10))
    }
  }, [params])

  useEffect(() => {
    if (startDate && endDate && hotel) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const basePrice = parseInt(hotel.price.replace(/\D/g, ''), 10)
      
      if (diffDays > 0) {
        setDays(diffDays)
        setTotalPrice(basePrice * diffDays)
      } else {
        setDays(1)
        setTotalPrice(basePrice)
      }
    }
  }, [startDate, endDate, hotel])

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="pt-24 container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div 
          className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden mb-8 bg-cover bg-center shadow-2xl"
          style={{ backgroundImage: `url(${hotel.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
         <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
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

              <div className="mt-10 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What this place offers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-xl bg-[#DAF1DE] flex items-center justify-center text-[#0B2B26]">
                        {amenity.includes('Wifi') && <Wifi className="w-5 h-5" />}
                        {amenity.includes('Breakfast') && <Coffee className="w-5 h-5" />}
                        {amenity.includes('AC') && <Wind className="w-5 h-5" />}
                        {amenity.includes('Parking') && <Car className="w-5 h-5" />}
                        {amenity.includes('Pool') && <Shield className="w-5 h-5" />}
                        {!['Wifi', 'Breakfast', 'AC', 'Parking', 'Pool'].some(a => amenity.includes(a)) && <Clock className="w-5 h-5" />}
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Section */}
              {hotel.coordinates && !isPaymentOpen && (
                <div className="mt-10 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Location</h2>
                  <div className="h-80 w-full rounded-3xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                    <MapContainer
                      center={[hotel.coordinates.lat, hotel.coordinates.lng]}
                      zoom={15}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[hotel.coordinates.lat, hotel.coordinates.lng]}>
                        <Popup>{hotel.name}</Popup>
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
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Check-in Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#235347] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Check-out Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#235347] transition"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Price per night</span>
                  <span className="text-xl font-bold text-[#0B2B26] dark:text-[#DAF1DE]">{hotel.price}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Total nights</span>
                  <span className="font-bold text-[#235347] dark:text-[#DAF1DE]">{days || 1} {days > 1 ? 'Nights' : 'Night'}</span>
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
                className="w-full mt-8 px-4 py-4 bg-[#0B2B26] text-[#DAF1DE] font-black rounded-2xl hover:bg-[#235347] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#0B2B26]/20 uppercase tracking-widest text-sm"
              >
                Reserve Now
              </button>
              
              <button className="w-full mt-3 px-4 py-4 bg-transparent text-[#235347] dark:text-[#DAF1DE] font-bold rounded-2xl border-2 border-[#235347] hover:bg-[#DAF1DE]/20 transition-all uppercase tracking-widest text-sm">
                Contact Manager
              </button>
              
              <p className="mt-6 text-center text-xs text-gray-400">
                You won't be charged yet
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
      />
    </div>
  )
}
