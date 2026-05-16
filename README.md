# Civic Voice 🏛️📱

**Empowering Citizens. Transforming Governance.**

Civic Voice is a modern, real-time web application designed to bridge the gap between citizens and municipal authorities. It allows citizens to seamlessly report civic issues (like potholes, water leakages, or broken streetlights) with automated GPS tagging and live photo capture, while providing municipal staff with a powerful dashboard to track, assign, and resolve these issues in real-time.

---

## 🌟 Key Features

### 1. Secure & Seamless Authentication
* **Phone OTP Login:** Built with Firebase Authentication. Users log in using their phone numbers and receive a secure 6-digit SMS OTP, eliminating the need for passwords.
  * **⚠️ Important Testing Note:** To prevent SMS spam and billing charges during the hackathon/demo phase, Firebase is currently configured in **Test Mode**. Only the authorized test number will work:
    * **Test Phone Number:** `6033234879`
    * **Test OTP Code:** `123456`
* **Role-Based Access:** During setup, users choose their role—**Citizen** or **Municipal Staff**. The app dynamically serves entirely different dashboards and permission sets based on this choice.
  * **Staff Authorization:** Accessing the Municipal Staff dashboard requires an authorized Staff ID. You can use the demo IDs: `ADMIN123` or `STAFF001`.

### 2. Smart Issue Reporting
* **Live Camera Integration:** On mobile devices, clicking the photo upload button bypasses the standard gallery and directly opens the device's outward-facing camera.
* **Intelligent Auto-Location:** Utilizes HTML5 Geolocation to grab exact GPS coordinates.
* **Reverse Geocoding:** Pings the OpenStreetMap API to instantly translate raw GPS coordinates (latitude/longitude) into human-readable city and state names (e.g., "Kolkata, West Bengal").

### 3. Real-Time Cloud Synchronization
* **Live Updates:** Powered by Firebase Firestore. When a citizen submits a complaint on their phone, it instantly appears on the Municipal Staff's desktop dashboard without requiring a page refresh.
* **Status Tracking Timeline:** Citizens can track the exact status of their complaint (Pending ➔ Acknowledged ➔ In Progress ➔ Resolved) with timestamps showing exactly when staff updated it.

### 4. Interactive Data Visualization
* **Live City Map:** Integrates `Leaflet` to plot all reported issues on an interactive map. Markers are color-coded by issue status and feature custom icons based on the issue category (water, electricity, roads, etc.).
* **Analytics Dashboard:** Uses `Recharts` to generate beautiful, interactive bar charts and pie charts summarizing the city's overall health and department performance.

---

## 🛠️ Technology Stack

This project was built using a modern, scalable, and lightweight tech stack:

### Frontend Ecosystem
* **React 18:** Core UI library for building the component-based architecture.
* **Vite:** Next-generation frontend tooling for ultra-fast development server and optimized production builds.
* **React Router DOM:** For handling client-side routing and protected routes securely.
* **Custom Vanilla CSS:** Designed entirely from scratch using a custom design system and CSS variables (no bloated CSS frameworks). Employs a modern red-and-white theme with glassmorphism effects and micro-animations.

### Backend & Cloud Infrastructure
* **Firebase Firestore:** A NoSQL cloud database used to store issues, user profiles, and status updates in real-time.
* **Firebase Authentication:** Handles the complex logic of SMS delivery, reCAPTCHA verification, and user session management.
* **Firebase Hosting:** The application is compiled and deployed globally via Google's edge network.

### APIs & Libraries
* **Leaflet & React-Leaflet:** For rendering the interactive mapping interface.
* **Recharts:** For rendering the SVG-based data analytics charts.
* **OpenStreetMap Nominatim API:** A free, open-source API used for reverse geocoding to translate GPS coordinates into city names.

---

## 🌍 Live Deployment

This project is fully deployed and hosted on Google's edge network via Firebase Hosting. 

Because the frontend is statically built and talks directly to the serverless Firebase backend, the application runs 24/7 independently of any local development machines. 

**Live Link:** [https://civic-report-system-7eb31.web.app](https://civic-report-system-7eb31.web.app)

*(Anyone can access this link from any device worldwide! Use the test phone number `6033234879` with OTP `123456` to log in, and use Staff ID `ADMIN123` to test the Admin Dashboard.)*

---

## 🚀 How to Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

*(Note: To test mobile GPS functionality on a local network, the Vite server uses the `@vitejs/plugin-basic-ssl` to serve over HTTPS).*
