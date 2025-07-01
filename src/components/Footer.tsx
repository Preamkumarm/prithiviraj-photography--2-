
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, ICONS } from '../constants';

export const Footer: React.FC = () => (
    <footer className="bg-black text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
                
                {/* Column 1: Studio Info */}
                <div className="flex flex-col items-center lg:items-start">
                    <Link to="/" className="text-white flex items-center gap-3 w-fit mb-4 group">
                        {ICONS.camera('h-8 w-8 text-brand-primary group-hover:text-white transition-colors duration-300')}
                        <span className="text-2xl font-bold tracking-wider group-hover:text-brand-primary transition-colors duration-300">{CONTACT_INFO.studioName}</span>
                    </Link>
                    <p className="text-sm text-gray-400">Capturing moments that last a lifetime. Based in Namakkal, available worldwide.</p>
                </div>

                {/* Column 2: Contact Details */}
                <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-200">Contact Us</h3>
                    <ul className="mt-4 space-y-4 text-sm">
                        <li className="flex items-start gap-4 group justify-center lg:justify-start">
                            <span className="shrink-0 pt-1 text-gray-400 group-hover:text-brand-primary transition-colors">{ICONS.location('h-5 w-5')}</span>
                            <a href={CONTACT_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors duration-300">
                                {CONTACT_INFO.address}
                            </a>
                        </li>
                        <li className="flex items-start gap-4 group justify-center lg:justify-start">
                             <span className="shrink-0 pt-1 text-gray-400 group-hover:text-brand-primary transition-colors">{ICONS.phone('h-5 w-5')}</span>
                             <div className="flex flex-col gap-y-1 text-center lg:text-left">
                                {CONTACT_INFO.phones.map(phone => (
                                    <a key={phone} href={`tel:${phone}`} className="hover:text-brand-primary transition-colors duration-300">
                                        {phone}
                                    </a>
                                ))}
                             </div>
                        </li>
                        <li className="flex items-start gap-4 group justify-center lg:justify-start">
                             <span className="shrink-0 pt-1 text-gray-400 group-hover:text-brand-primary transition-colors">{ICONS.mail('h-5 w-5')}</span>
                            <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-primary transition-colors duration-300">
                                {CONTACT_INFO.email}
                            </a>
                        </li>
                    </ul>
                </div>
                
                {/* Column 3: Quick Links */}
                <div className="lg:ml-8">
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-200">Quick Links</h3>
                    <ul className="mt-4 space-y-4 text-sm">
                        <li><Link to="/about" className="hover:text-brand-primary transition-colors duration-300">About</Link></li>
                        <li><Link to="/portfolio" className="hover:text-brand-primary transition-colors duration-300">Portfolio</Link></li>
                        <li><Link to="/services" className="hover:text-brand-primary transition-colors duration-300">Services</Link></li>
                        <li><Link to="/reviews" className="hover:text-brand-primary transition-colors duration-300">Reviews</Link></li>
                        <li><Link to="/contact" className="hover:text-brand-primary transition-colors duration-300">Contact</Link></li>
                    </ul>
                </div>


                {/* Column 4: Follow */}
                <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-200">Follow Us</h3>
                     <ul className="mt-4 space-y-4 text-sm">
                        <li className="flex items-center gap-4 group justify-center lg:justify-start">
                             <span className="shrink-0 text-gray-400 group-hover:text-brand-primary transition-colors">{ICONS.instagram('h-5 w-5')}</span>
                            <a href={CONTACT_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors duration-300">
                                {CONTACT_INFO.instagramUsername}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/10 text-center">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {CONTACT_INFO.studioName}. All rights reserved.</p>
            </div>
        </div>
    </footer>
);
