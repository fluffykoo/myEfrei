import Navbar from '@/app/ui/Components/Navbar';
import ProtectedRoute from '../ui/Components/ProtectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow md:flex-row md:overflow-hidden">
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                    {children}
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}