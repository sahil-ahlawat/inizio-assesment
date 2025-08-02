<?php

$csvContent = "";
for ($i = 1; $i <= 10; $i++) {
    $row = ["Title_$i"];
    for ($j = 1; $j <= 1000; $j++) {
        $row[] = "Value_" . $i . "_" . $j;
    }
    $csvContent .= implode(",", $row) . "\n";
}

file_put_contents('c:\\MAMP\\htdocs\\inizio\\php_csv_uploader\\sample_1000_columns.csv', $csvContent);

?>