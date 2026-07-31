// src/components/home/Tagline.jsx
import React from "react";

export const Tagline = () => {
  return (
    <section className="py-20 bg-dark-900 border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Big Typography Tagline */}
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-accent-gold font-semibold">
              Our Philosophy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-accent-white leading-relaxed font-light">
              "We don't just record images; we capture the emotion, light, and
              atmosphere to turn every raw moment into a{" "}
              <span className="font-bold underline decoration-accent-gold decoration-1 underline-offset-8">
                cinematic masterpiece
              </span>
              ."
            </h2>
          </div>

          {/* Quick Stats Grid */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 bg-dark-800/50 p-6 rounded-2xl border border-dark-700/60">
            <div className="space-y-1 border-r border-dark-700 pr-4">
              <span className="font-serif text-3xl font-bold text-accent-gold">
                150+
              </span>
              <p className="text-xs text-accent-muted uppercase tracking-wider">
                Weddings & Events
              </p>
            </div>
            <div className="space-y-1 pl-2">
              <span className="font-serif text-3xl font-bold text-accent-white">
                4K
              </span>
              <p className="text-xs text-accent-muted uppercase tracking-wider">
                Cinematic Quality
              </p>
            </div>
            <div className="space-y-1 border-r border-dark-700 pr-4 pt-4 border-t">
              <span className="font-serif text-3xl font-bold text-accent-white">
                100%
              </span>
              <p className="text-xs text-accent-muted uppercase tracking-wider">
                Color Graded
              </p>
            </div>
            <div className="space-y-1 pl-2 pt-4 border-t border-dark-700">
              <span className="font-serif text-3xl font-bold text-accent-gold">
                24/7
              </span>
              <p className="text-xs text-accent-muted uppercase tracking-wider">
                Client Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
