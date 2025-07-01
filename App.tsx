
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PortfolioCategoryPage } from './pages/PortfolioCategoryPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { UserDashboardPage } from './pages/UserDashboardPage';

import { AdminRoute } from './routes/AdminRoute';
import { UserRoute } from './routes/UserRoute';


function App() {
  return (
    <AuthProvider>
        <HashRouter>
            <div className="min-h-screen flex flex-col bg-brand-bg">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/portfolio/:categoryId" element={<PortfolioCategoryPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                    <Route path="/user/dashboard" element={<UserRoute><UserDashboardPage /></UserRoute>} />
                </Routes>
                <Footer />
            </div>
        </HashRouter>
    </AuthProvider>
  );
}

export default App;
