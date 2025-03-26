import React from 'react';

const DonorDetailsModal = ({ donation, onClose }) => {
  if (!donation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Donor Details</h3>
        
        <div className="space-y-3">
          <div>
            <span className="font-medium">Name:</span> {donation.donor?.name || 'Anonymous'}
          </div>
          <div>
            <span className="font-medium">Contact:</span> {donation.donor?.contact || 'Not provided'}
          </div>
          <div>
            <span className="font-medium">Donation Date:</span> {new Date(donation.donationDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Health Status:</span> {donation.healthStatus}
          </div>
          {donation.message && (
            <div>
              <span className="font-medium">Message:</span> {donation.message}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorDetailsModal;