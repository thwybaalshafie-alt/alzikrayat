<div class="row justify-content-center mt-5 mb-5">
    <div class="col-md-8 col-lg-6">
        <div class="card shadow border-0 rounded-lg">
            <div class="card-header bg-primary text-white text-center py-3">
                <h3 class="mb-0">Upload New Photo</h3>
            </div>
            <div class="card-body p-4">
                <form id="uploadForm" action="/alzikrayat/public/photo/store" method="POST" enctype="multipart/form-data" novalidate>
                    
                    <div class="mb-4">
                        <label for="photos" class="form-label fw-bold">Choose Photos:</label>
                        <input type="file" class="form-control" id="photos" name="photos[]" accept="image/*" multiple required>
                        <div class="invalid-feedback">Please select at least one photo to upload.</div>
                        <div class="form-text">You can select multiple photos at once. Maximum 5MB per photo.</div>
                    </div>

                    <div class="mb-3">
                        <label for="title" class="form-label fw-bold">Title:</label>
                        <input type="text" class="form-control" id="title" name="title" required minlength="3" maxlength="100" placeholder="Give your photo a title">
                        <div class="invalid-feedback">Title must be between 3 and 100 characters.</div>
                    </div>

                    <div class="mb-4">
                        <label for="description" class="form-label fw-bold">Description (Optional):</label>
                        <textarea class="form-control" id="description" name="description" rows="4" maxlength="500" placeholder="Tell a story about this photo..."></textarea>
                        <div class="form-text">Maximum 500 characters.</div>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="bi bi-cloud-upload"></i> Upload Photo
                        </button>
                        <a href="/alzikrayat/public/photos" class="btn btn-outline-secondary">
                            Cancel & Back to Gallery
                        </a>
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>

<script>
    // Client-side validation
    (function () {
        'use strict'
        var form = document.getElementById('uploadForm');
        form.addEventListener('submit', function (event) {
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const photos = document.getElementById('photos').files;

            let isValid = form.checkValidity();

            if (photos.length === 0) {
                isValid = false;
            }

            if (title.length < 3 || title.length > 100) {
                isValid = false;
            }

            if (description.length > 500) {
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false)
    })()
</script>