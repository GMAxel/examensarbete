<?php
require_once './include/DB.php';
class Meetings {
    public $db;
    public $table = 'meeting';
    public $msg;
    public $success;

    public function __construct()
    {
        $obj = new DB();
        $this->db = $obj->pdo;
    }
    public function getMeetings($month, $secondUserId) {
        $sql = "SELECT m.name as month, day, st.name as startTime, et.name as endTime FROM meeting as mt
                JOIN users as u ON mt.userId = u.id
                JOIN time as st ON mt.startTimeId = st.id
                JOIN time as et ON mt.endTimeId = et.id
                JOIN months as m ON mt.monthId = m.id
                WHERE m.name = :month
                    AND (mt.userId = :secondUserId OR mt.secondUserId = :secondUserId);";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':month',   $month);
        $stmt->bindValue(':secondUserId',   $secondUserId);
        $stmt->execute();
        $meetings = $stmt->fetchAll(PDO::FETCH_OBJ);
        if($meetings) {
            $obj = (object) [];
            foreach($meetings as $meeting) {
                $day = $meeting->day;
                $obj->$day[] = [$meeting->startTime, $meeting->endTime];
            }
            return $obj;
        }
        return $meetings;
    }
    public function getAllMeetings($userId) {
        $sql = "SELECT u.firstName as firstNameUser, u.lastName as lastNameUser, 
                su.firstName as firstNameSecondUser, su.lastName as lastNameSecondUser, 
                m.name as month, day, st.name as startTime, et.name as endTime FROM meeting as mt
                JOIN users as u ON u.id = mt.userId
                JOIN users as su ON su.id = mt.secondUserId 
                JOIN time as st ON mt.startTimeId = st.id
                JOIN time as et ON mt.endTimeId = et.id
                JOIN months as m ON mt.monthId = m.id
                WHERE (mt.userId = :userId OR mt.secondUserId = :userId)
                ORDER BY m.id ASC, day ASC, st.id ASC;";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':userId',   $userId);
        $stmt->execute();
        $meetings = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $meetings;
    }

    public function bookMeeting($data) {
        // (int, int, string, int, string, string)
        // (rät, rät,  fel,   rätt, fel    fel )
        $fields = $this->db->query("SHOW COLUMNS FROM $this->table;")->fetchAll();
        $chosenFields = [];
        // Fields = "userId", "secondUserId", "startTimeId", "endTimeId", "monthId", "day"
        $filteredValues = [];
        foreach($fields as $field) {
            $field = $field['Field'];
            if($field !== 'id') {
                $chosenFields[]= $field;
                if( $field === 'userId' ||
                    $field === 'secondUserId' ||
                    $field === 'day') 
                {
                    $filteredValue = filter_var($data->$field, FILTER_SANITIZE_NUMBER_INT);
                    $filteredValues[$field] = $filteredValue;
                } 
                else if($field === 'monthId' ||
                        $field === 'startTimeId' ||
                        $field === 'endTimeId')
                {
                    $field = substr($field, 0, -2);
                    $filteredValue = filter_var($data->$field, FILTER_SANITIZE_STRING);
                    $table = 'time';
                    if($field === 'month') {
                        $table = 'months';
                    }
                    $filteredValue = $this->getIdFromValue($table, $filteredValue);
                    $field .= 'Id';
                    $filteredValues[$field] = $filteredValue;
                }
            }
        }
        $timeAlreadyBookedUserValues = $filteredValues;
        $timeAlreadyBookedUserValues['userId'] = $timeAlreadyBookedUserValues['secondUserId'];
        unset($timeAlreadyBookedUserValues['secondUserId']);
        $timeAlreadyBooked = $this->checkIfFree($filteredValues);
        if($timeAlreadyBooked) {
            $this->msg = "This time has already been booked!";
            return false;
        } 
        $implodedFields = implode(', ', $chosenFields);
        $sql = "INSERT INTO $this->table 
        (" . implode(', ', $chosenFields) . ") " .
        'VALUES (:' . implode(', :' ,$chosenFields) . ')';
        $stmt = $this->db->prepare($sql);
        foreach($filteredValues as $key => $value) {
            $stmt->bindValue(":$key", $value, PDO::PARAM_INT);
        }
        $this->msg .= "WOOOW, ";
        return $stmt->execute();
        // $monthId = $this->getIdFromValue('months', $month);
    }

    public function checkIfFree($filteredValues) {
        $sql = "SELECT * FROM meeting as mt
                JOIN users as u ON mt.userId = u.id
                JOIN time as st ON mt.startTimeId = st.id
                JOIN time as et ON mt.endTimeId = et.id
                JOIN months as m ON mt.monthId = m.id
                WHERE (mt.userId = :userId OR mt.secondUserId = :userId)
                    AND m.id = :monthId
                    AND mt.day = :day
                    AND (mt.startTimeId = :startTimeId OR mt.endTimeId = :endTimeId)";

        $stmt = $this->db->prepare($sql);
        foreach($filteredValues as $key => $value) {
            $stmt->bindValue(":$key", $value, PDO::PARAM_INT);
        }
        // $stmt->bindValue(':userId',   $userId, PDO::PARAM_INT);
        // $stmt->bindValue(':month',   $monthId, PDO::PARAM_INT);
        // $stmt->bindValue(':day',   $day, PDO::PARAM_INT);
        // $stmt->bindValue(':startTimeId',   $startTimeId, PDO::PARAM_INT);
        // $stmt->bindValue(':endTimeId',   $endTimeId, PDO::PARAM_INT);
        $stmt->execute();
        $booked = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $booked;     
    }

    public function getIdFromValue($table, $value) {
        $sql = "SELECT id FROM $table WHERE name = :value";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':value', $value, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchColumn();
        return $result;
    }
}

