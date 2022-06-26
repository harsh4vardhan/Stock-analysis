<?php
header("Content-Type:application/json");
require_once '../config/db.php';


if (isset($_GET['stock_name']) && $_GET['stock_name'] != "") {

    $stock_name = $_GET['stock_name'];
    $result = mysqli_query($conn, "SELECT date_of_price,price FROM daily_table where stock_name='$stock_name'");
    if ($result == true) {
    
        $date_of_price = array();
        $price = array();
        $row = mysqli_fetch_array($result);
        while ($row = mysqli_fetch_array($result)) {
            $rows[] = $row;
            $date_of_price[] = $row['date_of_price'];
            $price[] = $row['price'];

        }
        $response_object->date_of_price = $date_of_price;
        $response_object->price = $price;
        $response_object->res;

        response(200,"found record",$response_object);
        
        mysqli_close($conn);
    } else {
        response( 200, "No Record Found",null);

    }
} else {
    response( 400, "Invalid Request",null);
}

function response($status,$desc,$data)
{

    $response['status'] = $status;
    $response['desc'] = $desc;
    $response['data'] = $data;
    $json_response = json_encode($response);
    echo $json_response;
}
