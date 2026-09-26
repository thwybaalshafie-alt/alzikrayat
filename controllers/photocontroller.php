<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/Photo.php';
require_once __DIR__ . '/../models/Comment.php';

class PhotoController extends Controller
{
    public function index()
    {
        session_start();
        if (!isset($_SESSION['user_id'])){
            header ("location:/alzikrayat/public/login");
              exit ;
        }
        $photoModel = new Photo();

        $photos = $photoModel->getAll();

        $this->view('photos/index', [
            'photos' => $photos
        ]);
    }
    public function uploadform() {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            header("location: /alzikrayat/public/login");
            exit ;
        }
        $this->view('photos/upload') ;
    }

   public function store()
    { 
        session_start();
         if (!isset($_SESSION['user_id']))
             { 
                header("Location: /alzikrayat/public/login"); 
                exit;
                 }
                  $title = trim($_POST['title'] ?? '');
                   $description = trim($_POST['description'] ?? ''); 
                   $userId = $_SESSION['user_id']; 
                   if (strlen($title) < 3 || strlen($title) > 100) {
                    echo "Title must be between 3 and 100 characters.";
                    return ;
                    }
                    if (strlen($description) > 500) {
                        echo "Description must not exceed 500 characters.";
                        return;
                        }
                   if ($title === '' || !isset($_FILES['photos']))
                     { 
                        echo "Please select photos and enter a title.";
                         return;
                          }
                           $allowedTypes = [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ];
                            $photoModel = new Photo();
                             $files = $_FILES['photos']; 
                             for ($i = 0; $i < count($files['name']); $i++)
                                 {
                                     if ($files['error'][$i] !== UPLOAD_ERR_OK)
                              { 
                                echo "One of the photos failed to upload.";
                                 return;
                                 }
                                  if (!in_array($files['type'][$i], $allowedTypes))
                                     {
                                         echo "Invalid image type."; 
                                         return;
                                          } 
                                          $maxSize = 5*1024 *1024 ;
                                          if ($files['size'][$i]>$maxSize){
                                            echo "Each photo must be less than 5 MB.";
                                            return ;
                                          }
                                          $imageInfo = getimagesize($files['tmp_name'][$i]);
                                          if ($imageInfo === false){
                                            echo "The upload file is not a valid image." ;
                                            return ;
                                        
                                          }
                                          $extension = strtolower(
                                            pathinfo($files['name'][$i],PATHINFO_EXTENSION )
                                            );
                                            $allowedExtensions = [
                                                'jpg',
                                                'jpeg',
                                                'png',
                                                'gif',
                                                'webp'
                                                ];
                                                if (!in_array($extension, $allowedExtensions)) {
                                                    echo "Invalid file extension.";
                                                    return;
                                                    }
                                                    $fileName = uniqid('photo_', true) . '.' . $extension;
                                           $uploadPath = __DIR__ . '/../public/images/uploads/' . $fileName; 
                                           if (!move_uploaded_file( $files['tmp_name'][$i], $uploadPath )) 
                                            { echo "Could not save one of the photos.";
                                            return; 
                                            } 
                                            $photoModel->create( $userId, $fileName, $title, $description );
                                             }
                                              header("Location: /alzikrayat/public/photos");
                                              exit;
                                               }

    public function show($id)
    {
        session_start();
        if (!isset($_SESSION['user_id'])){
            header ("location:/alzikrayat/public/login");
              exit ;
        }
        $photoModel = new Photo();

        $photo = $photoModel->findById($id);

        if (!$photo) {
            http_response_code(404);
            echo "Photo not found";
            return;
        }
        $commentModel = new Comment();

        $comments = $commentModel->getByPhotoId($id);

        $this->view('photos/show', [
            'photo' => $photo ,
            'comments' => $comments
        ]);
    }

    public function delete($id)
{
    session_start();

    if (!isset($_SESSION['user_id'])) {
        header("Location: /alzikrayat/public/login");
        exit;
    }

    $photoModel = new Photo();

    $photo = $photoModel->findById($id);

    if (!$photo) {
        http_response_code(404);
        echo "Photo not found";
        return;
    }

    if ($photo['user_id'] != $_SESSION['user_id']) {
        http_response_code(403);
        echo "You are not allowed to delete this photo";
        return;
    }

    $filePath = __DIR__ . '/../public/images/uploads/' . $photo['file_name'];

    if (file_exists($filePath)) {
        unlink($filePath);
    }

    $photoModel->delete($id, $_SESSION['user_id']);

    header("Location: /alzikrayat/public/photos");
    exit;
}
}


?>