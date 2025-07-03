
import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { PHOTOGRAPHER_INFO } from '../constants';
import * as api from '../services/apiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { assets } from '../assests/assets';

export const AboutPage: React.FC = () => {
    const [intro, setIntro] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrentImage((prevIndex)=>(prevIndex + 1) % assets.length);
        }, 2000);

        return ()=> clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const content = await api.getSiteContent();
                setIntro(content.aboutIntro);
            } catch (error) {
                console.error("Failed to load about page content", error);
                setIntro(PHOTOGRAPHER_INFO.intro); // Fallback to constant
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    return (
        <PageWrapper title="About">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/3">
                    <img src={assets[currentImage].imageSrc} alt={PHOTOGRAPHER_INFO.name} className="rounded-lg shadow-2xl object-cover w-full h-auto" />
                </div>
                <div className="md:w-2/3">
                    <h1 className="text-5xl font-bold text-brand-primary mb-4">{PHOTOGRAPHER_INFO.name}</h1>
                    <h2 className="text-2xl font-semibold text-brand-secondary mb-6">{PHOTOGRAPHER_INFO.location}</h2>
                    {isLoading ? (
                        <div className="h-48 flex items-center justify-center"><LoadingSpinner text="Loading content..." /></div>
                    ) : (
                        <p className="text-lg leading-relaxed text-brand-text whitespace-pre-line">{intro}</p>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};
