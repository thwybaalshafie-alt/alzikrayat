<!-- Hero Section -->
<section class="hero-section text-center mb-5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 5rem 2rem; border-radius: 10px;">
    <h1 class="display-4 fw-bold">Share Your Memories</h1>
    <p class="lead mt-3 mb-4">Alzikrayat is a photo sharing application where you can upload, share and explore memorable moments.</p>
    <div>
        <a class="btn btn-light btn-lg px-4 me-2 fw-semibold" href="/alzikrayat/public/photos">View Gallery</a>
        <?php if (isset($_SESSION['user_id'])): ?>
            <a class="btn btn-outline-light btn-lg px-4 fw-semibold" href="/alzikrayat/public/photo/upload">Upload Photo</a>
        <?php else: ?>
            <a class="btn btn-outline-light btn-lg px-4 fw-semibold" href="/alzikrayat/public/register">Get Started</a>
        <?php endif; ?>
    </div>
</section>

<!-- Stats Section -->
<section class="row text-center mb-5">
    <div class="col-md-6 mb-3">
        <div class="card shadow-sm border-0 bg-white p-4 h-100">
            <h3 class="display-5 text-primary fw-bold"><?php echo $totalPhotos; ?></h3>
            <p class="text-muted mb-0 fs-5">Photos Shared</p>
        </div>
    </div>
    <div class="col-md-6 mb-3">
        <div class="card shadow-sm border-0 bg-white p-4 h-100">
            <h3 class="display-5 text-primary fw-bold"><?php echo $totalUsers; ?></h3>
            <p class="text-muted mb-0 fs-5">Registered Users</p>
        </div>
    </div>
</section>

<!-- Recent Photos Section -->
<section class="recent-photos mb-5">
    <h2 class="text-center mb-4 fw-bold border-bottom pb-2">Recent Photos</h2>
    <div class="row g-4">
        <?php if ($recentPhotos && $recentPhotos->num_rows > 0): ?>
            <?php while ($photo = $recentPhotos->fetch_assoc()): ?>
                <div class="col-12 col-sm-6 col-lg-4">
                    <div class="card h-100 shadow-sm border-0 photo-card">
                        <a href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>">
                            <img src="/alzikrayat/public/images/uploads/<?php echo htmlspecialchars($photo['file_name']); ?>" 
                                 class="card-img-top" 
                                 alt="<?php echo htmlspecialchars($photo['title']); ?>" 
                                 style="height: 250px; object-fit: cover; transition: transform 0.3s;"
                                 onmouseover="this.style.transform='scale(1.03)'"
                                 onmouseout="this.style.transform='scale(1)'"
                            >
                        </a>
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-truncate"><?php echo htmlspecialchars($photo['title']); ?></h5>
                            <p class="card-text text-muted small">
                                By: <?php echo htmlspecialchars($photo['first_name'] . ' ' . $photo['last_name']); ?>
                            </p>
                            <a href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>" class="btn btn-outline-primary btn-sm w-100">View Details</a>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <div class="col-12 text-center">
                <p class="text-muted">No photos available yet.</p>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- About Section -->
<section id="about" class="about text-center bg-white p-5 rounded shadow-sm border-0">
    <h2 class="mb-4 fw-bold">Keep the moments that matter.</h2>
    <p class="lead text-muted mx-auto" style="max-width:700px;">
        Alzikrayat is a place to share your memories, discover moments from others, and keep the photos that tell your story.
    </p>
    <p class="text-muted mx-auto" style="max-width:700px;">
        Upload your photos, explore shared memories, and connect through comments.
    </p>
</section>