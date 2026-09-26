<div class="row justify-content-center mt-5">
    <div class="col-md-6 col-lg-4">
        <div class="card shadow border-0 rounded-lg">
            <div class="card-header bg-primary text-white text-center py-3">
                <h3 class="mb-0">Login</h3>
            </div>
            <div class="card-body p-4">
                <?php if (isset($_COOKIE['last_login'])): ?>
                    <div class="alert alert-info text-center small mb-4">
                        Last login from this computer was <?php echo htmlspecialchars($_COOKIE['last_login']); ?>
                    </div>
                <?php endif;?>

                <form id="loginForm" action="/alzikrayat/public/login" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <div class="invalid-feedback">Please enter a valid email address.</div>
                    </div>

                    <div class="mb-4">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required minlength="4">
                        <div class="invalid-feedback">Please enter your password.</div>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Login</button>
                    </div>
                </form>
                
                <div class="text-center mt-4">
                    <p class="mb-0">Don't have an account? <a href="/alzikrayat/public/register" class="text-decoration-none">Register</a></p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Client-side validation
    (function () {
        'use strict'
        var form = document.getElementById('loginForm')
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })()
</script>