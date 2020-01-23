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



// Get URI.
$request_uri = $_SERVER['REQUEST_URI'];
$request_uri = explode('/', $_SERVER['REQUEST_URI']);
$specific_user = false; 

if(isset($request_uri[7])) {
    $specific_user = filter_var($request_uri[7], FILTER_SANITIZE_STRING);
}
$request_uri = filter_var($request_uri[6], FILTER_SANITIZE_STRING);
$user = new User();

switch($request_uri) {
    case 'login':
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

    case 'signup': 
        $firstName = $bodyData->data->firstName;
        $lastName  = $bodyData->data->lastName;
        $username  = $bodyData->data->username;
        $pass      = $bodyData->data->password;
        $desc      = $bodyData->data->description;
        $result = $user->create($firstName, $lastName, $username, $desc, $pass);
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

    case 'chat':
        $chatKitHandler = new ChatKitHandler();
        if(!$specific_user) {
            $users = $chatKitHandler->getUsers();
            echo json_encode($users);
        } else {
            $body_data = json_decode(file_get_contents('php://input'));
            $user = $body_data->user;
            $secondUser = $body_data->secondUser;
            // echo $user . ' ' . $secondUser;
            $startChat = $chatKitHandler->startChat($user, $secondUser);
            echo json_encode($startChat);
        }
    break;

    case 'find-users': 
        $chatKitHandler = new ChatKitHandler();
        if(!$specific_user) {
            $users = $user->getUsers();
            echo json_encode($users);
        } else {
            $chatKitHandler = new ChatKitHandler();
            $body_data = json_decode(file_get_contents('php://input'));
            $user = $body_data->user;
            $secondUser = $body_data->secondUser;
            // echo json_encode($user);
            // echo json_encode($secondUser);
            // die;
            $startChat = $chatKitHandler->startChat($user, $secondUser);
            echo json_encode($startChat);
        }
    break;
    case 'update-account':
        $body_data = json_decode(file_get_contents('php://input'));
        $result = $user->updateAccount($body_data);

        if(!$result) {
            echo json_encode($user->msg);
            http_response_code(400);
        } else {
            $chatKitHandler = new ChatKitHandler();
            $userLoggedIn = $chatKitHandler->authUser($result->id);
            $result->accessToken = $userLoggedIn['body']['access_token'];
            $result->expiresIn = $userLoggedIn['body']['expires_in'];
            http_response_code(200);
            echo json_encode($result);
        }

        if(isset($body_data->firstName) || isset($body_data->lastName)) {
            // byt även på chatKit. 
            $chatKitHandler = new ChatKitHandler();
        }
    break;
    case 'delete-account':
        $body_data = json_decode(file_get_contents('php://input'));
        $id = $body_data->id;
        $result = $user->deleteUser($id);
        if($result) {
            $chatKitHandler = new ChatKitHandler();
            $chatKitHandler->deleteUser($id);
            echo json_encode($result);

        } else {
            http_response_code(400);
            echo json_encode($user->msg);
        }
    break;
    case 'user':
        // $id = $request_uri[7];
        $result = $user->getUserById($specific_user);
        echo json_encode($result);
    break;
    case 'getMeetings':
        $meetings = new Meetings();
        $body_data = json_decode(file_get_contents('php://input'));
        $month = $body_data->month;
        $secondUserId = $body_data->secondUserId;
        $result = $meetings->getMeetings($month, $secondUserId);
        echo json_encode($result);
    break;
    case 'bookMeeting':
        $meeting = new Meetings();
        $body_data = json_decode(file_get_contents('php://input'));
        // $userId         = $body_data->userId;
        // $secondUserId   = $body_data->secondUserId;
        // $month          = $body_data->month;
        // $day            = $body_data->day;
        // $startTime      = $body_data->startTime;
        // $endTime        = $body_data->endTime;

        // $result = $meetings->bookMeeting($userId, $secondUserId, $month, $day, $startTime, $endTime);
        $result = $meeting->bookMeeting($body_data->data);
        if($result) {
            echo json_encode($result);
            http_response_code(200);
        } else {
            echo json_encode($meeting->msg);
            http_response_code(400);
        }
    break;
    case 'getAllMeetings':
        $meetings = new Meetings();
        $body_data = json_decode(file_get_contents('php://input'));
        $userId = $body_data->id;
        $result = $meetings->getAllMeetings($userId);
        echo json_encode($result);
    break;
    case 'delete-meeting':
        $meetings = new Meetings();
        $body_data = json_decode(file_get_contents('php://input'));
        $id = $body_data->id;
        $result = $meetings->deleteMeeting($id);
        if($result) {
            http_response_code(200);
            echo json_encode($result);

        } else {
            http_response_code(400);
            echo json_encode($user->msg);
        }
    break;
}
die();
// $table     = $bodyData->table;

// $result = $user->getUsers();

/**
 * Vi vill veta: är det post, put, get eller delete?
 * Vad för data är det vi vill hämta? Vad vill vi ta bort? Behöver
 * kunna identifiera vad det är vi vill ha beroende på vårt request.
 */
