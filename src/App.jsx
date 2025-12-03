import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BookRecommender, BookDetails, Navbar, About, Contact, Footer, Auth, AdminDashboard, AdminBookList, AdminBookForm, ProtectedRoute } from './Components'
import ScrollToTop from './Components/ScrollToTop'
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SearchProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<BookRecommender />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<Navigate to="books" replace />} />
                <Route path="books" element={<AdminBookList />} />
                <Route path="books/new" element={<AdminBookForm />} />
                <Route path="books/edit/:id" element={<AdminBookForm />} />
              </Route>
            </Route>
          </Routes>
          <Footer />
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App