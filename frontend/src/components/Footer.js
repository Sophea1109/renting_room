import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-600 dark:bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand / Logo */}
          <div className="flex flex-col items-start space-y-4">
            <span className="text-2xl font-bold">FindRoommate</span>
            <p className="text-gray-200 text-sm">
              Connecting people to find the perfect roommate and make renting easier.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
            <a href="#" className="hover:text-yellow-300 transition">Home</a>
            <a href="#" className="hover:text-yellow-300 transition">Listings</a>
            <a href="#" className="hover:text-yellow-300 transition">Room</a>
            <a href="#" className="hover:text-yellow-300 transition">Request Roommate</a>
          </div>

          {/* Contact / Social */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
            <p className="text-gray-200 text-sm">Email: support@findroommate.com</p>
            <p className="text-gray-200 text-sm">Phone: +1 (123) 456-7890</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="hover:text-yellow-300 transition">Facebook</a>
              <a href="#" className="hover:text-yellow-300 transition">Twitter</a>
              <a href="#" className="hover:text-yellow-300 transition">Instagram</a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-white/20 pt-4 text-center text-gray-200 text-sm">
          &copy; 2025 FindRoommate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
