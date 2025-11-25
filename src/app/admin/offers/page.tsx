'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingOffer, setEditingOffer] = useState<any | null>(null);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        const res = await fetch('/api/data/offers');
        const data = await res.json();
        setOffers(data);
        setLoading(false);
    };

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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Offers</h1>
                <button
                    onClick={() => {
                        setEditingOffer({ title: '', details: '', validity: '', type: 'banner', active: true });
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
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Valid till: {offer.validity || 'N/A'}</span>
                            <span className={`px-2 py-1 rounded text-xs ${offer.type === 'popup' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {offer.type.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {editingOffer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{isNew ? 'Add Offer' : 'Edit Offer'}</h2>
                            <button onClick={() => setEditingOffer(null)}><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSave(editingOffer); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Offer Title</label>
                                <input
                                    type="text"
                                    value={editingOffer.title}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Details</label>
                                <textarea
                                    value={editingOffer.details}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, details: e.target.value })}
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
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
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    value={editingOffer.type}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, type: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="banner">Banner (Home Page)</option>
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
                                <label htmlFor="active" className="text-sm">Active</label>
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
