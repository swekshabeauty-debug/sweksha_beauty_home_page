'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const isFinePointer = window.matchMedia('(pointer: fine)').matches;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        requestAnimationFrame(() => setEnabled(isFinePointer && !reducedMotion));
    }, []);

    if (!enabled) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.1, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
