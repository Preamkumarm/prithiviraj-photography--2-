
import React, { useState, useEffect } from 'react';
import type { Service } from '../types';
import * as api from '../services/apiService';
import { PageWrapper } from '../components/PageWrapper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const ServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                const data = await api.getServices();
                setServices(data || []);
                setError(null);
            } catch(err) {
                setError("Could not load services. The backend might be offline.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    return (
        <PageWrapper title="Services">
            <h1 className="text-5xl font-bold text-center mb-12 text-brand-primary">Our Services</h1>
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error}/>}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {services.map(service => (
                        <div key={service.id} className="bg-brand-surface p-8 rounded-lg flex flex-col">
                            <h2 className="text-3xl font-bold text-brand-primary">{service.name}</h2>
                            <p className="text-brand-text my-4 flex-grow">{service.description}</p>
                            <div className="mt-auto">
                                {service.discount > 0 && (
                                    <p className="text-lg text-gray-400 line-through">₹{service.basePrice.toLocaleString()}</p>
                                )}
                                <p className="text-4xl font-bold text-white">₹{service.finalPrice.toLocaleString()}</p>
                                {service.discount > 0 && (
                                    <span className="text-sm font-bold bg-green-500 text-white py-1 px-2 rounded-md ml-2">Save {service.discount}%</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};
