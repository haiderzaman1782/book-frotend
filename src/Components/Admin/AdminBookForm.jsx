import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Toast from './Toast';

const AdminBookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        original_title: '',
        authors: '',
        average_rating: '',
        original_publication_year: '',
        image_url: '',
        small_image_url: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchBook();
        }
    }, [id]);

    const fetchBook = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://backend-5hl0.onrender.com/books");
            const book = res.data.find(b => (b.book_id || b.id) == id);

            if (book) {
                setFormData({
                    title: book.title || '',
                    original_title: book.original_title || '',
                    authors: book.authors || '',
                    average_rating: book.average_rating || '',
                    original_publication_year: book.original_publication_year || '',
                    image_url: book.image_url || '',
                    small_image_url: book.small_image_url || '',
                });
            } else {
                setError('Book not found');
            }
        } catch (err) {
            setError('Failed to fetch book details: ' + err.message);
            console.error(err);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Generate a unique 7-digit book_id
    const generateBookId = () => {
        return Math.floor(10000000 + Math.random() * 9000000);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError(null);

    //     try {
    //         if (isEditMode) {
    //             const { error } = await supabase
    //                 .from('books')
    //                 .update(formData)
    //                 .eq('book_id', id);
    //             if (error) throw error;
    //             setToast({ message: 'Book updated successfully!', type: 'success' });
    //         } else {
    //             // Generate a unique 7-digit book_id for new books
    //             const newBookData = {
    //                 ...formData,
    //                 book_id: generateBookId()
    //             };

    //             const { error } = await supabase
    //                 .from('books')
    //                 .insert([newBookData]);
    //             if (error) throw error;
    //             setToast({ message: 'Book added successfully!', type: 'success' });
    //         }

    //         setTimeout(() => {
    //             navigate('/admin/books');
    //         }, 1500);
    //     } catch (err) {
    //         setError(err.message);
    //         setToast({ message: 'Error: ' + err.message, type: 'error' });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            let newBookData = { ...formData };
    
            if (!isEditMode) {
                newBookData.book_id = generateBookId();
            }
    
            // 1️⃣ Save into Supabase (your main DB)
            if (isEditMode) {
                const { error } = await supabase
                    .from('books')
                    .update(formData)
                    .eq('book_id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('books')
                    .insert([newBookData]);
                if (error) throw error;
            }
    
            // 2️⃣ Send to FastAPI so CSV is updated
            await axios.post("https://backend-5hl0.onrender.com/books", {
                book_id: newBookData.book_id,
                title: newBookData.title,
                original_title: newBookData.original_title,
                author: newBookData.authors,
                original_publication_year: newBookData.original_publication_year,
                average_rating: newBookData.average_rating,
                image_url: newBookData.image_url,
            });
    
            setToast({
                message: isEditMode
                    ? 'Book updated successfully!'
                    : 'Book added successfully!',
                type: 'success'
            });
    
            setTimeout(() => navigate('/admin/books'), 1500);
        } catch (err) {
            setError(err.message);
            setToast({ message: 'Error: ' + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };
    
    if (loading && isEditMode && !formData.title) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit Book' : 'Add New Book'}</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="original_title">
                            Original Title
                        </label>
                        <input
                            type="text"
                            id="original_title"
                            name="original_title"
                            value={formData.original_title}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="original_publication_year">
                            Original Publication Year
                        </label>
                        <input
                            type="number"
                            id="original_publication_year"
                            name="original_publication_year"
                            value={formData.original_publication_year}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authors">
                            Authors
                        </label>
                        <input
                            type="text"
                            id="authors"
                            name="authors"
                            value={formData.authors}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="average_rating">
                            Average Rating
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="average_rating"
                            name="average_rating"
                            value={formData.average_rating}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image_url">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/books')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4 focus:outline-none focus:shadow-outline transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition"
                        >
                            {loading ? 'Saving...' : 'Save Book'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminBookForm;
