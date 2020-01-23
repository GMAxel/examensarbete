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
        $implodedFields = implode(', ', $chosenFields);
        $sql = "INSERT INTO $this->table 
        (" . implode(', ', $chosenFields) . ") " .
        'VALUES (:' . implode(', :' ,$chosenFields) . ')';
        $stmt = $this->db->prepare($sql);
        foreach($filteredValues as $key => $value) {
            $stmt->bindValue(":$key", $value, PDO::PARAM_INT);
        }
        // $stmt->execute();


        return $stmt->execute();
        // $monthId = $this->getIdFromValue('months', $month);
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

