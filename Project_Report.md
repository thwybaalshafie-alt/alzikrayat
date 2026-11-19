# Project Report: Alzikrayat (MERN Edition)

**Course:** Advanced Web Technologies (MERN Stack Module)  
**Institution:** Sudan University of Science and Technology, College of Computer Science and Information Technology  
**Student:** Thwyba Alshafie  
**Branch:** `mern-edition` (Project 1 PHP version remains on `master`)

## 1. Overview

Alzikrayat (MERN Edition) is a full-stack photo sharing web application built using MongoDB, Express.js, React, and Node.js. All backend routes, controllers, middleware, Mongoose schemas, and React components were written directly without meta-frameworks like Next.js or NestJS. The project keeps the three-tier separation between the React UI, Express REST API, and MongoDB database, and also adds AI photo tagging and comment summarization using Z.AI (`glm-4.6v-flash`).

## 2. Three-Tier Architecture

| Tier | Stack | Folder | Role |
| :--- | :--- | :--- | :--- |
| Presentation Tier | React 18, Vite, React Router, Axios | `/client/src/` | User interface, client routing, state management, and API calls |
| Application Tier | Node.js, Express.js, Joi, Multer, bcryptjs | `/server/` | REST API endpoints, validation, file uploads, ownership checks, and AI service |
| Data Tier | MongoDB, Mongoose | `/server/models/` | Data models, schema validation, unique constraints, and ObjectId references |

## 3. Database Schemas

The database uses three Mongoose models in `server/models/`:

1. **User (`User.js`):** Stores `firstName`, `lastName`, unique validated `email`, bcrypt-hashed `password`, and optional `location`, `occupation`, and `description`. A `toJSON` transform removes `password` and `__v` before sending user objects back in API responses.
2. **Photo (`Photo.js`):** Stores `userId` (ObjectId referencing `User`), `fileName`, `title`, optional `description`, `dateTime` (default `Date.now`), and optional `aiTags` and `aiCaption`. Indexes on `dateTime` and `userId` keep gallery sorting and lookups fast.
3. **Comment (`Comment.js`):** Stores `photoId` (ref `Photo`), `userId` (ref `User`), `comment`, and `dateTime` (default `Date.now`), with a compound index on `(photoId, dateTime)`.

## 4. Backend Implementation (`/server`)

- **Server Setup (`server.js`):** Configures CORS, JSON/form body parsing, static serving for `/uploads`, a `/api/health` route, modular routers, a 404 handler, and centralized error handling.
- **Middleware (`middleware/`):**
  - `validation.js` validates request bodies with Joi and removes any uploaded file from disk if multipart validation fails. It also checks MongoDB `ObjectId` parameters before queries run.
  - `upload.js` uses Multer disk storage to save JPEG, PNG, GIF, and WebP images (up to 8 MB) in `server/uploads/` with unique filenames.
  - `errorHandler.js` maps Multer, Mongoose validation/cast, and duplicate key (`11000`) errors to standard HTTP status codes (`400`, `409`, `500`).
- **Auth & CRUD Controllers (`controllers/`):**
  - `authController.js` hashes passwords with `bcryptjs` (10 rounds) on register and compares hashes on login.
  - `photoController.js` lists photos with search/tag filtering and comment counts, fetches single photo details with comments, saves uploaded photos, and verifies ownership (`photo.userId === requestingUserId`) on `DELETE /api/photos/:id` before deleting comments, the photo document, and the stored image file.
  - `commentController.js` validates and saves comments and returns the populated author so the UI updates immediately.
- **Seeder (`seed.js`):** Copies 4 sample images from `server/seed-assets/` into `server/uploads/` and creates 2 demo accounts, 4 photos, and 6 comments.

## 5. Frontend Implementation (`/client`)

- **Routing & Auth State:** `App.jsx` configures React Router routes (`/`, `/gallery`, `/photos`, `/photos/:id`, `/upload`, `/login`, `/register`). `AuthContext.jsx` stores the active user in React state and syncs it with `localStorage`.
- **Navbar (`Navbar.jsx`):** Uses a floating frosted-glass bar that shows `Hi <firstName>` and a `Logout` button when signed in, or `Please Login` linking to `LoginRegister` when signed out.
- **Pages & Components:**
  - `Home.jsx` displays the hero banner, platform counts, recent photos, and about section.
  - `Gallery.jsx` loads photos via `useEffect` + Axios and lets users toggle between 3-column grid, 4-column grid, and list view, as well as search and filter by AI tags.
  - `PhotoDetail.jsx` reads `:id` with `useParams()`, displays the full image, metadata, Z.AI analysis panel, owner-only delete confirmation, comment summary box, and live comment form.
  - `UploadPhoto.jsx` and `UploadForm.jsx` handle authenticated image uploads with instant preview and optional AI metadata suggestions.
  - `LoginRegister.jsx` switches between `LoginForm` and `RegisterForm`.
- **Responsive Design (`styles/index.css`):** Uses a monochrome black, grey, and white layout with media queries at `1024px` and `720px` so pages adapt across desktop, tablet, and mobile screens.

## 6. AI Integration (Z.AI `glm-4.6v-flash`)

`server/services/aiService.js`, `aiController.js`, and `aiRoutes.js` connect to Z.AI's OpenAI-compatible `/chat/completions` endpoint using `glm-4.6v-flash`:

- **Photo Auto-Tagging & Captioning (`POST /api/ai/photos/:id/analyze`):** Reads the local image file as base64, requests tags and a short visual caption, and saves them to the photo record.
- **Upload Metadata Suggestion (`POST /api/ai/suggest-metadata`):** Inspects an image preview in memory and suggests a title, description, and tags in the upload form.
- **Comment Summarization (`POST /api/ai/photos/:id/summarize-comments`):** Summarizes all comments on a photo into a short overview.
- Includes retry handling for temporary `429`/`503` responses from the external API.

## 7. Testing & Verification

The application was tested end-to-end across backend routes, MongoDB persistence, and the React UI:

| Area | What Was Tested | Result |
| :--- | :--- | :--- |
| Frontend Build | `npm run build` in `/client` | Passed with no errors |
| Database Seeding | `npm run seed` in `/server` | Seeded 2 users, 4 photos, and 6 comments |
| Authentication | Register validation (`400`), duplicate email (`409`), bcrypt hash storage, password omitted in JSON, login (`401` / `200`) | Passed |
| Photos CRUD | Gallery list & stats (`200`), invalid/missing ID (`400`/`404`), multipart upload (`201`), owner-only delete (`401`/`403`/`200` + disk file removal) | Passed |
| Comments | Adding comments (`201`) and immediate UI update on `/photos/:id` without reload | Passed |
| Security & Git | `.env` ignored by `.gitignore` and excluded from commits | Passed |
