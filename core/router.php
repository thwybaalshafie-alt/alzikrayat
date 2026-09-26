<?php

class Router
{
    private $routes = [];

    public function get($path, $action)
    {
        $this->routes['GET'][$path] = $action;
    }

    public function post($path, $action)
    {
        $this->routes['POST'][$path] = $action;
    }

    public function dispatch($uri, $method)
    {
        foreach ($this->routes[$method] ?? [] as $route => $action) {

            $pattern = preg_replace(
                '/\{([a-zA-Z]+)\}/',
                '([^/]+)',
                $route
            );

            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
            
                array_shift($matches);

                [$controllerName, $methodName] = explode('@', $action);

                require_once dirname (__DIR__) . '/controllers/' . $controllerName . '.php';

                $controller = new $controllerName();

                call_user_func_array(
                    [$controller, $methodName],
                    $matches
                );

                return;
            }
        }

        http_response_code(404);
        echo "404 - Page Not Found";
    }
}

?>