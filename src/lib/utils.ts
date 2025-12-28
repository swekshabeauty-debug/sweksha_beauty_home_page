import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(amount));
}

export function getImageUrl(path: string | undefined | null) {
    if (!path) return '/images/hero-placeholder.jpg';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/uploads/${path}`;
}
