
import React, { useState, useEffect, useCallback } from 'react';
import type { Feedback } from '../types';
import * as api from '../services/apiService';
import { PageWrapper } from '../components/PageWrapper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { StarRatingInput } from '../components/StarRatingInput';

export const ReviewsPage: React.FC = () => {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    
    const fetchFeedback = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await api.getFeedback();
            setFeedbackList(data ? data.reverse() : []);
            setError(null);
        } catch(err) {
            setError("Could not load reviews.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }
        const formData = new FormData(e.currentTarget);
        const newFeedback = {
            name: formData.get('name') as string,
            rating: rating,
            review: formData.get('review') as string,
        };
        try {
            await api.submitFeedback(newFeedback);
            setFeedbackSubmitted(true);
            e.currentTarget.reset();
            setRating(0);
            fetchFeedback();
        } catch (error) {
            alert('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <PageWrapper title="Reviews">
            <h1 className="text-5xl font-bold text-center mb-12 text-brand-primary">What Our Clients Say</h1>
            
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error}/>}
            
            {!isLoading && !error && feedbackList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {feedbackList.map(feedback => (
                        <div key={feedback.id} className="bg-brand-surface p-8 rounded-lg shadow-lg flex flex-col">
                            <div className="flex text-yellow-400 text-2xl mb-4">
                                {'★'.repeat(feedback.rating)}<span className="text-gray-600">{'★'.repeat(5 - feedback.rating)}</span>
                            </div>
                            <p className="text-brand-text italic mb-4 flex-grow">"{feedback.review}"</p>
                            <h3 className="font-bold text-brand-primary mt-auto">- {feedback.name}</h3>
                        </div>
                    ))}
                </div>
            )}
            
            {!isLoading && !error && feedbackList.length === 0 && (
                <p className="text-center text-gray-400 mb-20">No reviews have been submitted yet. Be the first!</p>
            )}


            <div className="border-t-2 border-brand-surface pt-16">
                 <div className="max-w-2xl mx-auto text-center">
                     <h2 className="text-4xl font-bold text-brand-primary mb-4">Leave Your Review</h2>
                     <p className="text-lg mb-8">Your feedback helps us improve and grow. Share your experience with us!</p>
                 </div>
                 <div className="max-w-2xl mx-auto">
                    {feedbackSubmitted ? (
                         <div className="text-center bg-brand-surface p-12 rounded-lg">
                            <h2 className="text-3xl font-bold text-brand-primary mb-4">Feedback Received!</h2>
                            <p className="text-lg">Thank you for taking the time to leave a review.</p>
                            <button onClick={() => setFeedbackSubmitted(false)} className="mt-6 text-brand-primary underline">Leave another review</button>
                        </div>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-6 bg-brand-surface p-8 rounded-lg">
                            <StarRatingInput rating={rating} setRating={setRating} />
                            <input type="text" name="name" placeholder="Your Name" required className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary"/>
                            <textarea name="review" placeholder="Your Review" rows={5} required className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary"></textarea>
                            <button type="submit" className="w-full bg-brand-primary text-brand-bg font-bold py-4 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300">Submit Feedback</button>
                        </form>
                    )}
                 </div>
            </div>
        </PageWrapper>
    );
};
