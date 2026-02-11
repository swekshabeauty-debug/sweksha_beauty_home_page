import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Sweksha Beauty',
        short_name: 'Sweksha Beauty',
        description: 'Best Beauty Parlour in Haveli Kharagpur',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff5f5',
        theme_color: '#d4af37',
        icons: [
            {
                src: '/images/logo.jpg',
                sizes: 'any',
                type: 'image/jpeg',
            },
        ],
    };
}
