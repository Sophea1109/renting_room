'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RoomCard from '@/components/RoomCard'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/rooms`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Failed to fetch rooms')
        const data = await response.json()
        setRooms(data.rooms || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  const locations = useMemo(() => {
    return [...new Set(rooms.map(r => r.location).filter(Boolean))]
  }, [rooms])

  const filteredRooms = rooms.filter(room => {
    const matchesTitle = room.title.toLowerCase().includes(search.toLowerCase())
    const matchesLocation = locationFilter === '' || room.location === locationFilter
    const matchesMinPrice = minPrice === '' || room.monthly_rent >= parseInt(minPrice)
    const matchesMaxPrice = maxPrice === '' || room.monthly_rent <= parseInt(maxPrice)
    return matchesTitle && matchesLocation && matchesMinPrice && matchesMaxPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Page Title */}
      <section className="pt-32 pb-8 text-center bg-gradient-to-r from-[#0B2B26] via-[#235347] to-[#DAF1DE]">
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
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center col-span-full text-red-500">{error}</p>
        ) : filteredRooms.length === 0 ? (
          <p className="text-center col-span-full text-gray-700 dark:text-gray-200">
            No available rooms found.
          </p>
        ) : (
          filteredRooms.map(room => <RoomCard key={room.id} room={room} />)
        )}
      </section>

      <Footer />
    </div>
  )
}
