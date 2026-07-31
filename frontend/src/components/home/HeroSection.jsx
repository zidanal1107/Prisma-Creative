// src/components/home/HeroSection.jsx
import React from "react";

export const HeroSection = ({ onOpenClientArea }) => {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-dark-900 border-b border-dark-700/50">
      {/* Background Video / Parallax Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Kamu bisa mengganti src video di bawah dengan file mp4 lokal atau CDN */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-35 scale-105 filter brightness-90"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-cinematographer-filming-a-scene-40893-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient Layer agar Teks di atasnya selalu terbaca dengan jelas */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-dark-900/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-800/80 border border-accent-gold/30 text-accent-gold text-xs uppercase tracking-[0.25em] font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
          Creative Visual Studio
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-tight text-accent-white tracking-tight">
          Capturing Moments, <br />
          <span className="italic font-light text-accent-gold">
            Crafting Stories.
          </span>
        </h1>

        <p className="text-sm md:text-base text-accent-muted max-w-2xl mx-auto font-light leading-relaxed">
          Studio dokumentasi fine-art fotografi, sinematografi visual, dan
          profesional retouching untuk wedding, commercial, dan personal brand.
        </p>

        {/* Call to Action Buttons */}
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <a
            href="#quick-portfolio"
            className="px-8 py-3.5 rounded-full bg-accent-gold text-dark-900 font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg hover:shadow-accent-gold/20"
          >
            Explore Works
          </a>
          <button
            onClick={onOpenClientArea}
            className="px-8 py-3.5 rounded-full border border-accent-white/20 hover:border-accent-gold text-accent-white hover:text-accent-gold text-xs uppercase tracking-widest font-semibold backdrop-blur-sm transition-all"
          >
            Client Portal
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase tracking-widest text-accent-muted">
          Scroll
        </span>
        <div className="w-4 h-7 border border-accent-muted rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-accent-gold rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
