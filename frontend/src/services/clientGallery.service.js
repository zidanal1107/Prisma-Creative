// src/services/clientGallery.service.js

const API_BASE_URL = "http://localhost:3001/api/client-galleries";

export const clientGalleryService = {
  /**
   * 1. Verifikasi Kode Akses Klien
   * POST /api/client-galleries/verify
   */
  verifyAccessCode: async (accessCode) => {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_code: accessCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Kode akses tidak valid atau galeri sudah kadaluarsa.",
      );
    }

    return data.data; // Mengembalikan data detail galeri + list media
  },

  /**
   * 2. Ambil Ulang Data Galeri berdasarkan ID
   * GET /api/client-galleries/:id
   */
  getGalleryById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil data galeri.");
    }

    return data.data;
  },

  /**
   * 3. Toggle Pilih / Unselect Foto oleh Klien
   * PATCH /api/client-galleries/media/:mediaId/select
   */
  toggleSelectMedia: async (mediaId, isSelected, clientNote = "") => {
    const response = await fetch(`${API_BASE_URL}/media/${mediaId}/select`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_selected: isSelected,
        client_note: clientNote,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal memperbarui status pemilihan foto.",
      );
    }

    return data.data;
  },
};
