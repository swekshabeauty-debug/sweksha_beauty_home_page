'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export default function ServicesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<any | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const res = await fetch('/api/data/services');
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !activeCategory) {
            setActiveCategory(data[0].id);
        }
        setLoading(false);
    };

    const handleSave = async (service: any) => {
        const updatedCategories = categories.map(cat => {
            if (cat.id === activeCategory) {
                if (isNew) {
                    return { ...cat, services: [...cat.services, { ...service, id: Date.now().toString() }] };
                } else {
                    return { ...cat, services: cat.services.map((s: any) => s.id === service.id ? service : s) };
                }
            }
            return cat;
        });

        await fetch('/api/data/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCategories),
        });

        setCategories(updatedCategories);
        setEditingService(null);
        setIsNew(false);
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        const updatedCategories = categories.map(cat => {
            if (cat.id === activeCategory) {
                return { ...cat, services: cat.services.filter((s: any) => s.id !== serviceId) };
            }
            return cat;
        });

        await fetch('/api/data/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCategories),
        });

        setCategories(updatedCategories);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
                <button
                    onClick={() => {
                        setEditingService({ name: '', price: '', duration: '', description: '', active: true, featured: false });
                        setIsNew(true);
                    }}
                    className="bg-brand-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition"
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200">
                {categories.map((cat, index) => (
                    <button
                        key={cat.id || `category-${index}`}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${activeCategory === cat.id
                            ? 'bg-brand-bg text-brand-primary'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Service List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.find(c => c.id === activeCategory)?.services.map((service: any, idx: number) => (
                    <div key={service.id || `service-${idx}`} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">
                                {service.name}
                                {service.featured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Featured</span>}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingService(service); setIsNew(false); }} className="text-blue-500 hover:text-blue-700">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-brand-primary">₹{service.price}</span>
                            <span className="text-gray-400">{service.duration}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold">{isNew ? 'Add Service' : 'Edit Service'}</h2>
                            <button onClick={() => setEditingService(null)}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="mb-4">
                            <span className="inline-block bg-brand-bg text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">
                                {categories.find(c => c.id === activeCategory)?.name || 'Category'}
                            </span>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSave(editingService); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Name</label>
                                <input
                                    type="text"
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editingService.price}
                                        onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={editingService.duration}
                                        onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                                        className="w-full border rounded p-2"
                                        placeholder="e.g. 30 min"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={editingService.description}
                                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Image (Optional)</label>
                                <ImageUploader
                                    value={editingService.image}
                                    onChange={(url) => setEditingService({ ...editingService, image: url })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editingService.active}
                                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                                    id="active"
                                />
                                <label htmlFor="active" className="text-sm">Active (Show on website)</label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editingService.featured || false}
                                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                                    id="featured"
                                />
                                <label htmlFor="featured" className="text-sm">Featured (Show on Home Page)</label>
                            </div>

                            <button type="submit" className="w-full bg-brand-primary text-white py-2 rounded hover:opacity-90">
                                Save Service
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
