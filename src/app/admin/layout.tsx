import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <AdminHeader />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
