<?php
require_once 'config/db.php';

if (isset($_FILES['file']['name'])) {
    // file name

    $filename = "sample.csv";
    // Location
    $location = 'upload/' . $filename;
    // file extension
    $file_extension = pathinfo($location, PATHINFO_EXTENSION);
    $file_extension = strtolower($file_extension);

    // Valid extensions
    $valid_ext = array("csv");
    $file_tmp = $_FILES['file']['tmp_name'];
    $response = 0;

    if (in_array($file_extension, $valid_ext)) {
        // Upload file
        if (move_uploaded_file($file_tmp, $location)) {
            $responseText = 1;

            $file = fopen("upload/sample.csv", "r");

            $array_of_names = array();
            while (($getdata = fgetcsv($file, 10000, ',')) !== false) {

                $name = $getdata[2];
                $array_of_names[] = $name;
                $array_of_names = array_unique($array_of_names);
                $date = $getdata[1];
                $date = strtotime($date);
                $date = date("Y-m-d", $date);
                $price = $getdata[3];
                $name_of_stock = $getdata[2];
                $query = "INSERT INTO daily_table (stock_name,date_of_price,price) values ('" . $name_of_stock . "','" . $date . "','" . $price . "')";
                if (mysqli_query($conn, $query)) {

                    echo ("tables populated2");
                } else {

                    echo ("error  " . $name . $conn->error);
                }

            }

            fclose($file);
            // exit;

        }

    }
    return $responseText;
    exit;
}
