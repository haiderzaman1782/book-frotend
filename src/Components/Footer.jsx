import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-200 py-10 mt-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="text-2xl font-bold mb-2">Book Recommender</div>
                        <p className="text-sm text-gray-400">Discover books tailored to your taste. Built with ❤️ and a love for reading.</p>
                        <div className="flex items-center gap-3 mt-4">
                            <a href="#" className="inline-block bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm">Subscribe</a>
                            <a href="#" className="inline-block border border-gray-600 hover:border-gray-500 px-3 py-2 rounded text-sm">Support</a>
                        </div>
                    </div>

                    <div>
                        <div className="font-semibold mb-2">Explore</div>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white">About</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <div className="font-semibold mb-2">Follow</div>
                        <div className="flex gap-3">
                            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">T</a>
                            <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">GH</a>
                            <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">in</a>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">
                            <div>Contact: <a href="mailto:hello@books.local" className="text-gray-200 hover:underline">hello@bookhub.com</a></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
                    <div>© {new Date().getFullYear()} Book Recommender. All rights reserved.</div>
                    <div className="mt-3 md:mt-0">Develop By CoreXTech • <span className="ml-2">Privacy</span></div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
