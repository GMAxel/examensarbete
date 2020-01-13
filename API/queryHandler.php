<?php
// require_once './include/User.php';
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header("HTTP/1.1 200 OK");
    die();
}
// Get request method. (GET, POST etc).
$request_method = strtolower($_SERVER['REQUEST_METHOD']);
// Autoload classes.
spl_autoload_register(function ($class_name) {
    if (file_exists('./include/' . $class_name . '.php')) {
        include './include/' . $class_name . '.php';
    } else {
        http_response_code(501);
        echo 'className: ' . $class_name;
    }
});

$bodyData = json_decode(file_get_contents('php://input'));
echo json_encode($bodyData);
die;
$actionRequest = $bodyData->action;

$user = new User();
switch($actionRequest) {
    case 'logIn': 
        $username  = $bodyData->data->username;
        $pass      = $bodyData->data->password;
        $loggedIn = $user->logIn($username, $pass);
        if($loggedIn) { 
            http_response_code(200);
            echo json_encode($loggedIn);
        } else {
            http_response_code(400);
            echo json_encode($user->msg);
        }

    break;
    case 'newUser':
        $firstName = $bodyData->data->firstName;
        $lastName  = $bodyData->data->lastName;
        $username  = $bodyData->data->username;
        $pass      = $bodyData->data->password;
        $result = $user->create($firstName, $lastName, $username, $pass);
        if($result) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode($user->msg);
        }
    break;
    case 'myAccount': 


    break;

    case 'checkLoggedIn':
        $result = $user->checkIfLoggedIn();
        echo json_encode($result);
    break;
    
    case 'logOut' : 
        $user->logOut();
    break;

}

// $table     = $bodyData->table;

// $result = $user->getUsers();

/**
 * Vi vill veta: är det post, put, get eller delete?
 * Vad för data är det vi vill hämta? Vad vill vi ta bort? Behöver
 * kunna identifiera vad det är vi vill ha beroende på vårt request.
 */
