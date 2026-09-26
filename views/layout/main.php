<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alzikrayat</title>
    <!-- Bootstrap CSS -->
    <link href="/alzikrayat/public/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { padding-top: 70px; background-color: #f8f9fa; font-family: 'Inter', sans-serif; }
        .navbar-brand { font-weight: bold; font-size: 1.5rem; }
        .hero-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; border-radius: 10px; margin-bottom: 2rem; }
    </style>
</head>
<body>
<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="/alzikrayat/public/">Alzikrayat</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="/alzikrayat/public/">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="/alzikrayat/public/photos">Photos</a></li>
                    <li class="nav-item"><a class="nav-link" href="#about">About Us</a></li>
                </ul>
                <ul class="navbar-nav">
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <li class="nav-item"><span class="navbar-text me-3 text-white">Hi, <?php echo htmlspecialchars($_SESSION['user_name']); ?></span></li>
                        <li class="nav-item"><a class="btn btn-outline-light" href="/alzikrayat/public/logout">Logout</a></li>
                    <?php else: ?>
                        <li class="nav-item me-2"><span class="navbar-text">Please Login</span></li>
                        <li class="nav-item"><a class="nav-link" href="/alzikrayat/public/login">Login</a></li>
                        <li class="nav-item"><a class="nav-link" href="/alzikrayat/public/register">Register</a></li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container">
        <?php
        if (isset($content)) {
            echo $content;
        }
        ?>
    </main>

    <footer class="bg-dark text-white text-center py-3 mt-5">
        <p class="mb-0">&copy; <?php echo date('Y'); ?> Alzikrayat Photo Sharing. All rights reserved.</p>
    </footer>

    <script src="/alzikrayat/public/js/bootstrap.bundle.min.js"></script>
</body>
</html>