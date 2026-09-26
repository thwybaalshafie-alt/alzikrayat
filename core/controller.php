<?php

class Controller
{
    protected function view($view, $data = [])
    {
        extract($data);

        ob_start();
        require_once __DIR__ . '/../views/' . $view . '.php';
        $content = ob_get_clean();

        require_once __DIR__ . '/../views/layout/main.php';
    }
}

?>