import React from 'react';

export function Button({ children, className = '', ...props }) {
    return (
        <button
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 active:scale-95 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
