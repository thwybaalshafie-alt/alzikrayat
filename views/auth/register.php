<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Register - Alzikrayat</title>
</head>

<body>

    <h2>Create an Account</h2>

    <form action="/alzikrayat/public/register" method="POST">

        <label>First Name:</label>
        <br>
        <input type="text" name="first_name" required>
        <br><br>

        <label>Last Name:</label>
        <br>
        <input type="text" name="last_name" required>
        <br><br>

        <label>Email:</label>
        <br>
        <input type="email" name="email" required>
        <br><br>

        <label>Password:</label>
        <br>
        <input type="password" name="password" required>
        <br><br>

        <label>Location:</label>
        <br>
        <input type="text" name="location">
        <br><br>

        <label>Description:</label>
        <br>
        <textarea name="description"></textarea>
        <br><br>

        <label>Occupation:</label>
        <br>
        <input type="text" name="occupation">
        <br><br>

        <button type="submit">Register</button>

    </form>

</body>

</html>