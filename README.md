# Alzikrayat (MERN Edition)

Alzikrayat is a full-stack photo sharing web application built with the MERN stack (MongoDB, Express.js, React, and Node.js). It rebuilds the earlier PHP MVC version into a client-server REST architecture with a React frontend, an Express backend, MongoDB/Mongoose storage, and AI photo/comment helpers powered by Z.AI (`glm-4.6v-flash`).

Note: The original PHP version is kept on the `master` branch, while the MERN version is on `mern-edition`.

## Features

- **User Authentication:** Register and login endpoints with `bcryptjs` password hashing, Joi input validation, React `AuthContext` + `localStorage` session persistence, and dynamic navbar status (`Hi <firstName>` / `Logout` when signed in, `Please Login` when signed out).
- **Home Page & Responsive Gallery:** Landing page with community stats and recent photos, plus a gallery page supporting 3-column grid, 4-column grid, and list view layouts, search, and AI tag filtering.
- **Photo Upload & Owner-Only Deletion:** Logged-in users can upload images (stored in `server/uploads/` via Multer with metadata in MongoDB). Deleting a photo checks ownership on the server before removing the database record, related comments, and file from disk.
- **Photo Detail & Live Comments:** Dedicated `/photos/:id` route using React Router `useParams()` showing the full image, metadata, and comments. New comments appear immediately without refreshing the page.
- **AI Features (Z.AI `glm-4.6v-flash`):** Auto-tagging and visual captions for uploaded photos, optional title/description suggestions on upload, and comment summarization on the photo detail page.

## Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Axios, custom responsive CSS
- **Backend:** Node.js, Express.js, Joi, Multer, bcryptjs, dotenv, cors
- **Database:** MongoDB with Mongoose ODM
- **AI API:** Z.AI OpenAI-compatible Chat/Vision API (`glm-4.6v-flash`)

## Project Structure

```text
alzikrayat/
├── .gitignore
├── README.md
├── Project_Report.md
├── server/
│   ├── models/          # User.js, Photo.js, Comment.js
│   ├── routes/          # authRoutes.js, photoRoutes.js, commentRoutes.js, aiRoutes.js
│   ├── controllers/     # authController.js, photoController.js, commentController.js, aiController.js
│   ├── middleware/      # validation.js, upload.js, errorHandler.js
│   ├── services/        # aiService.js
│   ├── seed-assets/     # Sample images for seeding
│   ├── uploads/         # Uploaded photo files (ignored by git)
│   ├── seed.js          # Demo data seeder
│   ├── server.js        # Express entry point
│   └── .env.example     # Environment variable template
└── client/
    ├── index.html
    ├── vite.config.js   # Proxies /api and /uploads to localhost:5000
    └── src/
        ├── components/  # Navbar, Footer, PhotoCard, CommentForm, CommentList,
        │                # LoginForm, RegisterForm, UploadForm, AiSummaryBox,
        │                # LoadingSpinner, ErrorAlert
        ├── pages/       # Home, Gallery, PhotoDetail, UploadPhoto, LoginRegister
        ├── context/     # AuthContext.jsx
        ├── services/    # api.js
        ├── styles/      # index.css
        ├── App.jsx
        └── main.jsx
```

## Setup & Installation

### 1. Prerequisites
- Node.js (v18 or later) and npm
- MongoDB (local MongoDB service or MongoDB Atlas)

### 2. Environment Variables
Create a `.env` file inside `server/` based on `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/alzikrayat
# Or use a MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/alzikrayat?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173

ZAI_API_KEY=your_zai_api_key_here
ZAI_BASE_URL=https://api.z.ai/api/paas/v4
ZAI_MODEL=glm-4.6v-flash
```

`.env` is listed in `.gitignore` so credentials are never committed to Git.

### 3. Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 4. Seed Demo Data (Optional)

```bash
cd server
npm run seed
```

This adds 2 demo users, 4 sample photos, and 6 comments:
- `thwyba@alzikrayat.demo` / `Demo@1234`
- `omar@alzikrayat.demo` / `Demo@1234`

## Running the Project Locally

Start the backend and frontend in two separate terminals:

**Backend (port 5000):**
```bash
cd server
npm run dev
```

**Frontend (port 5173):**
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser. Vite forwards `/api` and `/uploads` requests to `http://localhost:5000`.

## Main API Endpoints

| Method | Route | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check API and database status |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email and password |
| `GET` | `/api/photos` | Fetch all photos (supports `?search=` and `?tag=`) |
| `GET` | `/api/photos/stats` | Get total photos, users, and comments counts |
| `GET` | `/api/photos/:id` | Get a photo with its owner details and comments |
| `POST` | `/api/photos` | Upload a new photo (`multipart/form-data`) |
| `DELETE` | `/api/photos/:id` | Delete own photo (verified on server) |
| `GET` | `/api/photos/:id/comments` | List comments for a photo |
| `POST` | `/api/photos/:id/comments` | Add a comment to a photo |
| `POST` | `/api/ai/photos/:id/analyze` | Generate AI tags and caption for a photo |
| `POST` | `/api/ai/photos/:id/summarize-comments` | Summarize comments on a photo |
| `POST` | `/api/ai/suggest-metadata` | Suggest title, description, and tags before upload |
