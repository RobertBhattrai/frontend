import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const RequestBlood = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    
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

    // Auto-fill contact number if available in user context
    useEffect(() => {
        if (user?.contactNumber) {
            setFormData((prev) => ({ ...prev, contactNumber: user.contactNumber }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Restrict contact number to 10 digits
        if (name === "contactNumber" && !/^\d{0,10}$/.test(value)) {
            return;
        }
        
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);
    
        // Validate contact number
        if (formData.contactNumber.length !== 10) {
            setMessage("Contact number must be 10 digits.");
            setIsSubmitting(false);
            return;
        }
    
        const newRequest = { 
            ...formData, 
            requestedBy: user?.username // Changed from user.name to user.username
        };
    
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/blood-requests', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newRequest),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage("Blood request submitted successfully!");
                setTimeout(() => navigate(`/${user?.username}/home`), 2000); // Changed to username
            } else {
                setMessage(data.message || "Failed to submit request. Try again.");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (

        <section className="min-h-screen flex items-center justify-center py-5" style={{backgroundColor:'#3cd1ae', background: 'linear-gradient(90deg, rgba(52,199,164,1) 0%, rgba(96,228,197,1) 25%, rgba(116,245,189,1) 65%, rgba(58,199,166,1) 100%)'}}>
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Blood</h1>
                {message && (
                    <p className={`text-center ${
                        message.startsWith("Blood request submitted") ? "text-green-500" : "text-red-500"
                    }`}>
                        {message}
                    </p>
                )}
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
                        disabled={isSubmitting || !formData.patientName || !formData.contactNumber || formData.contactNumber.length !== 10}
                        className={`w-full px-4 py-2 rounded-lg transition ${
                            isSubmitting || !formData.patientName || !formData.contactNumber || formData.contactNumber.length !== 10
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                        }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default RequestBlood;