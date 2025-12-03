import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:block fixed h-full">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                </div>
                <nav className="mt-6">
                    <Link
                        to="/admin/books"
                        className="block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors border-l-4 border-transparent hover:border-blue-500"
                    >
                        Manage Books
                    </Link>
                    <Link
                        to="/"
                        className="block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors border-l-4 border-transparent hover:border-blue-500"
                    >
                        Back to Home
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
