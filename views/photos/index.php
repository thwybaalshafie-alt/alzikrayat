<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href ="/alzikrayat/public/css/bootstrap.min.css">

    <title>Photos - Alzikrayat</title>

    <!-- <style> 
        .gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .photo-card {
            border: 1px solid #ccc;
            padding: 10px;
        }

        .photo-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
    </style> -->
</head>

<body>

    <div class="container py-4">

    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">

        <h1 class="mb-0">
            Photo Gallery
        </h1>

        <div class="d-flex flex-wrap gap-2">

            <a href="/alzikrayat/public/" class="btn btn-outline-primary">
                Home
            </a>

            <?php if (isset($_SESSION['user_id'])): ?>

                <span class="btn btn-light">
                    Hi <?php echo htmlspecialchars($_SESSION['user_name']); ?>
                </span>

                <a href="/alzikrayat/public/photo/upload" class="btn btn-primary">
                    Upload New Photo
                </a>

                <a href="/alzikrayat/public/logout" class="btn btn-outline-danger">
                    Logout
                </a>

            <?php else: ?>

                <a href="/alzikrayat/public/login" class="btn btn-primary">
                    Please Login
                </a>

            <?php endif; ?>

        </div>

    </div>

    <div class="d-flex justify-content-end gap-2 mb-4">

    <button
        type="button"
        class="btn btn-outline-primary"
        onclick="changeGallery('three')"
    >
        3 Columns
    </button>

    <button
        type="button"
        class="btn btn-outline-primary"
        onclick="changeGallery('four')"
    >
        4 Columns
    </button>

    <button
        type="button"
        class="btn btn-outline-primary"
        onclick="changeGallery('list')"
    >
        List
    </button>

</div>

    <div class="row g-4 gallery-grid">

    <?php if ($photos && $photos->num_rows > 0): ?>

        <?php while ($photo = $photos->fetch_assoc()): ?>

            <div class="photo-item col-12 col-md-6 col-lg-4">

                <div class="card h-100 shadow-sm">

                    <a href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>">
                        <img
                            src="/alzikrayat/public/images/uploads/<?php echo htmlspecialchars($photo['file_name']); ?>"
                            class="card-img-top"
                            style="height: 300px; object-fit: contain; background-color: #f8f9fa;"
                            alt="<?php echo htmlspecialchars($photo['title']); ?>"
                        >
                    </a>

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title">
                            <?php echo htmlspecialchars($photo['title']); ?>
                        </h5>

                        <?php if (!empty($photo['description'])): ?>

                            <p class="card-text">
                                <?php echo nl2br(htmlspecialchars($photo['description'])); ?>
                            </p>

                        <?php endif; ?>

                        <p class="text-muted">
                            By:
                            <?php echo htmlspecialchars(
                                $photo['first_name'] . ' ' . $photo['last_name']
                            ); ?>
                        </p>

                        <a
                            href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>"
                            class="btn btn-primary mt-auto"
                        >
                            View Details
                        </a>

                    </div>

                </div>

            </div>

        <?php endwhile; ?>

    <?php else: ?>

        <div class="col-12">
            <p class="text-center">
                No photos available yet.
            </p>
        </div>

    <?php endif; ?>

</div>

    </div>
        </div>
        <script>
function changeGallery(type) {

    const gallery = document.querySelector('.gallery-grid');
    const cards = gallery.querySelectorAll('.photo-item');

    if (type === 'three') {
        cards.forEach(card => {
            card.className = 'photo-item col-12 col-md-6 col-lg-4';
        });
    }

    if (type === 'four') {
        cards.forEach(card => {
            card.className = 'photo-item col-12 col-md-6 col-lg-3';
        });
    }

    if (type === 'list') {
        cards.forEach(card => {
            card.className = 'photo-item col-12';
        });
    }
}
</script>
</body>

</html>