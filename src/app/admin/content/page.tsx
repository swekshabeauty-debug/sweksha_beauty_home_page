'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export default function ContentPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        const res = await fetch('/api/data/content');
        const data = await res.json();
        setContent(data);
        setLoading(false);
    };

    const handleSave = async () => {
        await fetch('/api/data/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        });
        alert('Content updated successfully!');
    };

    const updateField = (section: string, field: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateArrayField = (section: string, field: string, index: number, value: string) => {
        const newArray = [...content[section][field]];
        newArray[index] = value;
        updateField(section, field, newArray);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Page Content</h1>
                <button onClick={handleSave} className="bg-brand-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>

            <div className="space-y-8">
                {/* Home Page Section */}
                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Home Page</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Title</label>
                            <input
                                type="text"
                                value={content.home.heroTitle}
                                onChange={(e) => updateField('home', 'heroTitle', e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                            <textarea
                                value={content.home.heroSubtitle}
                                onChange={(e) => updateField('home', 'heroSubtitle', e.target.value)}
                                className="w-full border rounded p-2"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Background Image</label>
                            <ImageUploader
                                value={content.home.heroImage}
                                onChange={(url) => updateField('home', 'heroImage', url)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Highlights (3 Points)</label>
                            {content.home.highlights.map((point: string, i: number) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={point}
                                    onChange={(e) => updateArrayField('home', 'highlights', i, e.target.value)}
                                    className="w-full border rounded p-2 mb-2"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Page Section */}
                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">About Page</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={content.about.title}
                                onChange={(e) => updateField('about', 'title', e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={content.about.description}
                                onChange={(e) => updateField('about', 'description', e.target.value)}
                                className="w-full border rounded p-2"
                                rows={5}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Our Values</label>
                            {content.about.values.map((val: string, i: number) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={val}
                                    onChange={(e) => updateArrayField('about', 'values', i, e.target.value)}
                                    className="w-full border rounded p-2 mb-2"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
