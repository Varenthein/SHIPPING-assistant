<?php

//Connect with database
require_once('main.api.php');

if(!$_GET['action']) die();

//select action
switch($_GET['action']) {


    case 'all':

      require_once('logged.api.php');

      try {

        $sth = $conn->prepare("SELECT * FROM `typy_przesylek` ORDER BY `Nazwa` DESC");

        if($sth->execute()) {
          $result = $sth->fetchAll();
          echo json_encode(array_values($result));
        } else echo 'error';

       } catch(Exception $e) {
        echo 'error';
       }

    break;

    default:
    break;


}
?>
