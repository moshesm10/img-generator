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
            $presetPublished = $_POST['published'];

            $presetHTML = addslashes($presetHTML);
            $presetTitle = addslashes($presetTitle);

            $query = "INSERT INTO `presets` (`title`, `html`, `published`) VALUES ('".$presetTitle."', '".$presetHTML."', '".$presetPublished."')";
            $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
            if($result) {
                echo " :) ";
            }
            // закрываем подключение
            mysqli_close($link);
            break;
        
        case "update":
            $presetHTML = $_POST['html'];
            $presetTitle = $_POST['title'];
            $presetId = $_POST['id'];
            $presetPublished = $_POST['published'];

            $presetHTML = addslashes($presetHTML);
            $presetTitle = addslashes($presetTitle);

            $query = "UPDATE `presets`  SET `title` = '".$presetTitle."', `html` = '".$presetHTML."', `published` = '".$presetPublished."' WHERE `id` = $presetId";
            $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
            if($result) {
                echo " Пресет обновлен :) ";
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

        case "delete":
            $presetId = $_POST['id'];

            $query = "DELETE FROM `presets` WHERE `id` = $presetId";
            $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
            $presetsList = array();

            if($result) {
                echo " :) ";
            }
            // закрываем подключение
            mysqli_close($link);
            break;
    }
?>