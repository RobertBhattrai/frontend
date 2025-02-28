import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-center">

      <div className="max-w-lg p-6 bg-black bg-opacity-50 rounded-lg">
        <h1 className="text-4xl font-bold mb-6">
          Donate Blood, Save Lives, Connect Hope!
        </h1>
        <img src="..\assets\Untitled design.png" alt="" />
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
