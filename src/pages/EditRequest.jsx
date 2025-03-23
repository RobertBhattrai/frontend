import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const EditRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        patientName: '',
        bloodGroup: '',
        hospitalName: '',
        location: '',
        contactNumber: '',
        urgency: 'normal',
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch request details by ID
    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blood-requests/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                setMessage("Error: Failed to fetch request details. Please try again later.");
                console.error("Fetch error:", error);
            }
        };

        fetchRequest();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:5000/api/blood-requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setMessage("Request updated successfully!");
            setTimeout(() => navigate('/my-requests'), 2000);
        } catch (error) {
            setMessage("Error: Failed to update request. Please try again later.");
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Blood Request</h1>
                {message && <p className="text-center text-red-500">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Patient Name</label>
                        <input
                            type="text"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        >
                            <option value="" disabled>Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Hospital Name</label>
                        <input
                            type="text"
                            name="hospitalName"
                            value={formData.hospitalName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                            maxLength={10}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Urgency</label>
                        <select
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        >
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Request'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditRequest;