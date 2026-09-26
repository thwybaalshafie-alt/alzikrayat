<div class="d-flex flex-wrap justify-content-between align-items-center mb-4 mt-3 border-bottom pb-3">
    <h1 class="mb-0 fw-bold">Photo Gallery</h1>
    <div class="btn-group shadow-sm" role="group" aria-label="Gallery layout controls">
        <button type="button" class="btn btn-outline-primary active" onclick="changeGallery('three', this)">3 Columns</button>
        <button type="button" class="btn btn-outline-primary" onclick="changeGallery('four', this)">4 Columns</button>
        <button type="button" class="btn btn-outline-primary" onclick="changeGallery('list', this)">List View</button>
    </div>
</div>

<div class="row g-4 gallery-grid mb-5">
    <?php if ($photos && $photos->num_rows > 0): ?>
        <?php while ($photo = $photos->fetch_assoc()): ?>
            <div class="photo-item col-12 col-md-6 col-lg-4 transition-all">
                <div class="card h-100 shadow-sm border-0 photo-card">
                    <a href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>">
                        <img src="/alzikrayat/public/images/uploads/<?php echo htmlspecialchars($photo['file_name']); ?>" 
                             class="card-img-top photo-img" 
                             style="height: 250px; object-fit: cover; transition: transform 0.3s;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'"
                             alt="<?php echo htmlspecialchars($photo['title']); ?>">
                    </a>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-truncate"><?php echo htmlspecialchars($photo['title']); ?></h5>
                        <?php if (!empty($photo['description'])): ?>
                            <p class="card-text text-muted small photo-desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                <?php echo nl2br(htmlspecialchars($photo['description'])); ?>
                            </p>
                        <?php endif; ?>
                        <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                            <small class="text-muted"><i class="bi bi-person"></i> <?php echo htmlspecialchars($photo['first_name'] . ' ' . $photo['last_name']); ?></small>
                            <a href="/alzikrayat/public/photo/<?php echo $photo['id']; ?>" class="btn btn-primary btn-sm">View</a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <div class="col-12 text-center py-5 bg-white rounded shadow-sm">
            <h4 class="text-muted mb-3">No photos available yet.</h4>
            <?php if (isset($_SESSION['user_id'])): ?>
                <a href="/alzikrayat/public/photo/upload" class="btn btn-primary">Be the first to upload!</a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</div>

<style>
    .transition-all { transition: all 0.4s ease; }
    .list-view-card { flex-direction: row !important; }
    .list-view-img { width: 30% !important; height: 100% !important; min-height: 200px; }
    .list-view-body { width: 70% !important; }
    .list-view-desc { -webkit-line-clamp: 4 !important; }
</style>

<script>
function changeGallery(type, btn) {
    const gallery = document.querySelector('.gallery-grid');
    const cards = gallery.querySelectorAll('.photo-item');
    const innerCards = gallery.querySelectorAll('.card');
    const images = gallery.querySelectorAll('.photo-img');
    const bodies = gallery.querySelectorAll('.card-body');
    const descs = gallery.querySelectorAll('.photo-desc');
    
    // Update active button state
    document.querySelectorAll('.btn-group .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (type === 'three') {
        cards.forEach(card => card.className = 'photo-item col-12 col-md-6 col-lg-4 transition-all');
        removeListStyles(innerCards, images, bodies, descs);
    } else if (type === 'four') {
        cards.forEach(card => card.className = 'photo-item col-12 col-md-6 col-lg-3 transition-all');
        removeListStyles(innerCards, images, bodies, descs);
    } else if (type === 'list') {
        cards.forEach(card => card.className = 'photo-item col-12 transition-all');
        // Add list styles
        innerCards.forEach(c => c.classList.add('list-view-card'));
        images.forEach(img => img.classList.add('list-view-img'));
        bodies.forEach(b => b.classList.add('list-view-body'));
        descs.forEach(d => { if(d) d.classList.add('list-view-desc'); });
    }
}

function removeListStyles(cards, images, bodies, descs) {
    cards.forEach(c => c.classList.remove('list-view-card'));
    images.forEach(img => img.classList.remove('list-view-img'));
    bodies.forEach(b => b.classList.remove('list-view-body'));
    descs.forEach(d => { if(d) d.classList.remove('list-view-desc'); });
}
</script>