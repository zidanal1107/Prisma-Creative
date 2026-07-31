// src/components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-900 border-t border-dark-700 text-accent-muted pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Quick Call To Action (CTA) Section */}
                <div className="bg-dark-800/60 border border-dark-700 rounded-2xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="font-serif text-2xl md:text-3xl text-accent-white font-bold mb-2">
                            Ready to craft your visual story?
                        </h3>
                        <p className="text-accent-muted text-sm md:text-base">
                            Let's discuss your upcoming photography, videography, or editing project.
                        </p>
                    </div>
                    <a
                        href="#contact"
                        className="px-8 py-4 rounded-full bg-accent-gold text-dark-900 font-semibold text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg hover:shadow-accent-gold/20 whitespace-nowrap"
                    >
                        Book a Session
                    </a>
                </div>

                {/* Footer Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand Info */}
                    <div className="md:col-span-2 space-y-4">
                        <span className="font-serif text-2xl font-bold tracking-wider text-accent-white">
                            LUMINA<span className="text-accent-gold">.</span>
                        </span>
                        <p className="text-sm leading-relaxed max-w-sm text-accent-muted">
                            Capturing timeless moments, crafting immersive motion pictures, and perfecting fine editing for high-end visual stories.
                        </p>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-accent-white font-semibold mb-4">
                            Navigation
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#portfolio" className="hover:text-accent-white transition-colors">Photography</a></li>
                            <li><a href="#portfolio" className="hover:text-accent-white transition-colors">Videography</a></li>
                            <li><a href="#services" className="hover:text-accent-white transition-colors">Editing Services</a></li>
                            <li><a href="#about" className="hover:text-accent-white transition-colors">About Team</a></li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-accent-white font-semibold mb-4">
                            Connect
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors">Instagram</a></li>
                            <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors">YouTube / Showreel</a></li>
                            <li><a href="https://behance.net" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors">Behance</a></li>
                            <li><a href="https://wa.me/" target="_blank" rel="noreferrer" className="hover:text-accent-gold transition-colors">WhatsApp Business</a></li>
                        </ul>
                    </div>
                </div>

                {/* Divider & Copyright */}
                <div className="border-t border-dark-700/60 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-accent-muted/70 gap-4">
                    <p>© 2026 LUMINA Creative Studio. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-accent-white">Privacy Policy</a>
                        <a href="#" className="hover:text-accent-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};