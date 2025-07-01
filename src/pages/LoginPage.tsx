
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageWrapper } from '../components/PageWrapper';
import { ICONS } from '../constants';

export const LoginPage: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const resetFlowState = () => {
        setError('');
        setIsSubmitting(false);
    }
    
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetFlowState();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.status === 'success') {
            navigate('/admin', { replace: true });
        } else {
            setError(result.message || 'An unknown error occurred.');
        }
    };
    
    if (user) {
        return <Navigate to="/admin" replace />;
    }
    
    return (
        <PageWrapper title="Admin Login">
            <div className="max-w-md mx-auto mt-10 bg-brand-surface p-8 rounded-lg shadow-lg">
                <form onSubmit={handleLogin} className="space-y-6">
                     <h1 className="text-3xl font-bold text-center text-brand-secondary">Admin Login</h1>
                    {error && <p className="text-red-500 text-center text-sm bg-red-900/20 p-3 rounded">{error}</p>}
                    
                    <div>
                        <label htmlFor="email-login" className="block text-sm font-medium text-brand-text">Email Address</label>
                        <input id="email-login" name="email" type="email" autoComplete="email" required className="mt-1 block w-full p-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label htmlFor="password-login"  className="block text-sm font-medium text-brand-text">Password</label>
                        <input id="password-login" name="password" type="password" autoComplete="current-password" required className="mt-1 block w-full p-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div className="text-right text-sm">
                        <button type="button" onClick={() => alert('Password reset functionality is not implemented.')} className="font-medium text-brand-primary hover:text-brand-primary/80 hover:underline">
                            Forgot Password?
                        </button>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-brand-bg bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-500">
                        {isSubmitting ? ICONS.spinner() : 'Sign In'}
                    </button>
                </form>
            </div>
        </PageWrapper>
    );
};
