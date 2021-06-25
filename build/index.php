<?php

    include 'connect.php';

    $action = $_POST['action'];

    //if (!$presetTitle) {
    //    $presetTitle = 'Empty title'
    //}

    switch ($action) {
        case "refresh":
            $query = "SELECT * FROM `presets`";
            $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
            $presetsList = array();

            while ($data = mysqli_fetch_assoc($result)) {
                $presetsList[] = $data;
            }
            echo json_encode($presetsList);
            // закрываем подключение
            mysqli_close($link);
            break;

        case "save":
            $presetHTML = $_POST['html'];
            $presetTitle = $_POST['title'];

            $query = "INSERT INTO `presets` (`title`, `html`) VALUES ('".$presetTitle."', '".$presetHTML."')";
            $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
            if($result) {
            echo " :) ";
            }
            // закрываем подключение
            mysqli_close($link);
            break;
            
        case "load":
            $presetId = $_POST['id'];

            $query = "SELECT * FROM `presets` WHERE `id` = $presetId";
            $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
            $presetsList = array();

            while ($data = mysqli_fetch_assoc($result)) {
                $presetsList[] = $data;
            }
            echo json_encode($presetsList);
            // закрываем подключение
            mysqli_close($link);
            break;
    }
?>