// src/components/proofing/AccessCodeModal.jsx
import React, { useState } from "react";
import { clientGalleryService } from "../../services/clientGallery.service";

export const AccessCodeModal = ({ isOpen, onClose, onSuccessVerify }) => {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!accessCode.trim()) {
      setErrorMessage("Masukkan kode akses Anda.");
      return;
    }

    try {
      setLoading(true);
      const gallery = await clientGalleryService.verifyAccessCode(
        accessCode.trim(),
      );
      onSuccessVerify(gallery); // Kirim data galeri ke parent component / state
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "Terjadi kesalahan saat verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl space-y-6">
        {/* Tombol Close Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-accent-muted hover:text-accent-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-accent-gold font-semibold">
            Client Proofing Portal
          </span>
          <h3 className="font-serif text-2xl text-accent-white font-bold">
            Access Your Gallery
          </h3>
          <p className="text-xs text-accent-muted">
            Masukkan kode akses unik yang diberikan oleh tim kami untuk memilih
            foto & video Anda.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-accent-muted mb-2">
              Access Code
            </label>
            <input
              type="text"
              placeholder="Contoh: AKSES-RAFFI"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-accent-white placeholder:text-dark-700 uppercase tracking-widest text-center font-bold focus:outline-none focus:border-accent-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-accent-gold text-dark-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50"
          >
            {loading ? "Verifying Code..." : "Access My Gallery"}
          </button>
        </form>
      </div>
    </div>
  );
};
