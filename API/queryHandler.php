<?php
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

$actionRequest;
if($request_method === 'post') {
    $actionRequest = $bodyData->action;
}

$user = new User();

switch($request_method) {
    case 'post' :
        switch($actionRequest) {
            case 'logIn': 
                $username  = $bodyData->data->username;
                $pass      = $bodyData->data->password;
                $loggedInUser = $user->logIn($username, $pass);
                if($loggedInUser) { 
                    $chatKitHandler = new ChatKitHandler();
                    $userLoggedIn = $chatKitHandler->authUser($loggedInUser->id);
                    $loggedInUser->accessToken = $userLoggedIn['body']['access_token'];
                    $loggedInUser->expiresIn = $userLoggedIn['body']['expires_in'];
                    http_response_code(200);
                    echo json_encode($loggedInUser);
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
                    $chatKitHandler = new ChatKitHandler();
                    $userCreated = $chatKitHandler->createUser($result, $firstName . ' ' . $lastName);
                    // If(userWasNotCreated) { delete user from our database. }
                    http_response_code(200);
                    echo json_encode($userCreated);
                } else {
                    http_response_code(400);
                    echo json_encode($user->msg);
                }
            break;
        
        
        }
        
    break;

    case 'get' :
        $result = $user->checkIfLoggedIn();
        if($result) {
            echo ('inloggad');
        } else {
            echo 'Ej inloggad' . $result;
        }
    break;
}
die;
// $table     = $bodyData->table;

// $result = $user->getUsers();

/**
 * Vi vill veta: är det post, put, get eller delete?
 * Vad för data är det vi vill hämta? Vad vill vi ta bort? Behöver
 * kunna identifiera vad det är vi vill ha beroende på vårt request.
 */
