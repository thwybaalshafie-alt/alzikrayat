<?php

require_once __DIR__ . '/../core/Router.php';

$router = new Router();

$router->get('/', 'HomeController@index');

$router->get('/photos','PhotoController@index');

$router->get ('/photo/upload','PhotoController@uploadForm');

$router->get('/photo/{id}', 'PhotoController@show');

$router->post('/photo/delete/{id}', 'PhotoController@delete');

$router->get('/login', 'AuthController@login');

$router->get('/register', 'AuthController@register');

$router->get('/logout', 'AuthController@logout');

$router->post('/login', 'AuthController@login');

$router->post('/register', 'AuthController@register');

$router->post('/photo/store', 'photoController@store');

$router->post('/comment/store', 'CommentController@store');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$basePath = '/alzikrayat/public';

if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

if ($uri === '') {
    $uri = '/';
}

$method = $_SERVER['REQUEST_METHOD'];
$router->dispatch($uri, $method);

?>