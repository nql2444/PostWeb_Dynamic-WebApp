import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-center p-8">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">Welcome to PostWeb</h1>
      <p className="text-lg text-gray-600 mb-8">
        A dynamic web app built with Next.js and Tailwind CSS. Sign up or log in to get started!
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
