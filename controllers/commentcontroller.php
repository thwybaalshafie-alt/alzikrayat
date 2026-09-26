<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/Comment.php';

class CommentController extends Controller
{
    public function store()
    {
        session_start();

        if (!isset($_SESSION['user_id'])) {
            header("Location: /alzikrayat/public/login");
            exit;
        }

        $photoId = $_POST['photo_id'] ?? null;
        $comment = trim($_POST['comment'] ?? '');
        $userId = $_SESSION['user_id'];

        if (!$photoId || $comment === '') {
            echo "Invalid comment data";
            return;
        }

        if (strlen($comment)<3){
            echo "Comment must be at least 3 characters.";
            return ;
        }
        
        if (strlen($comment)>500){
            echo "Comment must not exceed 500 characters.";
            return ;
        }


        $commentModel = new Comment();

        $commentModel->create(
            $photoId,
            $userId,
            $comment
        );

        header("Location: /alzikrayat/public/photo/" . $photoId);
        exit;
    }
}

?>