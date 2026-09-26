<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
     content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href ="/alzikrayat/public/css/bootstrap.min.css">

    <title>Alzikrayat - Home</title>

    <style>
        :root {
            --primary-color: #6c63ff;
            --secondary-color: #f5f3ff;
            --background-color: #ffffff;
            --text-color: #333333;
            --muted-text: #777777;
            --card-color: #ffffff;
            --border-color: #e5e5e5;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
        }

        /* Navbar */

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 7%;
            border-bottom: 1px solid var(--border-color);
            background-color: var(--card-color);
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
        }

        .nav-links {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-color);
        }

        .nav-links a:hover {
            color: var(--primary-color);
        }

        /* Hero */

        .hero {
            min-height: 500px;
            padding: 80px 7%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 50px;
            background-color: var(--secondary-color);
        }

        .hero-text {
            max-width: 550px;
        }

        .hero h1 {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .hero h1 span {
            color: var(--primary-color);
        }

        .hero p {
            font-size: 18px;
            line-height: 1.7;
            color: var(--muted-text);
        }

        .hero-buttons {
            margin-top: 30px;
        }

        .button {
            display: inline-block;
            padding: 12px 22px;
            margin-right: 10px;
            border-radius: 8px;
            text-decoration: none;
            background-color: var(--primary-color);
            color: white;
        }

        .button.secondary {
            background-color: white;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }

        .hero-image {
            width: 400px;
            height: 300px;
            border-radius: 20px;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-color);
        }

        .hero-image span {
            color: var(--muted-text);
        }

        .stats {
    padding: 50px 7%;
    display: flex;
    justify-content: center;
    gap: 30px;
    background-color: white;
}

.stat-card {
    width: 220px;
    padding: 30px;
    text-align: center;
    border: 1px solid var(--border-color);
    border-radius: 12px;
}

.stat-card h3 {
    font-size: 36px;
    margin: 0 0 10px;
    color: var(--primary-color);
}

.stat-card p {
    margin: 0;
    color: var(--muted-text);
}

        /* About */

        .about {
            padding: 100px 7%;
            text-align: center;
            background-color:
            var(--secondary-color);
        }

        .about h2 {
            max-width:700px;
            margin:0 auto 25px ;
            font-size: 42px;
            line-height: 1.2;
        }

        .about p {
            max-width: 650px;
            margin: 0 auto 15px ;
            line-height: 1.8;
            color: var(--muted-text);
            font-size : 17px;
        }

        /* Footer */

        footer {
            padding: 25px;
            text-align: center;
            background-color: var(--secondary-color);
            color: var(--muted-text);
        }

        /* Mobile */

        @media (max-width: 768px) {

            .navbar {
                flex-direction: column;
                gap: 15px;
            }

            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }

            .hero {
                flex-direction: column;
                text-align: center;
                padding: 60px 5%;
            }

            .hero h1 {
                font-size: 36px;
            }

            .hero-image {
                width: 100%;
                max-width: 400px;
            }
        }
    </style>
</head>

<body>

    <!-- Navbar -->

   <nav class="navbar navbar-expand-lg bg-white border-bottom">

    <div class="container-fluid px-4">

        <a
            class="navbar-brand fw-bold"
            href="/alzikrayat/public/"
        >
            Alzikrayat
        </a>

        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <div
            class="collapse navbar-collapse"
            id="mainNavbar"
        >

            <div class="navbar-nav ms-auto align-items-lg-center gap-lg-3">

                <a
                    class="nav-link"
                    href="/alzikrayat/public/"
                >
                    Home
                </a>

                <a
                    class="nav-link"
                    href="/alzikrayat/public/photos"
                >
                    Gallery
                </a>

                <?php if (isset($_SESSION['user_id'])): ?>

                    <span class="nav-link">
                        Hi <?php echo htmlspecialchars($_SESSION['user_name']); ?>
                    </span>

                    <a
                        class="nav-link"
                        href="/alzikrayat/public/photo/upload"
                    >
                        Upload
                    </a>

                    <a
                        class="nav-link"
                        href="/alzikrayat/public/logout"
                    >
                        Logout
                    </a>

                <?php else: ?>

                    <a
                        class="nav-link"
                        href="/alzikrayat/public/login"
                    >
                        Please Login
                    </a>

                    <a
                        class="nav-link"
                        href="/alzikrayat/public/register"
                    >
                        Register
                    </a>

                <?php endif; ?>

            </div>

        </div>

    </div>

</nav>

    <!-- Hero Section -->

    <section class="hero">

        <div class="hero-text">

            <h1>
                Share Your
                <span>Memories</span>
            </h1>

            <p>
                Alzikrayat is a photo sharing application
                where you can upload, share and explore
                memorable moments.
            </p>

            <div class="hero-buttons">

                <a
                    class="button"
                    href="/alzikrayat/public/photos"
                >
                    View Gallery
                </a>

                <?php if (isset($_SESSION['user_id'])): ?>

                    <a
                        class="button secondary"
                        href="/alzikrayat/public/photo/upload"
                    >
                        Upload Photo
                    </a>

                <?php else: ?>

                    <a
                        class="button secondary"
                        href="/alzikrayat/public/register"
                    >
                        Get Started
                    </a>

                <?php endif; ?>

            </div>

        </div>

        <div class="hero-image">

            <span>
                Your photo will appear here
            </span>

        </div>

    </section>

    <section class="stats">

    <div class="stat-card">

        <h3>
            <?php echo $totalPhotos; ?>
        </h3>

        <p>
            Photos Shared
        </p>

    </div>
    <div class ="stat-card" >
        <h3>
            <?php echo $totalUsers; ?>
        </h3>

        <p>
            Registered Users
        </p>

    </div>

     </section>

    <section class="recent-photos py-5">

    <div class="container">

        <h2 class="text-center mb-4">
            Recent Photos
        </h2>

        <div class="row g-4">

            <?php if ($recentPhotos && $recentPhotos->num_rows > 0): ?>

                <?php while ($photo = $recentPhotos->fetch_assoc()): ?>

                    <div class="col-12 col-sm-6 col-lg-4">

                        <div class="card h-100 shadow-sm">

                            <a href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>">

                                <img
                                    src="/alzikrayat/public/images/uploads/<?php echo htmlspecialchars($photo['file_name']); ?>"
                                    class="card-img-top"
                                    alt="<?php echo htmlspecialchars($photo['title']); ?>"
                                    style="height: 250px; object-fit: cover;"
                                >

                            </a>

                            <div class="card-body">

                                <h5 class="card-title">
                                    <?php echo htmlspecialchars($photo['title']); ?>
                                </h5>

                                <p class="card-text text-muted">
                                    By:
                                    <?php echo htmlspecialchars(
                                        $photo['first_name'] . ' ' . $photo['last_name']
                                    ); ?>
                                </p>

                                <a
                                    href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>"
                                    class="btn btn-primary"
                                >
                                    View Details
                                </a>

                            </div>

                        </div>

                    </div>

                <?php endwhile; ?>

            <?php else: ?>

                <p class="text-center">
                    No photos available yet.
                </p>

            <?php endif; ?>

        </div>

    </div>

</section>

    <!-- About Section -->

     <section class = "about py-5 text-center">

    <div class= "container text-center">

        <h2 class = "mb-4">Keep the moment that matter.</h2>

        <p class = "lead text-muted mx-outo" style = "max-width:700px;">
            Alzikrayat is a aplce to share your memoris,
            discover moments from other,
            and keep the photos that tell your story 
        </p>

        <P class = "text-muted mx-outo" style = "max-width:700px;" >
            Upload your photos,explore shared memories,and connect through comments
        </p>

            </div>
    </section>

    <!-- Footer -->

    <footer>

        <p>
            © 2026 Alzikrayat. All rights reserved.
        </p>

    </footer>
<scrpit scr ="alzikrayat/public/js/bootstrap.min.js">"></scrpit>
</body>

</html>