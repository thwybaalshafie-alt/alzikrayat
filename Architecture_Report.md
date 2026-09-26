# Architecture Report: Alzikrayat Web Application

## 1. Overview
Alzikrayat is built on a foundational understanding of modern software architecture. It implements a custom, lightweight MVC Software Framework from scratch, strictly adhering to the 3-Tier Architecture principles. This physical and logical separation prevents tangled logic (spaghetti code), ensures robust application security, and paves the way for easier maintainability.

## 2. 3-Tier Physical Architecture
The application maps physical bounds into logical responsibilities.

### 2.1 Presentation Tier (Client/Browser UI)
- **Role:** Handles the User Interface and User Experience.
- **Implementation:** Built via HTML5 and Bootstrap 5 CSS, encapsulated in `views/` components. 
- **Validation:** Implements immediate client-side constraints utilizing HTML5 constraints (e.g. `required`, `pattern`) and Vanilla JavaScript event listeners trapping form submission for invalid inputs.

### 2.2 Application / Business Tier (Core Server Logic)
- **Role:** Acts as the brain of the application—intercepting HTTP requests, parsing data, enforcing business rules, and interacting with the Data Tier.
- **Implementation:** Consists of the custom Regex `Router.php` engine, generic `Controller.php`, and specific implementations (`AuthController`, `PhotoController`, `HomeController`, `CommentController`).
- **Routing:** The Router matches incoming request URIs against registered expressions. Dynamic URL components are extracted (e.g., `/photo/12`) and dispatched as parameters dynamically via PHP's `call_user_func_array()`.

### 2.3 Data Tier (Persistent Database)
- **Role:** Safely stores and orchestrates state data.
- **Implementation:** Structured in `models/` where Entities (`User`, `Photo`, `Comment`) extend the base `Model.php` which establishes a singleton-like `mysqli` connection instantiated from `config/database.php`.
- **Integrity:** Strictly relies on manual SQL queries implementing `bind_param` (parameterized queries) preventing SQL injection risks completely bypassing standard ORMs like Eloquent or SQLAlchemy.

## 3. Database Normalization & Security
The database represents the Single Source of Truth (SSOT). Three distinct schemas govern the persistence:

- **Users:** Implements `AUTO_INCREMENT` Primary Keys. Passwords are irreversibly hashed via `password_hash()` utilizing the Bcrypt algorithm before database insertion.
- **Photos & Comments:** Enforce referential integrity via `FOREIGN KEY` definitions tracking back to the user. Using `ON DELETE CASCADE`, if a user is purged, their respective photos and comments are inherently removed without manual controller intervention.
- **XSS & Injection Protection:** All database interactions funnel through parameterized execution. Upon returning payload to the client interface, `htmlspecialchars()` comprehensively cleans data rendering any injected malicious scripts dormant.

## 4. Conclusion
By omitting standardized production frameworks (e.g. Laravel), the Alzikrayat project successfully replicates underlying mechanics—from Regex dispatch mapping to raw Model construction—achieving the robust MVC 3-Tier objective.
