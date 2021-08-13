<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: text/html; charset=utf-8');

include '../connect.php';

// Получаем данные из запроса
$input = file_get_contents('php://input');
$requestData = $input ? json_decode($input, true) : $_REQUEST;
$txt = $requestData['city'];
$salt = $requestData['salt'];
unset($requestData['salt']);

// Запрос случайного (опубликованного) пресета из БД
function getHTML($link,$requestTags=[],$salt=false) {
    $query = "SELECT * FROM `presets` WHERE `published` = 1";
    $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
    $presetsList = array();

    while ($data = mysqli_fetch_assoc($result)) {
        $usedTags=getUsedTags($data['html']);// вывести в отдельное поле и фильтровать при запросе
        if(count(array_intersect($usedTags, $requestTags))!=count($usedTags))continue;
        $presetsList[] = $data;
    };

    mysqli_close($link);

    if($salt){
        $presetId = $salt% (count($presetsList) - 1);
    }else{
        $presetId = rand(0, count($presetsList) - 1);
    }


    return $presetsList[$presetId]['html'];
};
function getUsedTags($html):array{
    $ret=[];
    $re = '/(\[\w*\])/m';
    preg_match_all($re, $html, $matches, PREG_PATTERN_ORDER , 0);
    foreach ($matches[0] as $tag){
        $ret[$tag]=str_replace(['[',']'], '', $tag);
    }
    return $ret;
}

$requestData['all']=implode(' ', $requestData);
// Заменяем теги на данные из запроса
$html = getHTML($link,array_keys($requestData),$salt);
foreach ($requestData as $tag => $value) {
    $html = str_replace('['. $tag .']', $value, $html);
}

// Меняем размер текста (на сервере рендерится большая картинка 2480x3443 px, нужен крупный пропорциональный текст)
$html = str_replace('<body>', '<body><style>body {font-size: 180px;}</style>', $html);

// Выводим HTML с подставленными данными
echo $html;
?>