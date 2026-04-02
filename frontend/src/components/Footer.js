import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0B2B26] text-[#DAF1DE] py-12 mt-16 border-t border-[#DAF1DE]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand / Logo */}
          <div className="flex flex-col items-start space-y-4">
            <span className="text-2xl font-bold text-[#DAF1DE]">FindRoommate</span>
            <p className="text-[#DAF1DE]/70 text-sm leading-relaxed">
              Connecting people to find the perfect roommate and make renting easier.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-lg mb-2 text-[#DAF1DE]">Quick Links</h3>
            <a href="#" className="hover:text-white transition-colors duration-200">Home</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Listings</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Room</a>
          </div>

          {/* Contact / Social */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-lg mb-2 text-[#DAF1DE]">Contact Us</h3>
            <p className="text-[#DAF1DE]/70 text-sm">Email: support@findroommate.com</p>
            <p className="text-[#DAF1DE]/70 text-sm">Phone: +1 (123) 456-7890</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="hover:text-white transition-colors duration-200">Facebook</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Twitter</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Instagram</a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-[#DAF1DE]/10 pt-4 text-center text-[#DAF1DE]/50 text-xs tracking-wider">
          &copy; 2026 FindRoommate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
