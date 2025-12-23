"use client";

import { useState, useEffect } from "react";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import FeedbackCard from "@/components/FeedbackCard";

// Data
import { rooms } from "@/data/roomData";
import { listings as importedListings } from "@/data/listings";
import { feedbacks as importedFeedbacks } from "@/data/feedbacks";

export default function HomePage() {
  // State for rooms, listings, and feedbacks
  const [roomListings, setRoomListings] = useState(importedListings);
  const [roomData, setRoomData] = useState(rooms);
  const [feedbacks, setFeedbacks] = useState(importedFeedbacks || []);
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
      <section className="pt-32 pb-20 text-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
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
            className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
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
