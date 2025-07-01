
import React, { useEffect } from 'react';
import { CONTACT_INFO } from '../constants';

export const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    useEffect(() => {
        document.title = `${title} | ${CONTACT_INFO.studioName}`;
        window.scrollTo(0, 0);
    }, [title]);
    return <main className="container mx-auto px-4 py-12 flex-grow">{children}</main>;
};
