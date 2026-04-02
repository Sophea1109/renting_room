'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HotelCard from '@/components/HotelCard'
import { hotels as mockHotels } from '@/data/hotelData'

export default function HotelPage() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  const locations = useMemo(() => {
    const allLocations = mockHotels.map(h => h.location)
    return [...new Set(allLocations)]
  }, [])

  const filteredHotels = mockHotels.filter(hotel => {
    const matchesTitle = hotel.name.toLowerCase().includes(search.toLowerCase())
    const matchesLocation = locationFilter === '' || hotel.location === locationFilter
    return matchesTitle && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-8 text-center bg-gradient-to-r from-[#0B2B26] via-[#235347] to-[#DAF1DE]">
        <div className="absolute inset-0 opacity-10 ]"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-black text-[#DAF1DE] drop-shadow-2xl tracking-tight">
            Discover Best Hotels
          </h1>
          <p className="mt-4 text-[#DAF1DE]/80 text-lg md:text-xl max-w-2xl mx-auto">
            Find the perfect stay for your next trip with exclusive deals and top-rated services.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-4 border border-[#DAF1DE]/20">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by hotel name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#235347] transition"
            />
          </div>
          <div className="md:w-64">
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#235347] transition appearance-none"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <button className="px-8 py-4 bg-[#235347] text-[#DAF1DE] font-bold rounded-2xl hover:bg-[#0B2B26] transition-all shadow-lg">
            Search
          </button>
        </div>
      </section>

      {/* Hotel Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Stays</h2>
          <span className="text-gray-500 text-sm font-medium">{filteredHotels.length} hotels found</span>
        </div>
        
        {filteredHotels.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-xl text-gray-500">No hotels found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredHotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
