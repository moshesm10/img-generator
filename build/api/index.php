<?php

    header('Access-Control-Allow-Origin: *');
    include '../connect.php';

    $input = file_get_contents('php://input');
    $requestData = $input ? json_decode($input, true) : $_REQUEST;
    $result = null;

    $query = "INSERT INTO `api-input-data` (`data`) VALUES ('".json_encode($requestData)."')";  
    $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 

    function getHTML($link) {
        $query = "SELECT * FROM `presets`";
        $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
        $presetsList = array();
    
        while ($data = mysqli_fetch_assoc($result)) {
            $presetsList[] = $data;
        };

        mysqli_close($link);
        
        $presetId = rand(0, count($presetsList) - 1);

        return $presetsList[$presetId]['html'];
    };

    $json = '{"city":"Moscow"}';

    $params=['html' => getHTML($link), 'print-values' => json_encode($requestData), 'mode' => 'big'];
    $ch = curl_init(); 

    curl_setopt($ch, CURLOPT_URL, "http://185.251.90.104/img-gen/api4-generate-img.php");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);

    $output = curl_exec($ch); 
    curl_close($ch);   

    echo $output;

?>