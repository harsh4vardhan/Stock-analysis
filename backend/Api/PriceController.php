<?php
header("Content-Type:application/json");
require_once '../config/db.php';
if (isset($_GET['start_date'], $_GET['end_date'], $_GET['stock_name']) && $_GET['start_date'] != "") {

    $start_date = $_GET['start_date'];
    $end_date = $_GET['end_date'];
    $stock_name = $_GET['stock_name'];
    $name_query = mysqli_query($conn, "SELECT stock_name FROM daily_table");
    $name_available = false;
    $date_available = false;

    $names = array();
    while ($row = mysqli_fetch_array($name_query)) {
        $names[] = $row['stock_name'];
    }
    foreach ($names as $name) {
        if (strcasecmp($stock_name, $name)) {
            $name_available = true;
        }
    }
    $result = mysqli_query($conn, "SELECT price,date_of_price FROM daily_table where stock_name='$stock_name' AND date_of_price >= '$start_date' AND date_of_price <= '$end_date'");
    $date_of_price = array();
    $price = array();
    while ($row = mysqli_fetch_array($result)) {
        $rows[] = $row;
        $date_of_price[] = $row['date_of_price'];
        $price[] = $row['price'];

    }
    foreach ($date_of_price as $date) {
        if ($end_date > $date) {
            $date_available = true;
        }
    }
    if ($name_available == true && $date_available == true) {

        $buy = $price[0];
        $maxprofit = 0;
        $minloss = 0;
        $buy_date;
        $best_sell_price;
        $best_sell_price;
        $variance = 0.0;
        $standard_deviation = 0;
        $mean = array_sum($price) / count($price);
        $mean = round($mean, 2);
        foreach ($price as $price_on_single_day) {
            if ($buy > $price_on_single_day) {
                $buy = $price_on_single_day;
            } elseif ($price_on_single_day - $buy > $maxprofit) {
                $maxprofit = $price_on_single_day - $buy;
                $best_sell_price = $price_on_single_day;
                $best_buy_price = $buy;

            }
            $variance += pow(($price_on_single_day - $mean), 2);

        }
        $standard_deviation = (float) sqrt($variance / count($price));
        $standard_deviation = round($standard_deviation, 2);
        $best_sell_price = intval($best_sell_price);
        $best_buy_price = intval($best_buy_price);
        $result_for_buy_date = mysqli_query($conn, "SELECT date_of_price from daily_table where stock_name='$stock_name' and price='$best_buy_price'");
        $buy_date = array();
        $maxprofit = $maxprofit * 200;
        while ($row_for_dates = mysqli_fetch_array($result_for_buy_date)) {
            $buy_date[] = $row_for_dates['date_of_price'];

        }
        $result_for_sell_date = mysqli_query($conn, "SELECT date_of_price from daily_table where stock_name='$stock_name' and price='$best_sell_price'");
        $sell_date = array();
        while ($row_for_sell_date = mysqli_fetch_array($result_for_sell_date)) {
            $sell_date[] = $row_for_sell_date['date_of_price'];
        }
        $respons_object->price = $price;
        $respons_object->date_of_price = $date_of_price;
        $respons_object->maxprofit = $maxprofit;
        $respons_object->best_buy_price = $best_buy_price;
        $respons_object->best_sell_price = $best_sell_price;
        $respons_object->buy_date = $buy_date;
        $respons_object->sell_date = $sell_date;
        $respons_object->mean = $mean;
        $respons_object->standard_deviation = $standard_deviation;

        response(200, "Successfull", $respons_object);

        mysqli_close($conn);
    } else {
        response(200, "Unsuccessfull", null);

    }
} else {
    response(400, "notfound", null);
}

function response($status, $desc, $data)
{
    $response['status'] = $status;
    $response['description'] = $desc;
    $response['data'] = $data;
    $json_response = json_encode($response);
    echo $json_response;
}
