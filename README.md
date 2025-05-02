# Portfolio Administration System

![Project Banner](https://www.pexels.com/fr-fr/photo/lunettes-d-elevage-noir-devant-un-ordinateur-portable-577585/) <!-- Replace with your actual image if available -->

## Overview

A modern web application for managing and displaying portfolio works with admin capabilities including authentication, work upload/edit/delete functionality, and category management.

> ⚠️ **Disclaimer**:  
> This repository is a **student project** carried out as part of the [OpenClassrooms Web Developer training program](https://openclassrooms.com/fr/paths/900/projects/1157).  
> It is **not intended for production use** and serves as an **exercise** to practice JavaScript (ES6+), API integration, and DOM manipulation using Vanilla JS.

## Key Features

- **Gallery Management**:
  - Display works in responsive grid
  - Filter by categories
  - Modal previews

- **Admin Dashboard**:
  - Secure JWT authentication
  - Edit mode toggle
  - Work upload with validation
  - Delete functionality

- **UI Components**:
  - Toast notifications
  - Accessible modals
  - Form validation
  - Image preview

## 🧪 Technologies Used

- HTML5
- SCSS
- JavaScript (ES6+)
- REST API
- Vercel (frontend hosting)
- Render (backend API hosting)

---

## 🔗 Deployments

- **Frontend**: https://tomsif-sophie-bluel.vercel.app  
- **Backend API**: https://tomsif-openclassrooms-projet-6-sophie.onrender.com

---

## Project Structure

```
src/
├── controllers/        # Application controllers
│   ├── formController.js
│   ├── loginController.js
│   ├── modalController.js
│   └── travauxController.js
├── models/             # Data models
│   ├── authModel.js
│   ├── categoryModel.js
│   ├── deleteModel.js
│   ├── travauxModel.js
│   └── workUploadModel.js
├── utils/              # Utilities
│   ├── modalState.js
│   └── validation.js
├── views/              # UI components
│   ├── adminView.js
│   ├── categoryView.js
│   ├── galleryView.js
│   ├── modalView.js
│   └── toast.js
└── main.js             # Entry point
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/TomSif/TomSif-OpenClassRooms_Projet-6_Sophie-Bluel.git
   cd TomSif-OpenClassRooms_Projet-6_Sophie-Bluel
   ```

2. Run the application:
   - Open `index.html` directly in your browser
   - Ensure the API server is running at 'https://tomsif-openclassrooms-projet-6-sophie.onrender.com` , wait 30s to wake up the api.

3. Admin access:
   - Log in using the login form (sophie.bluel@test.tld|S0phie)

## Contact

Thomas Sifferle – [thomas.sifferle@gmail.com](mailto:thomas.sifferle@gmail.com)  
Project Link: [GitHub Repository](https://github.com/TomSif/TomSif-OpenClassRooms_Projet-6_Sophie-Bluel/tree/main)

## License

This project is provided for **educational purposes only** and may contain materials that belong to OpenClassrooms as part of their coursework.  
Do not reuse or redistribute without proper attribution.


 