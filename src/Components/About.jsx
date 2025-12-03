import React from 'react'

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">About BookHub</h1>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    BookHub is a lightweight book recommendation demo built to showcase a
                    simple recommendation UI, search experience, and responsive layout.
                    Use the app to browse books, view details and get recommendations
                    based on the selected title.
                </p>

                <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">How it works</h2>
                <p className="text-gray-700 leading-relaxed">
                    The frontend fetches book data from a FastAPI-powered backend. On a
                    book detail view the app requests recommendations for the selected
                    book and displays them in a responsive grid. Search is global and
                    accessible from the top navigation.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold">Frontend</h3>
                        <p className="text-gray-600">React + Vite + TailwindCSS</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Backend</h3>
                        <p className="text-gray-600">FastAPI serving book data & recommendations</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default About
