<?php
require_once 'env.php';
$username = DBUSER;
$password = DBPWD;
$host = DBHOST;
$database = DBNAME;
$conn = new mysqli($host, $username, $password, $database);
