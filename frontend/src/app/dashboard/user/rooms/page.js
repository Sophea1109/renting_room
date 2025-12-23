'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RoomCard from '@/components/RoomCard'
import { rooms as initialRooms } from '@/data/roomData'

export default function RoomsPage() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Dynamically get unique locations for the filter dropdown
  const locations = useMemo(() => {
    const allLocations = initialRooms.map(r => r.location)
    return [...new Set(allLocations)]
  }, [])

  const filteredRooms = initialRooms.filter(room => {
    const matchesTitle = room.title.toLowerCase().includes(search.toLowerCase())
    const matchesLocation = locationFilter === '' || room.location === locationFilter
    const roomPriceNum = parseInt(room.price.replace(/\D/g, '')) || 0
    const matchesMinPrice = minPrice === '' || roomPriceNum >= parseInt(minPrice)
    const matchesMaxPrice = maxPrice === '' || roomPriceNum <= parseInt(maxPrice)
    return matchesTitle && matchesLocation && matchesMinPrice && matchesMaxPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Page Title */}
      <section className="pt-32 pb-8 text-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
          Browse Rooms
        </h1>
        <p className="mt-3 text-white/90">
          Find available rooms and connect with owners or roommates.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-500"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredRooms.length === 0 ? (
          <p className="text-center col-span-full text-gray-700 dark:text-gray-200">
            No rooms found.
          </p>
        ) : (
          filteredRooms.map(room => <RoomCard key={room.id} room={room} />)
        )}
      </section>

      <Footer />
    </div>
  )
}
