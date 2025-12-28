'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Percent, Tag } from 'lucide-react';

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingOffer, setEditingOffer] = useState<any | null>(null);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/data/offers').then(r => r.json()),
            fetch('/api/data/services').then(r => r.json())
        ]).then(([offersData, servicesData]) => {
            setOffers(offersData);
            setServices(servicesData);
            setLoading(false);
        });
    }, []);

    const handleSave = async (offer: any) => {
        let updatedOffers;
        if (isNew) {
            updatedOffers = [...offers, { ...offer, id: Date.now().toString() }];
        } else {
            updatedOffers = offers.map(o => o.id === offer.id ? offer : o);
        }

        await fetch('/api/data/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedOffers),
        });

        setOffers(updatedOffers);
        setEditingOffer(null);
        setIsNew(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this offer?')) return;
        const updatedOffers = offers.filter(o => o.id !== id);
        await fetch('/api/data/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedOffers),
        });
        setOffers(updatedOffers);
    };

    // Get services for selected category
    const getServicesForCategory = (categoryName: string) => {
        const category = services.find(c => c.name === categoryName);
        return category?.services || [];
    };

    // Find service price
    const getServicePrice = (categoryName: string, serviceName: string) => {
        const categoryServices = getServicesForCategory(categoryName);
        const service = categoryServices.find((s: any) => s.name === serviceName);
        return service?.price || 0;
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Offers</h1>
                <button
                    onClick={() => {
                        setEditingOffer({
                            title: '',
                            details: '',
                            validity: '',
                            type: 'banner',
                            active: true,
                            serviceCategory: '',
                            serviceName: '',
                            discountPercent: 20
                        });
                        setIsNew(true);
                    }}
                    className="bg-pink-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-pink-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Offer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                    <div key={offer.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">{offer.title}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingOffer(offer); setIsNew(false); }} className="text-blue-500 hover:text-blue-700">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(offer.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{offer.details}</p>

                        {/* Service & Discount Info */}
                        {offer.serviceName && (
                            <div className="flex items-center gap-2 mb-2 text-sm">
                                <Tag className="w-4 h-4 text-pink-500" />
                                <span className="text-gray-600">{offer.serviceName}</span>
                                {offer.discountPercent && (
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                                        {offer.discountPercent}% OFF
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Valid till: {offer.validity || 'N/A'}</span>
                            <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs ${offer.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {offer.active ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${offer.type === 'popup' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {offer.type?.toUpperCase() || 'BANNER'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingOffer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{isNew ? 'Add Offer' : 'Edit Offer'}</h2>
                            <button onClick={() => setEditingOffer(null)}><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSave(editingOffer); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Offer Title *</label>
                                <input
                                    type="text"
                                    value={editingOffer.title}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="e.g. WINTER SPECIAL 20% OFF"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Details</label>
                                <textarea
                                    value={editingOffer.details}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, details: e.target.value })}
                                    className="w-full border rounded p-2"
                                    rows={2}
                                    placeholder="Short description of the offer"
                                />
                            </div>

                            {/* Service Selection */}
                            <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                                <h3 className="font-medium text-pink-800 mb-3 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Link to Service (Optional)
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select
                                            value={editingOffer.serviceCategory || ''}
                                            onChange={(e) => setEditingOffer({
                                                ...editingOffer,
                                                serviceCategory: e.target.value,
                                                serviceName: '' // Reset service when category changes
                                            })}
                                            className="w-full border rounded p-2 text-sm"
                                        >
                                            <option value="">Select Category</option>
                                            {services.map((cat: any) => (
                                                <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Service</label>
                                        <select
                                            value={editingOffer.serviceName || ''}
                                            onChange={(e) => setEditingOffer({
                                                ...editingOffer,
                                                serviceName: e.target.value
                                            })}
                                            className="w-full border rounded p-2 text-sm"
                                            disabled={!editingOffer.serviceCategory}
                                        >
                                            <option value="">Select Service</option>
                                            {getServicesForCategory(editingOffer.serviceCategory).map((s: any) => (
                                                <option key={s.id || s.name} value={s.name}>
                                                    {s.name} (₹{s.price})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Discount */}
                                <div className="mt-3">
                                    <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                        <Percent className="w-3 h-3" /> Discount Percentage
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={editingOffer.discountPercent || 20}
                                            onChange={(e) => setEditingOffer({
                                                ...editingOffer,
                                                discountPercent: parseInt(e.target.value) || 0
                                            })}
                                            className="w-24 border rounded p-2"
                                        />
                                        <span className="text-gray-500">%</span>

                                        {editingOffer.serviceName && (
                                            <span className="text-sm text-green-600 ml-auto">
                                                ₹{getServicePrice(editingOffer.serviceCategory, editingOffer.serviceName)} →
                                                <strong> ₹{Math.round(getServicePrice(editingOffer.serviceCategory, editingOffer.serviceName) * (1 - (editingOffer.discountPercent || 0) / 100))}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Validity</label>
                                <input
                                    type="text"
                                    value={editingOffer.validity}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, validity: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="e.g. 31st Dec 2025"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Display Type</label>
                                <select
                                    value={editingOffer.type}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, type: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="banner">Banner (Top of Home Page)</option>
                                    <option value="popup">Popup (First Visit)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editingOffer.active}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, active: e.target.checked })}
                                    id="active"
                                />
                                <label htmlFor="active" className="text-sm">Active (Show on website)</label>
                            </div>

                            <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
                                Save Offer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
