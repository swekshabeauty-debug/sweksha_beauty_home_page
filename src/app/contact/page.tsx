import { getSettings } from '@/lib/db';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Sweksha Beauty. Call us, visit our parlour in Haveli Kharagpur, or book an appointment online.',
};

export default async function ContactPage() {
    const settings = await getSettings();

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-brand-bg py-16 text-center">
                <h1 className="text-4xl font-bold font-serif text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600 max-w-2xl mx-auto px-4">
                    We'd love to hear from you. Visit us, call us, or drop a message.
                </p>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-bg p-3 rounded-full text-brand-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                                        <p className="text-gray-600">{settings.contact.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-bg p-3 rounded-full text-brand-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                                        <a href={`tel:${settings.contact.phone}`} className="text-gray-600 hover:text-brand-primary">
                                            {settings.contact.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-bg p-3 rounded-full text-brand-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                                        <a href={`mailto:${settings.contact.email}`} className="text-gray-600 hover:text-brand-primary">
                                            {settings.contact.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-brand-primary" /> Opening Hours
                            </h2>
                            <div className="space-y-3">
                                {Object.entries(settings.hours).map(([day, hours]: [string, any]) => (
                                    <div key={day} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                                        <span className="capitalize font-medium text-gray-700">{day}</span>
                                        <span className="text-gray-500">{hours}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
                                <p>Prior appointment recommended. Walk-ins are also welcome.</p>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="h-full min-h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.3578979354434!2d86.54873187407807!3d25.123588234680717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f19754a0267cbb%3A0xc91aafab24d0bff9!2sSweksha%20New%20Ladies%20Beauty%20Parlour!5e0!3m2!1sen!2sin!4v1764046532072!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
