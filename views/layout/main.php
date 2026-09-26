<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Alzikrayat</title>
</head>

<body>
<?php 
session_start();
?>
    <header>
        <h1>Alzikrayat</h1>

        <nav>
            <a href="/alzikrayat/public/">Home</a>
            <a href="/alzikrayat/public/photos">Photos</a>
            <?php if 
            (isset($_SESSION['user_id']));?>
            <span> 
                welcome,<?php echo htmlspecialchars($_SESSION['user_name']);?>
            </span>
            <a href="/alzikrayat/public/logout">Logout</a>
            <?php else :?>
            <a href="/alzikrayat/public/login">Login</a>
            <a href="/alzikrayat/public/register">Register</a>
            <?php endif;?>
        </nav>
    </header>

    <hr>

    <main>

        <?php
        if (isset($content)) {
            echo $content;
        }
        ?>

    </main>

</body>

</html>