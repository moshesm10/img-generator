<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: text/html; charset=utf-8');

include '../connect.php';

// Получаем данные из запроса
$input = file_get_contents('php://input');
$requestData = $input ? json_decode($input, true) : $_REQUEST;
$txt = $requestData['city'];

// Запрос случайного (опубликованного) пресета из БД
function getHTML($link) {
    $query = "SELECT * FROM `presets` WHERE `published` = 1";
    $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
    $presetsList = array();

    while ($data = mysqli_fetch_assoc($result)) {
        $presetsList[] = $data;
    };

    mysqli_close($link);
        
    $presetId = rand(0, count($presetsList) - 1);

    return $presetsList[$presetId]['html'];
};


// Заменяем теги на данные из запроса
$html = getHTML($link);
foreach ($requestData as $tag => $value) {
    $html = str_replace('['. $tag .']', $value, $html);
}

// Меняем размер текста (на сервере рендерится большая картинка 2480x3443 px, нужен крупный пропорциональный текст)
$html = str_replace('<body>', '<body><style>body {font-size: 180px;}</style>', $html);

// Выводим HTML с подставленными данными
echo $html;
?>