<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login - Alzikrayat</title>
</head>

<body>

    <h2>Login</h2>
    <?php if (isset($_COOKIE['last_login'])): ?>
        <p>
            last login :
            <?php echo 
            htmlspecialchars($_COOKIE['last_login']); ?>
        </p>
     <?php endif;?>

    <form action="/alzikrayat/public/login" method="POST">

        <label>Email:</label>
        <br>
        <input type="email" name="email" required>
        <br><br>

        <label>Password:</label>
        <br>
        <input type="password" name="password" required>
        <br><br>

        <button type="submit">Login</button>

    </form>

    <p>
        Don't have an account?
        <a href="/alzikrayat/public/register">Register</a>
    </p>

</body>

</html>