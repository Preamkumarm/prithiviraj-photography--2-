
import React, { useState } from 'react';
import * as api from '../services/apiService';
import { PageWrapper } from '../components/PageWrapper';

export const ContactPage: React.FC = () => {
    const [contactSubmitted, setContactSubmitted] = useState(false);

    const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newSubmission = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };
        try {
            await api.submitEnquiry(newSubmission);
            alert('Message sent successfully! (Note: In a real-world application, an email/SMS notification would now be sent to the admin.)');
            setContactSubmitted(true);
            e.currentTarget.reset();
        } catch (error) {
            alert('Failed to send message. Please try again.');
        }
    };
    
    return (
        <PageWrapper title="Contact">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <h1 className="text-5xl font-bold mb-6 text-brand-primary">Get in Touch</h1>
                        <p className="text-lg mb-8">Have a project in mind or want to book a session? Fill out the form or contact us directly.</p>
                        {/* Contact info remains static */}
                    </div>
                    <div>
                        {contactSubmitted ? (
                             <div className="text-center bg-brand-surface p-12 rounded-lg h-full flex flex-col justify-center">
                                <h2 className="text-3xl font-bold text-brand-primary mb-4">Thank You!</h2>
                                <p className="text-lg">Your message has been sent. We will get back to you shortly.</p>
                                <button onClick={() => setContactSubmitted(false)} className="mt-6 text-brand-primary underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-6 bg-brand-surface p-8 rounded-lg">
                                <input type="text" name="name" placeholder="Your Name" required className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary"/>
                                <input type="email" name="email" placeholder="Your Email" required className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary"/>
                                <input type="tel" name="phone" placeholder="Your Phone" required className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary"/>
                                <textarea name="message" placeholder="Your Message" rows={5} required className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary"></textarea>
                                <button type="submit" className="w-full bg-brand-primary text-brand-bg font-bold py-4 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300">Send Message</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
