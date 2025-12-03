import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const AdminBookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        fetchBooks();
    }, []);
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://backend-5hl0.onrender.com/books");
            setBooks(res.data);
        } catch (err) {
            console.error('Error fetching books:', err);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
      
        try {
          await axios.delete(`https://backend-5hl0.onrender.com/books/${id}`);
          setBooks(prev => prev.filter(b => (b.book_id || b.id) !== id));
        } catch (err) {
          console.error("Delete failed:", err);
        }
      };
      

    // Filter books based on search query
    const filteredBooks = books.filter(book => {
        const query = searchQuery.toLowerCase();
        const title = (book.title || '').toLowerCase();
        const author = (book.authors || '').toLowerCase();
        return title.includes(query) || author.includes(query);
    });

    const displayedBooks = filteredBooks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading books...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Books Management</h1>
                <Link
                    to="/admin/books/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
                >
                    <HiPlus /> <span className="md:block hidden">Add Book</span>
                </Link>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1); // Reset to first page when searching
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {displayedBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No books found.</td>
                                </tr>
                            ) : (
                                displayedBooks.map((book) => (
                                    <tr key={book.book_id || book.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded object-cover" src={book.image_url || book.small_image_url || "https://via.placeholder.com/40"} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={book.title}>
                                                        {book.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{book.authors}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/admin/books/edit/${book.book_id || book.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block p-2 hover:bg-indigo-50 rounded-full transition"
                                                title="Edit"
                                            >
                                                <HiPencil className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(book.book_id || book.id)}
                                                className="text-red-600 hover:text-red-900 inline-block p-2 hover:bg-red-50 rounded-full transition"
                                                title="Delete"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Previous
                </button>
                <span className="text-gray-600 text-sm">Page {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminBookList;
