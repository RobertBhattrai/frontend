// pages/Home.js
import React, { useContext, useState, useEffect } from 'react'; // Import useState and useEffect
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './styles/style.css'; // Import your CSS file
import bgimg from '../assets/images/homebg.jpg';
import homesvg from '../assets/images/homeS1.svg';

const Home = () => {
  const { username } = useParams();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [bloodRequests, setBloodRequests] = useState([]); // State for blood requests

  // Fetch blood requests from the backend
  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blood-requests');
        const data = await response.json();
        setBloodRequests(data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching blood requests:', error);
      }
    };

    fetchBloodRequests(); // Call the function to fetch data
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogout = () => {
    setUser(null); // Clear the user state
    localStorage.removeItem('user'); // Remove user data from localStorage
    navigate('/login');
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center" style={{backgroundImage: `url(${bgimg})`, backgroundSize:'110%', backgroundPositionX:'-130px'}}>
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center">
          
          {/* Left Section - Image */}
          <div className="hidden md:block w-1/2">
            <img src={homesvg} alt="Home" className="w-full h-auto" />
          </div>

          {/* Right Section - User Details */}
          <div className="w-full md:w-1/2 text-center md:text-left px-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, <span className="text-blue-600">{username}</span> !
            </h1>
            <p className="text-gray-600 mt-3">
              Manage your profile and explore the platform. You are part of a life-saving community!
            </p>

            {/* User Details Table */}
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Details:</h2>
              <table className="min-w-full bg-white">
                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Name:</td>
                    <td className="py-2 px-4">{user?.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Email:</td>
                    <td className="py-2 px-4">{user?.email}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold">Blood Group:</td>
                    <td className="py-2 px-4">{user?.bloodGroup}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold">Donor Status:</td>
                    <td className="py-2 px-4">{user?.isDonor ? 'Yes' : 'No'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                onClick={() => navigate(`/${username}/profile`)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/request-blood')}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
              >
                Request Blood
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mt-6 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>

        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="h-auto px-4 md:px-6 lg:px-20 py-3 relative" style={{backgroundColor:'#3cd1ae', background: 'linear-gradient(90deg, rgba(52,199,164,1) 0%, rgba(96,228,197,1) 25%, rgba(116,245,189,1) 65%, rgba(58,199,166,1) 100%)'}}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Blood Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bloodRequests.length > 0 ? (
            bloodRequests.map((request) => (
              <div key={request._id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900">{request.patientName}</h3>
                <p className="text-gray-700"><strong>Blood Group:</strong> {request.bloodGroup}</p>
                <p className="text-gray-700"><strong>Hospital:</strong> {request.hospitalName}</p>
                <p className="text-gray-700"><strong>Location:</strong> {request.location}</p>
                <p className="text-gray-700"><strong>Contact:</strong> {request.contactNumber}</p>
                <p className="text-gray-700"><strong>Urgency:</strong> <span className={`font-semibold ${request.urgency === 'critical' ? 'text-red-600' : request.urgency === 'urgent' ? 'text-yellow-600' : 'text-green-600'}`}>{request.urgency}</span></p>
                <p className="text-gray-700"><strong>Requested By:</strong> {request.requestedBy}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No blood requests found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;