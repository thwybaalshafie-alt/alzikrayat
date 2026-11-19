# Project Report: Alzikrayat — MERN Edition

**Course:** Advanced Web Technologies — MERN Stack Module (Lectures 10–15)  
**Institution:** Sudan University of Science and Technology — Computer Science and Information Technology  
**Project:** Course Project 3 (Alzikrayat — MERN Edition) + Bonus Project 4 (AI Integration via Z.AI `GLM-4.6V-Flash`)  
**Author:** Thwyba Alshafie  
**Git Branch:** `mern-edition` (Project 1 PHP MVC preserved on `master`)

---

## 1. Executive Summary

Alzikrayat — MERN Edition is a complete full-stack modernization of the Project 1 PHP MVC photo-sharing application onto the **MERN Stack** (**MongoDB, Express.js, React.js, Node.js**). Every route, controller, middleware, Mongoose model, and React component was hand-written without meta-frameworks (no Next.js, NestJS, or pre-built admin templates), adhering strictly to the 3-Tier Architecture and REST API design guidelines covered in Lectures 10–15.

In addition to fulfilling 100% of Course Project 3's core specifications, this build incorporates **Bonus Project 4 — AI Integration** using **Z.AI's `GLM-4.6V-Flash`** multimodal vision-language model to deliver automatic image tagging, visual caption generation, pre-upload metadata suggestion, and community comment summarization.

---

## 2. 3-Tier System Architecture

| Physical Tier | Technology | Implementation Location | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Presentation Tier (Client UI)** | React 18 + Vite + React Router v6 + Axios | `/client/src/` | Responsive SPA, reusable functional components, client-side routing (`useParams`), local & context state, async API consumption with loading/error states. |
| **Application / Business Tier (Server API)** | Node.js + Express.js + Joi + Multer + bcryptjs | `/server/routes/`, `/server/controllers/`, `/server/middleware/`, `/server/services/` | RESTful HTTP endpoints, server-side Joi input validation, password hashing, disk image storage, ownership authorization, centralized error handling, Z.AI API orchestration. |
| **Data Tier (Persistent Database)** | MongoDB + Mongoose ODM | `/server/models/` | Schema enforcement, unique indexing, email validation, relational document references (`ObjectId` + `ref`), and query population. |

---

## 3. Database Schema Design (Mongoose)

All three required collections are implemented in `/server/models/` using PascalCase filenames and strict Mongoose validation rules:

1. **`User` (`server/models/User.js`)**
   - Required fields: `firstName`, `lastName`, `email` (`unique: true`, lowercase, regex-validated), `password` (bcrypt hash).
   - Optional profile fields: `location`, `description`, `occupation`.
   - Security safeguard: A schema-level `toJSON` transform automatically deletes `password` and `__v` before serialization so password hashes are never exposed in API responses.
2. **`Photo` (`server/models/Photo.js`)**
   - Required fields: `userId` (`ObjectId`, `ref: 'User'`), `fileName`, `title`.
   - Optional / default fields: `description`, `dateTime` (`default: Date.now`), plus Bonus Project 4 fields `aiTags` (`[String]`) and `aiCaption` (`String`).
   - Indexes on `{ dateTime: -1 }` and `{ userId: 1 }` optimize gallery sorting and ownership queries.
3. **`Comment` (`server/models/Comment.js`)**
   - Required fields: `photoId` (`ObjectId`, `ref: 'Photo'`), `userId` (`ObjectId`, `ref: 'User'`), `comment`.
   - Default field: `dateTime` (`default: Date.now`).
   - Compound index on `{ photoId: 1, dateTime: 1 }` for fast chronological comment retrieval.

---

## 4. Backend Implementation Summary (`/server`)

- **Entry Point (`server/server.js`):** Configures CORS, JSON/URL-encoded body parsing, static file serving for `/uploads`, health endpoint (`/api/health`), modular routers, 404 handler, and centralized error handler.
- **Validation & Security (`server/middleware/validation.js`, `errorHandler.js`):**
  - Joi schemas validate registration, login, photo creation, and comment creation before controllers execute.
  - `validateObjectId()` rejects malformed MongoDB IDs early with `400 Bad Request`.
  - If validation fails on a multipart upload, any uploaded file is immediately unlinked from disk to avoid orphaned files.
  - Passwords are hashed using `bcryptjs` (`10` salt rounds) and verified via `bcrypt.compare()`.
- **File Storage (`server/middleware/upload.js`):** Multer disk storage validates image MIME types (`JPEG`, `PNG`, `GIF`, `WebP`), enforces an 8 MB limit, and generates unique filenames in `server/uploads/`.
- **Ownership-Protected Deletion (`server/controllers/photoController.js`):** `DELETE /api/photos/:id` checks authentication (`401`) and verifies `photo.userId.toString() === requestingUserId` (`403 Forbidden` if mismatched) before deleting comments, the photo document, and the physical image file.
- **Demo Seeder (`server/seed.js`):** Copies the 4 sample artworks from Project 1 (`server/seed-assets/`) into `server/uploads/` and creates 2 bcrypt-hashed demo users, 4 photos, and 6 comments.

---

## 5. Frontend Implementation Summary (`/client`)

- **Routing & State (`App.jsx`, `main.jsx`, `AuthContext.jsx`):**
  - Configured `BrowserRouter` with routes for `/`, `/gallery`, `/photos`, `/photos/:id`, `/upload`, `/login`, and `/register`.
  - `AuthContext` manages the logged-in user object in React state and syncs it to `localStorage`.
- **Navbar Toolbar (`Navbar.jsx`):**
  - Displays **`Hi <firstName>`** and a **Logout** button when logged in.
  - Displays **`Please Login`** routing to `/login` (`LoginRegister`) when logged out.
  - Includes a responsive mobile hamburger toggle for small screens.
- **Pages & Reusable Components:**
  - `Home.jsx`: Hero banner, live stats fetched from `/api/photos/stats`, recent photo grid, and platform overview.
  - `Gallery.jsx`: Fetches photos via `useEffect` + Axios, supports **3-Column Grid**, **4-Column Compact Grid**, and **List View** styles via `PhotoCard` props, plus real-time search and AI tag filter chips.
  - `PhotoDetail.jsx`: Reads `:id` via React Router `useParams()`, renders the full-size image, owner details, Z.AI Vision analysis panel, owner-only two-step Delete Photo confirmation, `AiSummaryBox`, `CommentList`, and `CommentForm` (instant state update without page reload).
  - `UploadPhoto.jsx` & `UploadForm.jsx`: Login-gated multipart upload with live image preview, Z.AI metadata suggestion button, and optional auto-analysis checkbox.
  - `LoginRegister.jsx`: Tabbed authentication screen combining `LoginForm` and `RegisterForm` with full profile fields and clear inline error feedback.
- **Responsive Design (`styles/index.css`):** Custom responsive CSS using fluid grids and media queries at `1024px` (tablet) and `720px` (mobile) for clean rendering on any viewport.

---

## 6. Bonus Project 4: Z.AI (`GLM-4.6V-Flash`) Integration

Implemented in `server/services/aiService.js`, `server/controllers/aiController.js`, and `server/routes/aiRoutes.js`, communicating with Z.AI's OpenAI-compatible Chat Completions endpoint (`https://api.z.ai/api/paas/v4/chat/completions`) using model `glm-4.6v-flash`:

1. **Multimodal Photo Auto-Tagging & Captioning (`POST /api/ai/photos/:id/analyze`):** Encodes the stored image as a base64 Data URI, prompts `glm-4.6v-flash` for structured JSON (`tags`, `caption`), and saves them to MongoDB.
2. **Pre-Upload AI Metadata Suggester (`POST /api/ai/suggest-metadata`):** Inspects an in-memory uploaded image preview and suggests a title, description, and tags directly inside the upload form.
3. **AI Comment Summarization (`POST /api/ai/photos/:id/summarize-comments`):** Aggregates all comments on a photo and produces a concise 2–3 sentence community takeaway.
4. **Resilience:** Includes exponential backoff retry (up to 4 attempts) for transient `429`/`503` rate-limit responses and disables verbose reasoning tokens (`thinking: { type: 'disabled' }`) for fast, structured responses.

---

## 7. Verification & Testing Results

| Verification Check | Method | Result |
| :--- | :--- | :--- |
| React + Vite Production Build (`npm run build`) | Vite bundler | **PASS** (107 modules, 0 errors, 758ms) |
| Database Seeding (`npm run seed`) | Mongoose + bcrypt | **PASS** (2 users, 4 photos, 6 comments seeded) |
| `GET /api/health` | Automated E2E HTTP suite | **PASS** (`200 OK`, DB connected) |
| `POST /api/auth/register` Joi validation & bcrypt hashing | Automated E2E HTTP suite | **PASS** (`400` invalid, `201` created, bcrypt `$2a$` stored, password stripped from JSON, `409` duplicate) |
| `POST /api/auth/login` credential verification | Automated E2E HTTP suite | **PASS** (`401` wrong password, `200` valid login) |
| `GET /api/photos`, `/api/photos/stats`, `/api/photos/:id` | Automated E2E HTTP suite | **PASS** (`200`, `400` invalid ObjectId, `404` missing) |
| `POST /api/photos` multipart upload & disk persistence | Automated E2E HTTP suite | **PASS** (`201`, file verified in `server/uploads/`) |
| `POST /api/photos/:id/comments` | Automated E2E HTTP suite | **PASS** (`201`, populated author returned) |
| `DELETE /api/photos/:id` ownership & file cleanup | Automated E2E HTTP suite | **PASS** (`401` unauth, `403` non-owner, `200` owner + file removed) |
| `.env` exclusion from Git (`git status` / `.gitignore`) | Git inspection | **PASS** (`server/.env` never staged or committed) |

---

## 8. Git Commit History & Deployment Notes

All work is cleanly organized on branch `mern-edition` with structured commits separating branch setup, backend core, backend REST API & Z.AI integration, frontend foundation, frontend views/components, and documentation.
