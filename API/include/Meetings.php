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
}

