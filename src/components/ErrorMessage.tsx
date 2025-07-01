
import React from 'react';

export const ErrorMessage: React.FC<{ message?: string }> = ({ message = "Something went wrong."}) => (
    <div className="text-center bg-red-900/50 border border-red-500 text-red-300 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{message} Please try again later.</p>
    </div>
);
