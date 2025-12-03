import React, { useState } from 'react'

const Contact = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // No backend hookup for now — just simulate success
        setSent(true)
        setTimeout(() => {
            setName('')
            setEmail('')
            setMessage('')
        }, 800)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>

                <p className="text-gray-700 mb-6">Have questions or feedback? Fill out the form below and we'll get back to you.</p>

                {sent && (
                    <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-800">
                        Message sent — thank you!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button type="submit" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
                            Send Message
                        </button>
                        <div className="text-sm text-gray-500">Or email us at <a className="text-blue-600" href="mailto:hello@bookhub.example">hello@bookhub.com</a></div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Contact
