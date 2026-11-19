# Alzikrayat — MERN Edition (Full-Stack Photo Sharing Application)

**Alzikrayat — MERN Edition** is a full-stack photo-sharing web application rebuilt from Project 1 (hand-written PHP MVC) onto the complete **MERN Stack** (**MongoDB**, **Express.js**, **React.js**, **Node.js**) with a clean **3-Tier Client-Server REST Architecture** — plus **Bonus Project 4 AI Integration** powered by **Z.AI (`GLM-4.6V-Flash`)**.

> **Branch Note:** The original Project 1 PHP MVC implementation remains intact on the `master` branch. This `mern-edition` branch contains the complete MERN rebuild with clean `/client` and `/server` directories.

---

## Key Features

### Core Project 3 Requirements
- **3-Tier Physical & Logical Separation:**
  - **Presentation Tier (`/client`):** Vite-built React 18 SPA with reusable functional components, React Router (`BrowserRouter`, `Routes`, `Link`, `useParams`), `AuthContext`, and Axios REST consumption.
  - **Application / Business Tier (`/server`):** Hand-written Express.js REST API with modular routes, controllers, Joi validation middleware, Multer image upload handling, and centralized error handling.
  - **Data Tier (MongoDB + Mongoose):** Strictly validated Mongoose Schemas (`User`, `Photo`, `Comment`) with ObjectId references (`ref: 'User'`, `ref: 'Photo'`).
- **Basic Authentication (Register / Login):**
  - `POST /api/auth/register` validates inputs with Joi, hashes passwords with `bcryptjs` (never stored or returned in plain text), and persists the user.
  - `POST /api/auth/login` compares credentials against the stored bcrypt hash and returns the user's public profile.
  - Client session persisted in React state (`AuthContext`) + `localStorage`.
  - Dynamic Navbar toolbar displays **`Hi <firstName>`** + **Logout** when authenticated, or **`Please Login`** routing to the Login/Register view when logged out.
- **Home Page & Responsive Gallery:**
  - Landing banner, live community stats, recent memories showcase, and responsive multi-view Gallery (**3-Column Grid**, **4-Column Compact Grid**, and **List View** toggle), plus instant search and AI tag filters.
- **Photo Upload, Detail View & Owner-Only Deletion:**
  - Authenticated multipart image uploads (`POST /api/photos`) stored in `server/uploads/` with metadata in MongoDB.
  - Dedicated detail route (`/photos/:id` via `useParams`) showing full-size image, owner profile, metadata, and comments.
  - Server-side ownership verification on `DELETE /api/photos/:id` (`403 Forbidden` for non-owners) that cleans up the database record, associated comments, and file on disk.
- **Real-Time UI Photo Commenting Engine:**
  - Authenticated users can comment on any photo (`POST /api/photos/:id/comments`) and see new comments immediately without a full page reload.

### Bonus Project 4 Feature: AI Integration (`Z.AI GLM-4.6V-Flash`)
- **AI Auto-Tagging & Visual Captioning (`POST /api/ai/photos/:id/analyze`):** Analyzes uploaded images with Z.AI's multimodal `glm-4.6v-flash` model to generate searchable tags and a descriptive visual caption stored in MongoDB.
- **AI Upload Metadata Suggester (`POST /api/ai/suggest-metadata`):** Previews a selected photo before uploading and auto-fills suggested title, description, and tags.
- **AI Comment Summarization (`POST /api/ai/photos/:id/summarize-comments`):** Generates a concise summary of community discussion on any photo detail page.

---

## Project Structure

```text
alzikrayat/
├── .gitignore
├── README.md
├── Project_Report.md
├── server/
│   ├── models/              # User.js, Photo.js, Comment.js (Mongoose Schemas)
│   ├── routes/              # authRoutes.js, photoRoutes.js, commentRoutes.js, aiRoutes.js
│   ├── controllers/         # authController.js, photoController.js, commentController.js, aiController.js
│   ├── middleware/          # validation.js (Joi), errorHandler.js, upload.js (Multer)
│   ├── services/            # aiService.js (Z.AI GLM-4.6V-Flash client)
│   ├── seed-assets/         # Sample images carried forward from Project 1
│   ├── uploads/             # Stored uploaded image files (gitignored)
│   ├── seed.js              # Demo database seeder
│   ├── server.js            # Express entry point
│   ├── .env.example         # Environment variable template
│   └── .env                 # Local secrets (NEVER committed to Git)
└── client/
    ├── index.html
    ├── vite.config.js       # Dev proxy (/api and /uploads -> http://localhost:5000)
    └── src/
        ├── components/      # Navbar, Footer, PhotoCard, CommentForm, CommentList,
        │                    # LoginForm, RegisterForm, UploadForm, AiSummaryBox,
        │                    # LoadingSpinner, ErrorAlert
        ├── pages/           # Home, Gallery, PhotoDetail, UploadPhoto, LoginRegister
        ├── context/         # AuthContext.jsx
        ├── services/        # api.js
        ├── styles/          # index.css (Responsive mobile/tablet/desktop CSS)
        ├── App.jsx          # React Router configuration
        └── main.jsx         # Entry point (ReactDOM.createRoot)
```

---

## Prerequisites

- **Node.js** v18+ (tested on Node.js v24.12.0)
- **npm** v9+
- **MongoDB** (MongoDB Atlas cluster or local MongoDB Community Server)
- **Z.AI API Key** (for Bonus AI features using `glm-4.6v-flash`)

---

## Setup & Environment Variables

### 1. Configure Backend Environment (`server/.env`)
Copy `server/.env.example` to `server/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/alzikrayat?retryWrites=true&w=majority
# Or for local MongoDB:
# MONGODB_URI=mongodb://127.0.0.1:27017/alzikrayat
CLIENT_ORIGIN=http://localhost:5173

# Bonus Project 4: Z.AI Integration
ZAI_API_KEY=your_zai_api_key_here
ZAI_BASE_URL=https://api.z.ai/api/paas/v4
ZAI_MODEL=glm-4.6v-flash
```

> **Security Note:** `.env` is excluded from Git via `.gitignore` so secrets and database credentials are never committed.

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Seed Sample Data (Optional — Recommended for Demo)

```bash
cd server
npm run seed
```

This creates 2 demo accounts, 4 sample photos (copied from `server/seed-assets/` into `server/uploads/`), and 6 comments:
- **Demo Account 1:** `thwyba@alzikrayat.demo` / `Demo@1234`
- **Demo Account 2:** `omar@alzikrayat.demo` / `Demo@1234`

---

## Running Locally

Open two terminals:

**Terminal 1 — Start Express REST API (`http://localhost:5000`):**
```bash
cd server
npm run dev
```

**Terminal 2 — Start React + Vite Frontend (`http://localhost:5173`):**
```bash
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser. Vite automatically proxies `/api` and `/uploads` requests to `http://localhost:5000`.

---

## REST API Reference

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | API & MongoDB health check | `200` |
| `POST` | `/api/auth/register` | Register a new user (Joi + bcrypt) | `201`, `400`, `409` |
| `POST` | `/api/auth/login` | Authenticate user via bcrypt hash | `200`, `400`, `401` |
| `GET` | `/api/photos` | List all photos (`?search=`, `?tag=`) | `200` |
| `GET` | `/api/photos/stats` | Platform counts (photos, users, comments) | `200` |
| `GET` | `/api/photos/:id` | Single photo with metadata & comments | `200`, `400`, `404` |
| `POST` | `/api/photos` | Upload photo (`multipart/form-data`) | `201`, `400`, `401` |
| `DELETE` | `/api/photos/:id` | Delete own photo (owner verified server-side) | `200`, `401`, `403`, `404` |
| `GET` | `/api/photos/:id/comments` | List comments for a photo | `200`, `400`, `404` |
| `POST` | `/api/photos/:id/comments` | Add a comment to a photo | `201`, `400`, `401`, `404` |
| `POST` | `/api/ai/photos/:id/analyze` | Z.AI Vision auto-tagging & captioning | `200`, `404`, `502`, `503` |
| `POST` | `/api/ai/photos/:id/summarize-comments` | Z.AI comment discussion summary | `200`, `400`, `404`, `503` |
| `POST` | `/api/ai/suggest-metadata` | Z.AI upload preview title/caption/tags | `200`, `400`, `503` |

---

## Submission Checklist Verification

- [x] Express REST API implements all required routes with proper HTTP methods and status codes
- [x] Mongoose Schemas (`User`, `Photo`, `Comment`) defined with validation and ObjectId references
- [x] Passwords hashed with bcrypt and never stored or returned in plain text
- [x] Register/Login works end-to-end; Navbar toolbar reflects `Hi <firstName>` / `Please Login`
- [x] Photo upload stores files on disk and saves metadata in MongoDB
- [x] Delete Photo verifies ownership server-side before removing the record, comments, and file
- [x] Photo Detail view uses React Router (`useParams`) and displays comments
- [x] Comment submission updates the UI immediately without a full page reload
- [x] Gallery view is responsive (mobile/tablet/desktop) with Grid/List toggle and `useEffect` data fetching
- [x] `.env` is used for `MONGODB_URI` & `ZAI_API_KEY` and excluded via `.gitignore`
- [x] Clear `README.md` and full `Project_Report.md` documentation
- [x] Meaningful Git commit history across `/server` and `/client`
