
import React from 'react';
import { ICONS } from '../constants';

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..."}) => (
    <div className="flex justify-center items-center h-64 gap-3 text-brand-primary">
        {ICONS.spinner('animate-spin h-8 w-8')}
        <span className="text-xl">{text}</span>
    </div>
);
