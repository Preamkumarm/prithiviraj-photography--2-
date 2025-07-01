
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { PortfolioCategory } from '../types';
import * as api from '../services/apiService';
import { PageWrapper } from '../components/PageWrapper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const PortfolioPage: React.FC = () => {
    const [categories, setCategories] = useState<PortfolioCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setIsLoading(true);
                const data = await api.getPortfolio();
                setCategories(data || []);
                setError(null);
            } catch (err) {
                setError("Could not load the portfolio. The backend might be offline.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPortfolio();
    }, []);
    
    return (
        <PageWrapper title="Portfolio">
            <h1 className="text-5xl font-bold text-center mb-12 text-brand-primary">Our Portfolio</h1>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categories.map((category) => (
                        <Link key={category.id} to={`/portfolio/${category.id}`} state={{ name: category.name }} className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-brand-primary/30">
                            <img src={category.coverImage} alt={category.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                                {category.subcategories.length > 0 && (
                                    <p className="text-sm text-brand-primary">{category.subcategories.join(', ')}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};
