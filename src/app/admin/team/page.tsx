'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export default function TeamPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState<any | null>(null);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        const res = await fetch('/api/data/team');
        const data = await res.json();
        setTeam(data);
        setLoading(false);
    };

    const handleSave = async (member: any) => {
        let updatedTeam;
        if (isNew) {
            updatedTeam = [...team, { ...member, id: Date.now().toString() }];
        } else {
            updatedTeam = team.map(m => m.id === member.id ? member : m);
        }

        await fetch('/api/data/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTeam),
        });

        setTeam(updatedTeam);
        setEditingMember(null);
        setIsNew(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this team member?')) return;
        const updatedTeam = team.filter(m => m.id !== id);
        await fetch('/api/data/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTeam),
        });
        setTeam(updatedTeam);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Team</h1>
                <button
                    onClick={() => {
                        setEditingMember({ name: '', role: '', bio: '', image: '', active: true });
                        setIsNew(true);
                    }}
                    className="bg-pink-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-pink-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                    <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100">
                            {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-pink-600 text-sm mb-2">{member.role}</p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{member.bio}</p>

                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => { setEditingMember(member); setIsNew(false); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{isNew ? 'Add Member' : 'Edit Member'}</h2>
                            <button onClick={() => setEditingMember(null)}><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSave(editingMember); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editingMember.name}
                                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <input
                                    type="text"
                                    value={editingMember.role}
                                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                                    className="w-full border rounded p-2"
                                    placeholder="e.g. Senior Beautician"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Bio</label>
                                <textarea
                                    value={editingMember.bio}
                                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Profile Photo</label>
                                <ImageUploader
                                    value={editingMember.image}
                                    onChange={(url) => setEditingMember({ ...editingMember, image: url })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editingMember.active}
                                    onChange={(e) => setEditingMember({ ...editingMember, active: e.target.checked })}
                                    id="active"
                                />
                                <label htmlFor="active" className="text-sm">Active</label>
                            </div>

                            <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
                                Save Member
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
