'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { rooms } from '@/data/roomData'
import { 
  Sparkles, 
  Star, 
  MapPin, 
  ChevronRight, 
  Heart, 
  Share2, 
  Users, 
  Bed, 
  Bath, 
  Square, 
  Wifi, 
  Car, 
  Utensils, // Changed from Kitchen to Utensils
  Tv, 
  Wind, 
  Coffee, 
  Dumbbell, 
  Waves, 
  CheckCircle 
} from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!params?.id) return
    const foundRoom = rooms.find(r => r.id === parseInt(params.id, 10))
    setRoom(foundRoom || null)
  }, [params])

  // Sample room amenities data
  const roomAmenities = {
    basic: [
      { icon: <Wifi className="w-5 h-5" />, label: 'High-speed WiFi', included: true },
      { icon: <Tv className="w-5 h-5" />, label: 'Smart TV', included: true },
      { icon: <Wind className="w-5 h-5" />, label: 'Air Conditioning', included: true },
      { icon: <Utensils className="w-5 h-5" />, label: 'Kitchen Access', included: true },
      { icon: <Car className="w-5 h-5" />, label: 'Parking Space', included: room?.hasParking || false },
    ],
    facilities: [
      { icon: <Coffee className="w-5 h-5" />, label: 'Coffee Maker', included: true },
      { icon: <Dumbbell className="w-5 h-5" />, label: 'Gym Access', included: room?.hasGym || true },
      { icon: <Waves className="w-5 h-5" />, label: 'Swimming Pool', included: room?.hasPool || true },
      { icon: <Users className="w-5 h-5" />, label: 'Shared Lounge', included: true },
    ]
  }

  const locationDetails = {
    distance: {
      center: '1.2 km',
      supermarket: '500 m',
      restaurant: '300 m',
      busStop: '150 m'
    },
    neighborhood: ['Quiet residential area', '24/7 security', 'Walking distance to parks', 'Near shopping district']
  }

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
          <div className="absolute top-6 right-6 flex gap-2">
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-6 left-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {room.price}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    {room.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">(128 reviews)</span>
                </div>
              </div>

              {/* Room Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl mb-6">
                <div className="flex flex-col items-center p-3">
                  <Bed className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="font-bold text-gray-900 dark:text-white">{room.beds || 2} Beds</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Comfortable</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <Bath className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="font-bold text-gray-900 dark:text-white">{room.baths || 1} Bath</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Private</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <Square className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="font-bold text-gray-900 dark:text-white">{room.size || 45} m²</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Spacious</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <Users className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="font-bold text-gray-900 dark:text-white">Max {room.maxGuests || 3}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Guests</span>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                {['overview', 'amenities', 'location', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium capitalize transition ${
                      activeTab === tab
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Room</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{room.description}</p>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            Room Features
                          </h4>
                          <ul className="space-y-2">
                            {['Private entrance', 'Study desk', 'Wardrobe', 'Balcony/Patio', 'Private bathroom', 'Soundproof windows'].map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            Included Services
                          </h4>
                          <ul className="space-y-2">
                            {['Weekly cleaning', 'Utilities included', 'High-speed internet', 'Maintenance support', '24/7 security'].map((service) => (
                              <li key={service} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'amenities' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Basic Amenities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roomAmenities.basic.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              {amenity.icon}
                            </div>
                            <span className="text-gray-900 dark:text-white">{amenity.label}</span>
                            {amenity.included && (
                              <span className="ml-auto text-sm text-emerald-600 dark:text-emerald-400">Included</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Building Facilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roomAmenities.facilities.map((facility, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              {facility.icon}
                            </div>
                            <span className="text-gray-900 dark:text-white">{facility.label}</span>
                            {facility.included && (
                              <span className="ml-auto text-sm text-emerald-600 dark:text-emerald-400">Available</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location Details</h3>
                      
                      {/* Map */}
                      {room.coordinates && (
                        <div className="mb-6 h-80 w-full rounded-2xl overflow-hidden">
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

                      {/* Distance to Places */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Distance to Nearby Places</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(locationDetails.distance).map(([place, distance]) => (
                            <div key={place} className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                              <div className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">{distance}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-1">
                                {place.replace(/([A-Z])/g, ' $1')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Neighborhood Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Neighborhood Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {locationDetails.neighborhood.map((feature, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h3>
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">Alex Johnson</div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">2 weeks ago</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Great room with all necessary amenities. The location is perfect and the host is very responsive.
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Booking */}
          <div className="space-y-6">
            {/* Owner Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <img src={room.owner.avatar} alt={room.owner.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{room.owner.name}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">4.8 (42 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Response rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Response time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Within an hour</span>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.price}</div>
                <div className="text-gray-600 dark:text-gray-400">per month including utilities</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400">Security deposit</span>
                  <span className="font-semibold text-gray-900 dark:text-white">$500</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400">Minimum stay</span>
                  <span className="font-semibold text-gray-900 dark:text-white">6 months</span>
                </div>
              </div>

              <button
                onClick={() => alert('Booking feature coming soon')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
              >
                Book Now
              </button>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                No booking fees • Free cancellation within 48 hours
              </p>
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 border border-blue-200 dark:border-blue-800/30">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Safety Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  <span>Never wire money or pay outside the platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  <span>Always meet in person before signing any contract</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  <span>Ask for identification during your visit</span>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
