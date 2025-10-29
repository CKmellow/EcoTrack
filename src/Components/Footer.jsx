import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-black text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <img src="/logo.png" alt="EcoTrack Logo" className="w-10 h-10" />
          <span className="font-semibold text-lg">EcoTrack</span>
        </div>
        <div className="text-sm text-gray-400">© {new Date().getFullYear()} EcoTrack. All rights reserved.</div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="/" className="hover:text-green-400">Privacy Policy</a>
          <a href="/" className="hover:text-green-400">Terms of Service</a>
          <a href="/" className="hover:text-green-400">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
