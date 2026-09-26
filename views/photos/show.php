<div class="container py-4 max-w-4xl">
    <div class="mb-4">
        <a href="/alzikrayat/public/photos" class="text-decoration-none btn btn-light border shadow-sm">
            <i class="bi bi-arrow-left"></i> &larr; Back to Gallery
        </a>
    </div>

    <div class="card shadow-sm border-0 mb-5">
        <div class="card-header bg-white border-bottom-0 pt-4 pb-0 text-center">
            <h1 class="card-title fw-bold text-dark"><?php echo htmlspecialchars($photo['title']); ?></h1>
        </div>
        
        <div class="card-body text-center bg-light">
            <img src="/alzikrayat/public/images/uploads/<?php echo htmlspecialchars($photo['file_name']); ?>" 
                 class="img-fluid rounded shadow-sm" 
                 style="max-height: 70vh; object-fit: contain;" 
                 alt="<?php echo htmlspecialchars($photo['title']); ?>">
        </div>

        <div class="card-footer bg-white border-top-0 pb-4">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <p class="mb-1"><i class="bi bi-person-circle"></i> <strong>Author:</strong> <?php echo htmlspecialchars($photo['first_name'] . ' ' . $photo['last_name']); ?></p>
                    <p class="mb-2 text-muted small"><i class="bi bi-calendar"></i> <strong>Date:</strong> <?php echo htmlspecialchars($photo['date_time']); ?></p>
                    
                    <?php if (!empty($photo['description'])): ?>
                        <div class="mt-3 p-3 bg-light rounded">
                            <strong>Description:</strong><br>
                            <?php echo nl2br(htmlspecialchars($photo['description'])); ?>
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="col-md-4 text-md-end mt-3 mt-md-0">
                    <?php if (isset($_SESSION['user_id']) && $photo['user_id'] == $_SESSION['user_id']): ?>
                        <form action="/alzikrayat/public/photo/delete/<?php echo $photo['id']; ?>" method="POST" onsubmit="return confirm('Are you sure you want to delete this photo? This action cannot be undone.');">
                            <button type="submit" class="btn btn-danger shadow-sm">
                                <i class="bi bi-trash"></i> Delete Photo
                            </button>
                        </form>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <div class="card shadow-sm border-0">
        <div class="card-header bg-white">
            <h3 class="mb-0">Comments <span class="badge bg-secondary rounded-pill fs-6"><?php echo count($comments ?? []); ?></span></h3>
        </div>
        <div class="card-body">
            
            <?php if (isset($_SESSION['user_id'])): ?>
                <form action="/alzikrayat/public/comment/store" method="POST" id="commentForm" class="mb-5 needs-validation" novalidate>
                    <input type="hidden" name="photo_id" value="<?php echo $photo['id']; ?>">
                    <div class="form-floating mb-3">
                        <textarea class="form-control" name="comment" id="comment" placeholder="Write your comment..." style="height: 100px" required minlength="3" maxlength="500"></textarea>
                        <label for="comment">Write your comment...</label>
                        <div class="invalid-feedback">Comment must be between 3 and 500 characters.</div>
                    </div>
                    <button type="submit" class="btn btn-primary">Post Comment</button>
                </form>
            <?php else: ?>
                <div class="alert alert-info">
                    Please <a href="/alzikrayat/public/login" class="alert-link">login</a> to add a comment.
                </div>
            <?php endif; ?>

            <div class="comments-list">
                <?php if (!empty($comments)): ?>
                    <?php foreach ($comments as $comment): ?>
                        <div class="d-flex mb-4 p-3 bg-light rounded shadow-sm">
                            <div class="flex-shrink-0 me-3">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                                    <?php echo strtoupper(substr($comment['first_name'], 0, 1) . substr($comment['last_name'], 0, 1)); ?>
                                </div>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <h6 class="mb-0 fw-bold"><?php echo htmlspecialchars($comment['first_name'] . ' ' . $comment['last_name']); ?></h6>
                                    <small class="text-muted"><?php echo htmlspecialchars($comment['date_time']); ?></small>
                                </div>
                                <p class="mb-0"><?php echo nl2br(htmlspecialchars($comment['comment'])); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p class="text-muted text-center py-4">No comments yet. Be the first to comment!</p>
                <?php endif; ?>
            </div>
            
        </div>
    </div>
</div>

<script>
    (function () {
        'use strict'
        var form = document.getElementById('commentForm')
        if(form) {
            form.addEventListener('submit', function (event) {
                var commentField = document.getElementById('comment');
                if (!form.checkValidity() || commentField.value.trim().length < 3 || commentField.value.trim().length > 500) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        }
    })()
</script>