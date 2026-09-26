<?php

require_once __DIR__ . '/../core/Model.php';

class Photo extends Model
{
    public function create($userId, $fileName, $title, $description = null)
    {
        $sql = "INSERT INTO photos
                (user_id, file_name, title, description)
                VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param(
            "isss",
            $userId,
            $fileName,
            $title,
            $description
        );

        return $stmt->execute();
    }

    public function getAll()
    {
        $sql = "SELECT photos.*, users.first_name, users.last_name
                FROM photos
                INNER JOIN users ON photos.user_id = users.id
                ORDER BY photos.date_time DESC";

        return $this->conn->query($sql);
    }

    public function countAll()
    {
        $sql ="SELECT COUNT(*) AS total FROM photos ";

        $result = $this->conn->query($sql) ;

        return $result->fetch_assoc()['total'];
    }

    public function getRecentPhotos()
    {
        $sql = "SELECT photos.*,users.first_name,users.last_name FROM photos 
        INNER JOIN users ON photos.user_id = users.id
        ORDER BY photos.date_time DESC LIMIT 3" ;
        $result = $this->conn->query($sql);
        return $result ;

    }

    public function findById($id)
    {
        $sql = "SELECT photos.*, users.first_name, users.last_name
                FROM photos
                INNER JOIN users ON photos.user_id = users.id
                WHERE photos.id = ?";

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param("i", $id);

        $stmt->execute();

        return $stmt->get_result()->fetch_assoc();
    }

    public function delete($id ,$userId){
        $sql = "DELETE FROM photos WHERE id = ? AND user_id = ?" ;
        $stmt = $this->conn->prepare($sql) ;
        $stmt->bind_param("ii",$id,$userId) ;
        return $stmt->execute();
     }
}

?>