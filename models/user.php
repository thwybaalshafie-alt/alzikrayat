<?php

require_once __DIR__ . '/../core/Model.php';

class User extends Model
{
    public function create($firstName, $lastName, $email, $password, $location = null, $description = null, $occupation = null)
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users 
                (first_name, last_name, email, password, location, description, occupation)
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param(
            "sssssss",
            $firstName,
            $lastName,
            $email,
            $hashedPassword,
            $location,
            $description,
            $occupation
        );

        return $stmt->execute();
    }
    public function findByEmail($email)
{
    $sql = "SELECT * FROM users WHERE email = ?";

    $stmt = $this->conn->prepare($sql);

    $stmt->bind_param("s", $email);

    $stmt->execute();

    return $stmt->get_result()->fetch_assoc();
}
public function countAll()
{
    $sql = "SELECT COUNT(*) AS total FROM users " ;
    $result = $this->conn->query($sql);
    return $result->fetch_assoc()['total'];
}

}

?>