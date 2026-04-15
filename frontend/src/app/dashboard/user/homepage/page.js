"use client";

import { useState, useEffect } from "react";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import HotelCard from "@/components/HotelCard";
import FeedbackCard from "@/components/FeedbackCard";

// Data
import { hotels as mockHotels } from "@/data/hotelData";
import { listings as importedListings } from "@/data/listings";
import { feedbacks as importedFeedbacks } from "@/data/feedbacks";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function HomePage() {
  const [roomListings, setRoomListings] = useState(importedListings);
  const [roomData, setRoomData] = useState([]);
  const [hotelData, setHotelData] = useState(mockHotels);
  const [feedbacks, setFeedbacks] = useState(importedFeedbacks || []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setRoomData(data.rooms || []);
      } catch {
        // silently fall back to empty
      }
    };
    fetchRooms();
  }, []);
  const [userComment, setUserComment] = useState("");

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!userComment) return;

    const newFeedback = {
      id: feedbacks.length + 1,
      name: "Anonymous",
      comment: userComment,
      avatar: "/users/default-avatar.jpg",
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setUserComment("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      <Header />

      {/* Hero Section */}
     <section className="pt-32 pb-20 text-center bg-gradient-to-r from-[#0B2B26] via-[#235347] to-[#DAF1DE]">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Find Your Perfect Roommate
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/90">
          Connect with like-minded people and find your ideal living partner.
        </p>
      </section>

      {/* Rooms for Rent */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
          Rooms for Rent
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {roomData.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
          Featured Hotels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {hotelData.slice(0, 3).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* User Feedbacks */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
          What Our Users Say
        </h2>

        <form
          onSubmit={handleAddFeedback}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <input
            type="text"
            placeholder="Leave your comment..."
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none flex-1"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            required
          />
          <button
            type="submit"
           className="px-6 py-2 bg-[#0B2B26] text-white rounded-lg hover:bg-[#0a2f30] transition"
          >
            Submit
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {feedbacks.map((fb) => (
            <FeedbackCard key={fb.id} fb={fb} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
