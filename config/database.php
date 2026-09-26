<?php

$host = "localhost";
$dbName = "alzikrayat";
$userName = "root";
$password = "";

$conn = new mysqli($host, $userName, $password, $dbName);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

return $conn;

?>