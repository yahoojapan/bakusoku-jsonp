<?php
/**
 * テスト用API
 *
 * @param string type レスポンスタイプ
 * @param string callback コールバック関数名
 */
try {
    //parameter validation
    switch (false) {
        case isset($_GET['callback'], $_GET['type']):
        case is_string($_GET['callback']):
        case is_string($_GET['type']):
            throw new RuntimeException('Bad Request', 400);
    }

    switch ($_GET['type']) {
        case 'simple1':
            returnResponse('{"result":"Hello World 1"}');
        case 'simple2':
            returnResponse('{"result":"Hello World 2"}');
        case 'waitAndSimple1':
            sleep(1);
            returnResponse('{"result":"Hello World 1"}');
        case 'waitAndSimple2':
            sleep(2);
            returnResponse('{"result":"Hello World 1"}');
    }

    throw new RuntimeException('Bad Request', 400);

} catch (RuntimeException $e) {
    header('HTTP/1.1 '.$e->getCode().' '.$e->getMessage());
    exit;
}

function returnResponse($str) {
    header('HTTP/1.1 200 OK');
    header('Content-Type: text/javascript');
    echo $_GET['callback'];
    echo '(';
    echo $str;
    echo ');';
    exit;
}
