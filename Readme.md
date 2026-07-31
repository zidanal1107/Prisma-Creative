# 📸 Portfolio Web - Photographer, Editor & Videographer

A modern, cinematic, and high-performance portfolio website designed for creative professionals in photography, video editing, and videography. Built with a dark-mode aesthetic to showcase high-resolution visual content effortlessly.

---

## 🛠️ Tech Stack

### **Backend**

- **Runtime:** [Bun](https://bun.sh/) (Fast, all-in-one JavaScript runtime)
- **Framework:** Express.js
- **Language:** TypeScript (`.ts`)

### **Frontend**

- **Library:** React.js (`.jsx`)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite (Recommended with Bun)

---

## 🌟 Key Features

- **Cinematic Dark Mode Aesthetic:** Deep dark tones (`#121212`) and sharp typography to highlight photos, color grading, and video showreels.
- **Interactive Before/After Slider:** Showcases photo/video editing skills using an intuitive left-to-right comparison component.
- **Filterable Media Gallery:** Dynamic grid/masonry gallery filtered by tags (_Wedding, Commercial, Portrait, Landscape, Music Videos_).
- **Embedded Video Showcase:** Smooth Vimeo/YouTube video preview integrations.
- **Booking & Inquiry API:** Contact form hooked to the Express backend with direct WhatsApp integration.
- **Client Proofing Portal (Optional):** Protected API endpoints for client image/video selection.

---

## 📐 Project Structure

```text
portfolio-app/
├── backend/                  # Bun + Express + TS
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API Endpoints
│   │   ├── middleware/       # Auth/Validation
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # React + Tailwind + JSX
│   ├── src/
│   │   ├── components/       # UI Components (Gallery, BeforeAfter, Navbar, etc.)
│   │   ├── pages/            # Home, Photography, Videography, Editing, Contact
│   │   ├── assets/           # Styles & media files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🎨 Color Palette & Typography

- **Background Dark:** `#121212`
- **Card / Secondary Dark:** `#1E1E1E`
- **Accent Gold/Amber:** `#D4AF37`
- **Text Primary:** `#F5F5F5`
- **Text Muted:** `#A0A0A0`

---

## 🚀 Quick Start Guide

### Prerequisites

Make sure you have **Bun** installed on your system:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation & Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/username/creative-portfolio.git
   cd creative-portfolio
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   bun install
   bun dev # Runs server on http://localhost:5000
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   bun install
   bun dev # Runs React app on http://localhost:5173
   ```

---

## ✉️ Contact & Socials

- **Website:** [yourwebsite.com](https://yourwebsite.com)
- **Instagram:** [@yourhandle](https://instagram.com/yourhandle)
- **Email:** contact@yourwebsite.com
- **WhatsApp:** +62 812-XXXX-XXXX
