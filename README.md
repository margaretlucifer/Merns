# EduSphere — The Ultimate Smart Campus & Micro-Economy Network

EduSphere is a full-stack smart campus operating system and micro-economy network designed for universities and engineering colleges in India. It unites academic management, verifiable QR event ticketing, digital student IDs, Gemini-powered career simulations, personal finance in INR (₹), student freelancing, and green campus logistics in a single cohesive platform.

---

## 🏛️ System Architecture

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend API**: Node.js & Express RESTful API mounted under `/api/v1/*`.
- **Database Layer**: Persistent JSON-backed Mongoose schema architecture (`data/edusphere_db.json`) pre-populated with realistic Indian collegiate datasets.
- **Authentication**: Role-based access control with HTTP-only session cookies and instant persona switching.
- **AI Integrations**: Google Gemini API (`@google/genai`) multimodal models with deterministic university placement engine fallbacks.
- **Micro-Economy Currency**: Indian Rupee (`₹ INR`).

---

## 📦 Implemented Core Modules

1. **Campus Event Hub & Ticket Manager**:
   - Filter by categories: Hackathons, Workshops, Cultural Carnivals, and Seminars.
   - Registration with cryptographic signed ticket generation.
   - High-resolution SVG QR code generation with copyable token strings.
   - Interactive gate entrance scanner validating QR authenticity.

2. **Student Academic Record Management**:
   - Official registration details (Enrollment: `ED-2023-CS-0428`).
   - Attendance percentage tracking with 75% university minimum alerts.
   - Dual-mode: Students view live records, Faculty can mark present/absent per subject.
   - GPA analytics (SGPA: 9.12, CGPA: 8.94).

3. **Digital Student ID Card Generator**:
   - Verified student portrait photo, enrollment barcode, and university crest.
   - One-click print/save PDF card layout.
   - Turnstile and library entry QR verification token.

4. **WhatIf AI — Career Pathway Simulator**:
   - Calibrated for Indian engineering placements (Bengaluru/Hyderabad tech corridors).
   - Input semester, tech stack, and weekly study hours.
   - Generates 4-stage roadmaps: project blueprints, certifications, and timeline.

5. **ToolScout AI — Campus Tool Discovery**:
   - Curated directory for full-stack engineering, databases, design, and AI models.
   - Verified official URLs, student license flags, and learning difficulty curves.

6. **Student Notes & Handouts Library**:
   - Academic note sharing organized by semester and subject.
   - Bookmarking, download counters, and upload modal.

7. **Interactive Study Planner**:
   - Subject-wise study blocks, duration estimates, priority flags.
   - 5-day active study streak tracker and semester countdown timer.

8. **Nexora Student Freelancing Marketplace**:
   - Internal closed-loop collegiate micro-economy in ₹ INR.
   - Campus clubs and departments post gigs (UI design, fest web apps, videos).
   - Freelancer proposal submission, quoted budgets, and milestone acceptance.

9. **Personal Expense & Finance Tracker**:
   - Student ledger tracking hostel mess, metro commute, books, and freelance earnings.
   - Income vs Expense cards, remaining monthly budget, and CSV export.

10. **Smart Scholarship Finder**:
    - Automatic eligibility evaluation comparing student CGPA and department against national fellowships.

11. **EcoRoute AI — Sustainable Campus Transit**:
    - Intra-campus route calculation between academic complexes, hostels, and libraries.
    - Estimates distance, travel duration, battery consumption, and CO₂ offset in kg.

12. **BasketWise Student Price Matcher**:
    - Compares subsidized Campus Co-op Store prices against Amazon and Flipkart.

13. **Campus Lost & Found Board**:
    - Report lost or found electronic gadgets, textbooks, and calculators.
    - Private claim workflows preserving item confidentiality.

14. **Quiz & Assessment Learning Portal**:
    - Timed assessments with countdown clocks.
    - Server-side grading preventing answer exposure.
    - Detailed faculty answer explanations.

15. **Global Campus Tasks (To-Do)**:
    - Persistent quick-task drawer accessible globally across all modules.

16. **Administrator Console**:
    - Real-time campus KPI telemetry.
    - User account directory and security audit logs.
    - Audit CSV reporting.

---

## 👥 Campus Personas (Quick Switcher)

- **Student**: Aarav Sharma (3rd Year B.Tech CSE, Bengaluru)
- **Faculty**: Prof. Sunita Rao (Associate Professor, CSE)
- **Administrator**: Dr. Vikram Malhotra (Dean of Academic Affairs)
- **Freelancer**: Priya Nair (UI/UX Student Design Lead)
- **Client**: TechFest Organizing Council

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start full-stack development server on port 3000
npm run dev

# Production build
npm run build
npm start
```
