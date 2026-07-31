// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';

interface NavbarProps {
    onOpenClientArea?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenClientArea }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Services', href: '#services' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-dark-900/80 backdrop-blur-md border-b border-dark-700/50 py-4 shadow-lg'
                    : 'bg-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Brand / Logo */}
                <a href="#" className="flex items-center gap-2 group">
                    <span className="font-serif text-2xl font-bold tracking-wider text-accent-white group-hover:text-accent-gold transition-colors">
                        LUMINA<span className="text-accent-gold">.</span>
                    </span>
                </a>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-accent-muted hover:text-accent-white transition-colors tracking-wide"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Right Action Button (Client Portal CTA) */}
                <div className="hidden md:flex items-center space-x-4">
                    <button
                        onClick={onOpenClientArea}
                        className="px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-accent-gold/40 text-accent-gold hover:bg-accent-gold hover:text-dark-900 transition-all duration-300 shadow-sm"
                    >
                        Client Area
                    </button>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-accent-white focus:outline-none p-2"
                    aria-label="Toggle Menu"
                >
                    <svg
                        className="w-6 h-6 fill-current"
                        viewBox="0 0 24 24"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                            />
                        ) : (
                            <path
                                fillRule="evenodd"
                                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-dark-900/95 border-b border-dark-700 backdrop-blur-xl px-6 py-6 transition-all">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-accent-muted hover:text-accent-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <hr className="border-dark-700 my-2" />
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                if (onOpenClientArea) onOpenClientArea();
                            }}
                            className="w-full text-center px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-accent-gold text-dark-900 font-bold"
                        >
                            Client Area Access
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};