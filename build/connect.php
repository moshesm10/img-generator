<?php 

    $user = 'a0413857_app_wordpress_0';
    $password = 'test';
    $db = 'a0413857_app_wordpress_0';
    $host = 'localhost';
    $link = mysqli_connect($host, $user, $password, $db) 
            or die("1Ошибка " . mysqli_error($link));

?>