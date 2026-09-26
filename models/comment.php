<?php

require_once __DIR__ . '/../core/Model.php';

class Comment extends Model
{
    public function create($photoId, $userId, $comment)
    {
        $sql = "INSERT INTO comments
                (photo_id, user_id, comment)
                VALUES (?, ?, ?)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param(
            "iis",
            $photoId,
            $userId,
            $comment
        );

        return $stmt->execute();
    }

    public function getByPhotoId($photoId)
    {
        $sql = "SELECT comments.*, users.first_name, users.last_name
                FROM comments
                INNER JOIN users ON comments.user_id = users.id
                WHERE comments.photo_id = ?
                ORDER BY comments.date_time ASC";

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param("i", $photoId);

        $stmt->execute();

        $result = $stmt->get_result();

        return
        $result->fetch_all(MYSQLI_ASSOC);
    }
}

?>