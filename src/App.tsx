import {  Routes, Route, BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PortfolioCategoryPage } from './pages/PortfolioCategoryPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

// import { AdminRoute } from './routes/AdminRoute';


function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-brand-bg">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/portfolio/:categoryId" element={<PortfolioCategoryPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
