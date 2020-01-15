<?php
require_once('vendor/autoload.php');

class ChatKitHandler {
  public $chatkit;

  public function __construct()  {
    $this->chatkit = new Chatkit\Chatkit([
      'instance_locator' => 'v1:us1:9c68c4a2-5e00-4be3-a64f-37fda8dde440',
      'key' => '86d74e98-c83a-4f4c-a2be-6fd3cfcfbaa7:Mvr3qZwsTyZOTQ2M63U1PPQtf7CYPMpSXolD1OiRF/w='
    ]);
  }
  public function authUser($id) {
    $filt_id = filter_var($id, FILTER_SANITIZE_NUMBER_INT);
    $this->chatkit->authenticate([ 'user_id' => $filt_id ]);
  }

  public function createUser($id, $name) {
    $filt_id = filter_var($id, FILTER_SANITIZE_NUMBER_INT);
    $filt_name = filter_var($name, FILTER_SANITIZE_STRING);
    $result = $this->chatkit->createUser([
      'id' => $filt_id,
      'name' => $filt_name
    ]);
    return $result;
  }

  public function deleteUser($id) {
    $filt_id = filter_var($id, FILTER_SANITIZE_NUMBER_INT);
    $this->chatkit->asyncDeleteUser([ 'id' => $filt_id ]);
  }

  public function getUser($id) {
    $filt_id = $id;
    // filter_var($id, FILTER_SANITIZE_NUMBER_INT);
    $result = $this->chatkit->getUser([ 'id' => $filt_id ]);
    return $result;
  }

  public function getUsers(){
    $result = $this->chatkit->getUsers();
    return $result;
  }
}

