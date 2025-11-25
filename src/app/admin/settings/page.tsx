'use client';

import { useState, useEffect } from 'react';
import { Save, Lock } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwdMessage, setPwdMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const res = await fetch('/api/data/settings');
        const data = await res.json();
        setSettings(data);
        setLoading(false);
    };

    const handleSaveSettings = async () => {
        await fetch('/api/data/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        alert('Settings saved successfully!');
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPwdMessage('New passwords do not match');
            return;
        }

        const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await res.json();
        if (res.ok) {
            setPwdMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPwdMessage(data.error || 'Failed to change password');
        }
    };

    const updateContact = (field: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };

    const updateHours = (day: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            hours: { ...prev.hours, [day]: value }
        }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Contact Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={settings.contact.phone}
                                    onChange={(e) => updateContact('phone', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                                <input
                                    type="text"
                                    value={settings.contact.whatsapp}
                                    onChange={(e) => updateContact('whatsapp', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={settings.contact.email}
                                    onChange={(e) => updateContact('email', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <textarea
                                    value={settings.contact.address}
                                    onChange={(e) => updateContact('address', e.target.value)}
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Instagram Handle</label>
                                <input
                                    type="text"
                                    value={settings.contact.instagram}
                                    onChange={(e) => updateContact('instagram', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Google Maps Link</label>
                                <input
                                    type="text"
                                    value={settings.contact.mapsLink}
                                    onChange={(e) => updateContact('mapsLink', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Opening Hours</h2>
                        <div className="space-y-2">
                            {Object.keys(settings.hours).map((day) => (
                                <div key={day} className="flex items-center gap-4">
                                    <span className="w-24 capitalize text-sm font-medium">{day}</span>
                                    <input
                                        type="text"
                                        value={settings.hours[day]}
                                        onChange={(e) => updateHours(day, e.target.value)}
                                        className="flex-1 border rounded p-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <button
                        onClick={handleSaveSettings}
                        className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition flex items-center justify-center gap-2 font-medium"
                    >
                        <Save className="w-5 h-5" /> Save All Settings
                    </button>
                </div>

                {/* Security Settings */}
                <div>
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <Lock className="w-5 h-5 text-gray-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>

                            {pwdMessage && (
                                <div className={`text-sm p-2 rounded ${pwdMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {pwdMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
                            >
                                Update Password
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
