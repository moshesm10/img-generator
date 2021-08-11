<?php
header('Access-Control-Allow-Origin: *');

// Получаем данные из Шмота
$input = file_get_contents('php://input');
$requestData = $input ? json_decode($input, true) : $_REQUEST;

// Выводим ссылку на картинку с параметрами (картинка генерируется на лету)
echo 'http://185.251.90.104/img-gen2/project/test.php?' . http_build_query($requestData);
?>