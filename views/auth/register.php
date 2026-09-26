<div class="row justify-content-center mt-5">
    <div class="col-md-8 col-lg-6">
        <div class="card shadow border-0 rounded-lg">
            <div class="card-header bg-success text-white text-center py-3">
                <h3 class="mb-0">Create an Account</h3>
            </div>
            <div class="card-body p-4">
                <form id="registerForm" action="/alzikrayat/public/register" method="POST" novalidate>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="first_name" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="first_name" name="first_name" required maxlength="50" pattern="[A-Za-z]+">
                            <div class="invalid-feedback">Please enter your first name (letters only).</div>
                        </div>
                        <div class="col-md-6 mt-3 mt-md-0">
                            <label for="last_name" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="last_name" name="last_name" required maxlength="50" pattern="[A-Za-z]+">
                            <div class="invalid-feedback">Please enter your last name (letters only).</div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <div class="invalid-feedback">Please enter a valid email address.</div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required minlength="6">
                        <div class="invalid-feedback">Please enter a password with at least 6 characters.</div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="location" class="form-label">Location (Optional)</label>
                            <input type="text" class="form-control" id="location" name="location" maxlength="100">
                        </div>
                        <div class="col-md-6 mt-3 mt-md-0">
                            <label for="occupation" class="form-label">Occupation (Optional)</label>
                            <input type="text" class="form-control" id="occupation" name="occupation" maxlength="100">
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="description" class="form-label">Description / Bio (Optional)</label>
                        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-success btn-lg">Register</button>
                    </div>
                </form>
                
                <div class="text-center mt-4">
                    <p class="mb-0">Already have an account? <a href="/alzikrayat/public/login" class="text-decoration-none text-success">Login here</a></p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Client-side validation
    (function () {
        'use strict'
        var form = document.getElementById('registerForm')
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })()
</script>