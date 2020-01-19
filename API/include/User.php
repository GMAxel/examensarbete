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
    public function create($firstName, $lastName, $username, $description, $password) {
        $sql = "INSERT INTO $this->table 
        (firstName, lastName, username, description, password)
        VALUES(:firstName, :lastName, :username, :description, :pass)";
        $stmt = $this->db->prepare($sql);

        // Filtering. 
        $filt_firstName = filter_var($firstName, FILTER_SANITIZE_STRING);
        $filt_lastName  = filter_var($lastName, FILTER_SANITIZE_STRING);
        $filt_username  = filter_var($username, FILTER_SANITIZE_STRING);
        $filt_password  = filter_var($password, FILTER_SANITIZE_STRING);
        $filt_desc      = filter_var($description, FILTER_SANITIZE_STRING);
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
        if(strlen($filt_desc) >= 350) {
            $this->msg = 'Description too long! Max characters 350, you typed in ' . strlen($filt_desc) . ' characters.';
            return false;
        }
        // Hash password.
        $hash = password_hash($filt_password, PASSWORD_DEFAULT);
        // Bind Values
        $stmt->bindValue(':firstName',  $filt_firstName);
        $stmt->bindValue(':lastName',   $filt_lastName);
        $stmt->bindValue(':username',   $filt_username);
        $stmt->bindValue(':description',   $filt_desc);
        $stmt->bindValue(':pass',       $hash);
        $result = $stmt->execute();
        if($result) {
            return $this->db->lastInsertId(); 
        } else {
            return false;
        }
    }

    public function updateAccount($inputs) {
        $fields = $this->db->query("SHOW COLUMNS FROM $this->table;")->fetchAll();
        $filtered_fields = [];
        foreach($fields as $field) {
            if($field['Field'] !== 'id') {
                $filtered_fields[]= $field['Field'];
            }
        }
        $common_fields = [];
        $common_fields_for_sql = [];
        foreach($filtered_fields as $field) {
            if(isset($inputs->$field)) {
               $common_fields_for_sql[] = $field . ' = :' . $field; 
               $common_fields[] = $field;
            }
        }
        // Setup query.
        $sql = "UPDATE $this->table SET " . implode(', ', $common_fields_for_sql) . " WHERE id = :id";
        $statement = $this->db->prepare($sql);


        if(isset($inputs->username)) {
            $checkUsername = filter_var($inputs->username, FILTER_SANITIZE_STRING);
            if($this->getUser($checkUsername)) {
                $this->msg = 'Username already in use' ;
                return false;
            }
            if(strlen($checkUsername) <= 3) {
                $this->msg = 'Username too short - minimum 4 characters'; 
                return false;
            }
        }
        if(isset($inputs->description)) {
            if(strlen(filter_var($inputs->description)) >= 350) {
                $this->msg = 'Description too long! Max characters 350, you typed in ' . strlen($inputs->description) . ' characters.';
                return false;
            }
        }
        foreach($common_fields as $field) {
            $value = filter_var($inputs->$field, FILTER_SANITIZE_STRING);
            if($field === 'password') {
                if(strlen($value) <= 5) {
                    $this->msg = 'Password too short - minimum 6 characters';
                    return false;
                }
                $value = password_hash($value, PASSWORD_DEFAULT);
            }
            $statement->bindValue($field, $value, PDO::PARAM_STR);
        }
        $filt_id = filter_var($inputs->id, FILTER_SANITIZE_NUMBER_INT);
        $statement->bindValue(':id', $filt_id);
        $result = $statement->execute();

        if($result === true) {
            $sql = "SELECT * FROM $this->table WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':id',   $filt_id);
            $stmt->execute();
            $updatedUser = $stmt->fetch(PDO::FETCH_OBJ);
            $obj = (object) [
                'id' => $filt_id,
                'firstName' => $updatedUser->firstName,
                'lastName' => $updatedUser->lastName,
                'username' => $updatedUser->username,
                'description' => $updatedUser->description
            ];
            return $obj;
        }
        return false;
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
                'username' => $userData[0]->username,
                'description' => $userData[0]->description
            ];
            return $obj;
        } else {
            return false;
        }
    }

    public function getUsers() {
        $sql = "SELECT id, firstName, lastName, userName, description FROM $this->table";
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
