'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export default function PackagesPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPkg, setEditingPkg] = useState<any | null>(null);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        const res = await fetch('/api/data/packages');
        const data = await res.json();
        setPackages(data);
        setLoading(false);
    };

    const handleSave = async (pkg: any) => {
        let updatedPackages;
        if (isNew) {
            updatedPackages = [...packages, { ...pkg, id: Date.now().toString() }];
        } else {
            updatedPackages = packages.map(p => p.id === pkg.id ? pkg : p);
        }

        await fetch('/api/data/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPackages),
        });

        setPackages(updatedPackages);
        setEditingPkg(null);
        setIsNew(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this package?')) return;
        const updatedPackages = packages.filter(p => p.id !== id);
        await fetch('/api/data/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPackages),
        });
        setPackages(updatedPackages);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Packages</h1>
                <button
                    onClick={() => {
                        setEditingPkg({ name: '', price: '', duration: '', description: '', services: [], tag: '', active: true });
                        setIsNew(true);
                    }}
                    className="bg-pink-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-pink-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingPkg(pkg); setIsNew(false); }} className="text-blue-500 hover:text-blue-700">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(pkg.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{pkg.description}</p>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="font-bold text-pink-600">₹{pkg.price}</span>
                            <span className="text-gray-400">{pkg.duration}</span>
                        </div>
                        {pkg.tag && (
                            <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                                {pkg.tag}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {editingPkg && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{isNew ? 'Add Package' : 'Edit Package'}</h2>
                            <button onClick={() => setEditingPkg(null)}><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSave(editingPkg); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Package Name</label>
                                <input
                                    type="text"
                                    value={editingPkg.name}
                                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editingPkg.price}
                                        onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={editingPkg.duration}
                                        onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={editingPkg.description}
                                    onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Included Services (comma separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(editingPkg.services) ? editingPkg.services.join(', ') : editingPkg.services}
                                    onChange={(e) => setEditingPkg({ ...editingPkg, services: e.target.value.split(',').map((s: string) => s.trim()) })}
                                    className="w-full border rounded p-2"
                                    placeholder="Waxing, Facial, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tag (e.g. Bridal, Popular)</label>
                                <input
                                    type="text"
                                    value={editingPkg.tag || ''}
                                    onChange={(e) => setEditingPkg({ ...editingPkg, tag: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Image</label>
                                <ImageUploader
                                    value={editingPkg.image}
                                    onChange={(url) => setEditingPkg({ ...editingPkg, image: url })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editingPkg.active}
                                    onChange={(e) => setEditingPkg({ ...editingPkg, active: e.target.checked })}
                                    id="active"
                                />
                                <label htmlFor="active" className="text-sm">Active</label>
                            </div>

                            <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
                                Save Package
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
