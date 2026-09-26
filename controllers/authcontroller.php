<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/User.php';

class AuthController extends Controller
{
    public function register()
{
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $firstName = trim($_POST['first_name'] ?? '');
        $lastName = trim($_POST['last_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $location = trim($_POST['location'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $occupation = trim($_POST['occupation'] ?? '');

        if ($firstName === '' || $lastName === '' || $email === '' || $password === '') {
            echo "Please fill in all required fields.";
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo "Invalid email address.";
            return;
        }

        $userModel = new User();

        if (!$userModel->create(
            $firstName,
            $lastName,
            $email,
            $password,
            $location,
            $description,
            $occupation
        )) {
            echo "Registration failed. Email may already exist.";
            return;
        }

        header("Location: /alzikrayat/public/login");
        exit;
    }

    $this->view('auth/register');
}

    public function login()
{
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if ($email === '' || $password === '') {
            echo "Please enter email and password.";
            return;
        }

        $userModel = new User();

        $user = $userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            echo "Invalid email or password.";
            return;
        }

        session_start();

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
        setcookie (
            "last_login",
            date("Y-m-d H:i:s"),
            time() + (7*24*60*60),
         "/"
        );

        header("Location: /alzikrayat/public/photos");
        exit;
    }

    $this->view('auth/login');
}

    public function logout()
    {
        session_start();

        session_unset();
        session_destroy();

        header("Location: /alzikrayat/public/");
        exit;
    }
}

?>