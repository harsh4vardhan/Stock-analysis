<?php
/* Attempt MySQL server connection. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
$mysqli = new mysqli("localhost", "root", "Password", "stock_api");

// Check connection
if ($mysqli === false) {
    die("ERROR: Could not connect. " . $mysqli->connect_error);
}

// Attempt create table query execution
$stocktable = "CREATE TABLE daily_table (
    date_of_price date,
    price int,
    stock_name varchar(30)
) ";
if (mysqli_multi_query($mysqli, $stocktable)) {
    echo ("tables created");
} else {
    "error";
}

// Close connection
$mysqli->close();
