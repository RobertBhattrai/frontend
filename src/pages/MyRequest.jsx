import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const MyRequest = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch blood requests made by the logged-in user
    useEffect(() => {
        if (!user?.username) return; // Ensure user is loaded before fetching

        const fetchRequests = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blood-requests?requestedBy=${user.username}`);
                const data = await response.json();
                if (response.ok) {
                    setRequests(data);
                } else {
                    setMessage(data.message || "Failed to fetch requests.");
                }
            } catch (error) {
                setMessage("Error: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [user?.username]);

    // Handle delete request
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this request?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/blood-requests/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestedBy: user?.username }), // Ensure user is authorized
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Request deleted successfully!");
                setRequests((prev) => prev.filter((request) => request._id !== id));
            } else {
                setMessage(data.message || "Failed to delete request.");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    // Handle edit request
    const handleEdit = (id) => {
        navigate(`/${user.username}/edit-request/${id}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-center">Loading...</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Blood Requests</h1>
                {message && (
                    <p className={`text-center ${
                        message.startsWith("Request deleted") ? "text-green-500" : "text-red-500"
                    }`}>
                        {message}
                    </p>
                )}
                {requests.length === 0 ? (
                    <p className="text-center text-gray-700">No blood requests found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 text-left">Patient Name</th>
                                    <th className="py-2 px-4 text-left">Blood Group</th>
                                    <th className="py-2 px-4 text-left">Hospital</th>
                                    <th className="py-2 px-4 text-left">Location</th>
                                    <th className="py-2 px-4 text-left">Contact</th>
                                    <th className="py-2 px-4 text-left">Urgency</th>
                                    <th className="py-2 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request._id} className="border-b">
                                        <td className="py-2 px-4">{request.patientName}</td>
                                        <td className="py-2 px-4">{request.bloodGroup}</td>
                                        <td className="py-2 px-4">{request.hospitalName}</td>
                                        <td className="py-2 px-4">{request.location}</td>
                                        <td className="py-2 px-4">{request.contactNumber}</td>
                                        <td className="py-2 px-4">
                                            <span className={`font-semibold ${
                                                request.urgency === 'critical' ? 'text-red-600' :
                                                request.urgency === 'urgent' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                                {request.urgency}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => handleEdit(request._id)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(request._id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyRequest;