import React from 'react';
import Header from '../components/Header';  // Importing the Header component
import Footer from '../components/Footer';  // Importing the Footer component

const Home = () => {
  return (
    <div className="bg-gray-50">
      

      <div className="container mx-auto p-6">
        {/* Main Content */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome to the Blood Donation Platform
        </h2>
        <p className="text-lg text-center text-gray-600 mb-6">
          Find or donate blood easily. Save lives today!
        </p>

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="/register"
            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Join as a Donor
          </a>
        </div>
      </div>

      {/* Footer Component */}
     
    </div>
  );
};

export default Home;
