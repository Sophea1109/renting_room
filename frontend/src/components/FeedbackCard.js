// /components/FeedbackCard.js
'use client'
import Image from "next/image";

export default function FeedbackCard({ fb }) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-xl transition">
      <div className="flex items-center space-x-4">
        <Image
          src={fb.avatar}
          width={60}
          height={60}
          className="rounded-full object-cover"
          alt={fb.name}
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{fb.name}</h3>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{fb.comment}</p>
    </div>
  );
}
