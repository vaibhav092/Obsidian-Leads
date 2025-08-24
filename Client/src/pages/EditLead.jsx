import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leadApi } from '../util/api';

function EditLead() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        status: 'new',
        source: 'other',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await leadApi.getById(id);
                console.log('Lead response:', response);


                let leadData = {};
                if (response && response.success && response.lead) {
                    leadData = response.lead;
                } else if (response && response.lead) {
                    leadData = response.lead;
                } else if (response) {
                    leadData = response;
                }

                setFormData(leadData);
                setError('');
            } catch (err) {
                console.error('Failed to fetch lead:', err);
                setError('Failed to fetch lead details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchLead();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await leadApi.update(id, formData);
            navigate('/leads');
        } catch (err) {
            console.error('Failed to update lead:', err);
            setError('Failed to update lead. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading lead...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-2xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Edit Lead</h1>
                        <p className="text-neutral-400">Update lead information</p>
                    </div>
                    <Link
                        to="/leads"
                        className="bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg transition-colors text-white font-medium"
                    >
                        Back to Leads
                    </Link>
                </div>


                {error && (
                    <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-6">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}


                <div className="bg-neutral-800 rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium mb-2"
                                >
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                                    placeholder="Enter first name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>


                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                                placeholder="Enter email address"
                            />
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium mb-2">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                                    placeholder="Enter company name"
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium mb-2">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="lost">Lost</option>
                                    <option value="won">Won</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="source" className="block text-sm font-medium mb-2">
                                    Source *
                                </label>
                                <select
                                    id="source"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                                >
                                    <option value="website">Website</option>
                                    <option value="facebook_ads">Facebook Ads</option>
                                    <option value="google_ads">Google Ads</option>
                                    <option value="referral">Referral</option>
                                    <option value="events">Events</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>


                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium mb-2">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white resize-vertical"
                                placeholder="Enter any additional notes about this lead..."
                            />
                        </div>


                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-700">
                            <Link
                                to="/leads"
                                className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-white font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg transition-colors text-white font-medium"
                            >
                                {saving ? 'Updating...' : 'Update Lead'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditLead;
