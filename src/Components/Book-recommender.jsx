import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

function Card({ book }) {
  const navigate = useNavigate();

  const go = () => {
    const id = book.book_id ?? book.id;
    navigate(`/book/${id}`, { state: { book } });
  }

  return (
    <div
      onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
      role="button"
      tabIndex={0}
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:h-80  w-44 md:w-full cursor-pointer"
    >
      <img
        src={book.image_url || book.small_image_url || "https://via.placeholder.com/150"}
        alt={book.title}
        className="w-full h-48 object-cover"
      />

      <div className="px-3 sm:px-4 py-3 flex-1 flex flex-col justify-center">
        <h3 className="text-sm sm:text-lg font-semibold mb-1 truncate" title={book.original_title || book.title}>{book.original_title || book.title}</h3>
        <p className="text-gray-600 mb-2 text-xs sm:text-sm overflow-hidden" title={book.authors}>{book.authors}</p>
        <p className="text-yellow-500 font-bold text-xs sm:text-base">⭐ {book.average_rating}</p>
      </div>
    </div>
  )
}

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 55;
  const { searchQuery } = useSearch();
  const [filteredBooks, setFilteredBooks] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("https://backend-5hl0.onrender.com/books");
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const displayedBooks = filteredBooks || books;

  // Debounced client-side filtering: filter as the user types
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    const timer = setTimeout(() => {
      if (!q) {
        setFilteredBooks(null);
        setCurrentPage(1);
        return;
      }
      const results = books.filter((b) => {
        const title = (b.original_title || b.title || "").toString().toLowerCase();
        const authors = (b.authors || "").toString().toLowerCase();
        return title.includes(q) || authors.includes(q);
      });
      setFilteredBooks(results);
      setCurrentPage(1);
    }, 250); // 250ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, books]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar moved to Navbar */}
      <ul className="my-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 p-2 sm:p-4 justify-items-center">
          {books.length === 0 && (
            <>
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse flex flex-col h-80 w-full"
                >
                  <div className="w-full h-40 sm:h-48 bg-gray-200"></div>
                  <div className="p-3 sm:p-4 flex-1">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 w-1/2" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mt-auto" />
                  </div>
                </div>
              ))}
            </>
          )}

          {books.length > 0 && displayedBooks.length === 0 && (
            <div className="w-full text-center text-gray-600 mb-4 col-span-full py-8">No results found for "<span className="font-semibold">{searchQuery}</span>"</div>
          )}

          {displayedBooks
            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            .map((book, index) => (
              <Card key={book.book_id ?? index} book={book} />
            ))}
        </div>
        {/* Pagination controls */}
        {displayedBooks.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-center flex-wrap gap-2 mt-8 px-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded bg-gray-300 text-gray-800 disabled:opacity-60 hover:bg-gray-400 transition text-sm"
              aria-label="Previous page"
            >
              ← Prev
            </button>

            <div className="flex items-center flex-wrap gap-1 sm:gap-2">
              {Array.from({ length: Math.ceil(displayedBooks.length / ITEMS_PER_PAGE) }).map((_, i) => {
                const page = i + 1;
                // show only nearby pages to avoid huge lists
                if (Math.abs(page - currentPage) > 4 && page !== 1 && page !== Math.ceil(displayedBooks.length / ITEMS_PER_PAGE)) {
                  // Render ellipsis for gaps
                  if (page === currentPage - 5 || page === currentPage + 5) {
                    return (
                      <span key={`dots-${page}`} className="px-1 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 sm:px-3 py-1 rounded text-sm transition bg-gray-300 text-gray-800 ${page === currentPage ? 'ring-2 ring-gray-400' : 'hover:bg-gray-400'}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(displayedBooks.length / ITEMS_PER_PAGE), p + 1))}
              disabled={currentPage === Math.ceil(displayedBooks.length / ITEMS_PER_PAGE)}
              className="px-3 py-2 rounded bg-gray-300 text-gray-800 disabled:opacity-60 hover:bg-gray-400 transition text-sm"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}

      </ul>
    </div>
  );
};

export default BookList;
