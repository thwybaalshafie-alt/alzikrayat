# Alzikrayat - Photo Sharing Application

Alzikrayat is a custom, fully hand-written MVC-based web application designed for sharing memories. Built entirely from scratch using PHP, this project avoids any third-party backend frameworks or ORMs, focusing on mastering foundational web application mechanics, strict architectural separation, and manual routing.

## Features

- **Custom Manual Router:** Hand-written Regex-based routing engine matching dynamic parameters (e.g. `/photo/12`).
- **MVC & 3-Tier Architecture:** Strict physical logical separation of Concerns (Presentation, Application Logic, and Data Tiers).
- **Session-Based Authentication:** Secure user registration, Bcrypt password hashing, session-based login, and a 7-day "Last Login" cookie.
- **Dynamic Gallery & Grids:** A toggleable user gallery (3-column, 4-column, and List-view) with interactive UI powered by modern CSS & JS.
- **Photo Uploads & Permissions:** File uploads physically stored with metadata inserted directly into a highly normalized MySQL database.
- **Secure Architecture:** Complete protection against SQL Injection via Parameterized Queries and XSS via output sanitization.

## Tech Stack

- **Backend:** Pure PHP (No frameworks)
- **Database:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5

## Installation

1. **Clone the Repository**
2. **Setup the Database:**
   Import `database.sql` into a MySQL server to create the `alzikrayat` database schema.
3. **Configure Database Settings:**
   Ensure `config/database.php` has the correct `localhost`, `root` credentials for your local execution environment (e.g., XAMPP/MAMP).
4. **Run the Application:**
   Point your local server path to `/alzikrayat/public/` so that `index.php` processes all incoming requests. 

## Requirements Completed
All submission requirements completed:
- Hand-written Regex routing engine.
- Complete 3-tier MVC architecture.
- Bcrypt hashing, robust Session Auth & Last Login Cookie.
- Normalized Schema with Cascade Deletion constraints.
- Three-layer form validation (HTML5, JS, Server).
- Responsive UI with Grid Styles.
- Thorough Documentation.
