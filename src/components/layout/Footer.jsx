import React from 'react';

export function Footer() {
    return (
        <footer className="bg-black text-gray-400 py-8 px-6 text-center text-sm">
            <h3 className="text-2xl font-bold mb-6">TresVien</h3>
            <p>&copy; {new Date().getFullYear()} 트레비앙. All rights reserved.</p>
        </footer>
    );
}
