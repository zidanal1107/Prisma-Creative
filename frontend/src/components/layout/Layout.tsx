// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
    onOpenClientArea?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onOpenClientArea }) => {
    return (
        <div className="min-h-screen bg-dark-900 text-accent-white flex flex-col font-heading selection:bg-accent-gold selection:text-dark-900">
            {/* Header / Navbar Global */}
            <Navbar onOpenClientArea={onOpenClientArea} />

            {/* Main Content Container dengan Smooth Fade In */}
            <main className="flex-grow pt-20 transition-opacity duration-500 ease-in-out">
                {children}
            </main>

            {/* Footer Global */}
            <Footer />
        </div>
    );
};