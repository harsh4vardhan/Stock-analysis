<?php
header("Content-Type:application/json");
require_once '../config/db.php';

$stock_names = array();
$result = mysqli_query($conn, "SELECT *  from daily_table");
if ($result == true) {
    while ($row = mysqli_fetch_array($result)) {
        $stock_names[] = $row['stock_name'];
    }
    $stock_names = array_unique($stock_names);
    response($stock_names, 200, "found");
} else {
    response(null, 400);
}
function response($stock_names, $status, $error)
{
    $response['stock_names'] = $stock_names;
    $response['reponse_status'] = $status;
    $response['error'] = $error;
    $json_response = json_encode($response);
    echo $json_response;
}
