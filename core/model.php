<?php

require_once __DIR__ . '/../config/database.php';

class Model
{
    protected $conn;

    public function __construct()
    {
       $this->conn = require __DIR__ . '/../config/database.php';

    }
}

?>