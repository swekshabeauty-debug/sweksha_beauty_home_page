'use client';

import React from 'react';

export default function MapSection() {
    return (
        <section className="w-full">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.3578979354434!2d86.54873187407807!3d25.123588234680717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f19754a0267cbb%3A0xc91aafab24d0bff9!2sSweksha%20New%20Ladies%20Beauty%20Parlour!5e0!3m2!1sen!2sin!4v1764046532072!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full grayscale hover:grayscale-0 transition duration-500"
            ></iframe>
        </section>
    );
}
