<?php
require_once __DIR__ . '/../core/Controller.php' ;
require_once __DIR__ . '/../models/Photo.php' ;
require_once __DIR__ . '/../models/User.php' ;
class HomeController extends Controller{
    public function index(){
        session_start();
        $photoModel = new Photo();
        $totalPhotos = $photoModel->CountAll();
        $userModel = new User();
        $totalUsers = $userModel->countAll();
        $recentPhotos = $photoModel->getRecentPhotos();
        $this ->view('home/index',['totalPhotos'=> $totalPhotos,'totalUsers'=>$totalUsers,'recentPhotos'=>$recentPhotos]);
    }
}
?>