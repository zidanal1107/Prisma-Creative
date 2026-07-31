// src/components/home/QuickPortfolio.jsx
import React, { useState } from "react";

export const QuickPortfolio = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Data Sampel Portofolio
  const portfolioItems = [
    {
      id: 1,
      title: "Eternal Vows in Bali",
      category: "photography",
      tag: "Wedding Photography",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Teaser Film: Cinema Love",
      category: "videography",
      tag: "Video Trailer",
      image:
        "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Mood & Color Grading Retouch",
      category: "editing",
      tag: "Before-After Edit",
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Urban Portrait Series",
      category: "photography",
      tag: "Portrait",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredItems =
    activeTab === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeTab);

  return (
    <section
      id="quick-portfolio"
      className="py-24 max-w-7xl mx-auto px-6 md:px-12"
    >
      {/* Header & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-accent-gold font-semibold">
            Selected Works
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-accent-white font-bold mt-2">
            Featured Portfolio
          </h2>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap gap-2 bg-dark-800 p-1.5 rounded-full border border-dark-700/80">
          {[
            { id: "all", label: "All Works" },
            { id: "photography", label: "Photography" },
            { id: "videography", label: "Videography" },
            { id: "editing", label: "Editing" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-accent-gold text-dark-900 shadow-md"
                  : "text-accent-muted hover:text-accent-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[3/4] bg-dark-800 rounded-2xl overflow-hidden border border-dark-700/60 cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity z-10" />

            {/* Content Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-[10px] uppercase tracking-widest text-accent-gold font-semibold block mb-1">
                {item.tag}
              </span>
              <h3 className="font-serif text-lg text-accent-white font-bold leading-snug">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
