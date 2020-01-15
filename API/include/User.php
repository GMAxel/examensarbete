<?php
require_once './include/DB.php';
class User {
    public $db;
    public $table = 'users';
    public $msg;
    public $success;
    public $isLoggedIn = false;

    public function __construct()
    {
        $obj = new DB();
        $this->db = $obj->pdo;
    }
    public function create($firstName, $lastName, $username, $password) {
        $sql = "INSERT INTO $this->table 
        (firstName, lastName, username, password)
        VALUES(:firstName, :lastName, :username, :pass)";
        $stmt = $this->db->prepare($sql);

        // Filtering. 
        $filt_firstName = filter_var($firstName, FILTER_SANITIZE_STRING);
        $filt_lastName = filter_var($lastName, FILTER_SANITIZE_STRING);
        $filt_username = filter_var($username, FILTER_SANITIZE_STRING);
        $filt_password = filter_var($password, FILTER_SANITIZE_STRING);
        // Check if username has more than 3 characters
        if(strlen($filt_username) <= 3) {
            $this->msg = 'Username too short - minimum 4 characters'; 
            return false;
        } // check if password has more than 5 characters 
        else if(strlen($filt_password) <= 5) {
            $this->msg = 'Password too short - minimum 6 characters';
            return false;
        }
        // Check if username already exists
        if($this->getUser($filt_username)) {
            $this->msg = 'Username already in use' ;
            return false;
        }
        // Hash password.
        $hash = password_hash($filt_password, PASSWORD_DEFAULT);
        // Bind Values
        $stmt->bindValue(':firstName',  $filt_firstName);
        $stmt->bindValue(':lastName',   $filt_lastName);
        $stmt->bindValue(':username',   $filt_username);
        $stmt->bindValue(':pass',       $hash);
        $result = $stmt->execute();
        if($result) {
            return $this->db->lastInsertId(); 
        } else {
            return false;
        }
    }
    public function logIn($username, $pass) {
        $filt_username = filter_var($username, FILTER_SANITIZE_STRING);
        $filt_password = filter_var($pass, FILTER_SANITIZE_STRING);
        $userData = $this->getUser($filt_username);
        // check if user exists
        if($userData === []) {
            return false;
        } 
        $hash = $userData[0]->password;
        $this->isLoggedIn = password_verify($filt_password, $hash);
        
        if($this->isLoggedIn) {
            $obj = (object) [
                'id' => $userData[0]->id,
                'firstName' => $userData[0]->firstName,
                'lastName' => $userData[0]->lastName,
                'username' => $userData[0]->username
            ];
            return $obj;
        } else {
            return false;
        }
    }

    public function getUsers() {
        $sql = "SELECT * FROM $this->table";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }

    public function getUser($username) {
        $sql = "SELECT * FROM $this->table WHERE username = :username";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':username',   $username);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }
}

/**
 * Vi vill veta: är det post, put, get eller delete?
 * Vad för data är det vi vill hämta? Vad vill vi ta bort? Behöver
 * kunna identifiera vad det är vi vill ha beroende på vårt request.
 */
