// src/App.jsx
import React, { useState } from "react";
import { Layout } from "./components/layout/Layout";
import { HeroSection } from "./components/home/HeroSection";
import { Tagline } from "./components/home/Tagline";
import { QuickPortfolio } from "./components/home/QuickPortfolio";
import { AccessCodeModal } from "./components/proofing/AccessCodeModal";

export default function App() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState(null);

  const handleSuccessVerify = (galleryData) => {
    setActiveGallery(galleryData);
    alert(
      `Selamat datang ${galleryData.client_name}! Galeri "${galleryData.title}" berhasil dimuat.`,
    );
  };

  return (
    <Layout onOpenClientArea={() => setIsClientModalOpen(true)}>
      {/* Modal Access Code */}
      <AccessCodeModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSuccessVerify={handleSuccessVerify}
      />

      {/* Landing Page Content */}
      <HeroSection onOpenClientArea={() => setIsClientModalOpen(true)} />
      <Tagline />
      <QuickPortfolio />
    </Layout>
  );
}
