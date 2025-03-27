import React, { useState, useEffect } from 'react';
import DonorDetailsModal from './DonorDetailsModal';
import axios from 'axios';

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donations when component mounts
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Replace with your actual API endpoint and request IDs
        const response = await axios.get('/api/donations?requestIds=YOUR_REQUEST_IDS');
        setDonations(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleShowDonorDetails = (donation) => {
    setSelectedDonation(donation);
  };

  const handleCloseModal = () => {
    setSelectedDonation(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Donations</h2>
      
      <div className="space-y-4">
        {donations.map((donation) => (
          <div 
            key={donation._id} 
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => handleShowDonorDetails(donation)}
          >
            <div className="font-medium">
              Donation for request: {donation.request}
            </div>
            <div className="text-sm text-gray-600">
              Click to view donor details
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedDonation && (
        <DonorDetailsModal 
          donation={selectedDonation} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default DonationsList;