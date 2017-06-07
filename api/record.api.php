<?php

//Connect with database
require_once('main.api.php');

if(!$_GET['action']) die();

//select action
switch($_GET['action']) {


    case 'add':

      require_once('logged.api.php');
      user_is('Kurier');

      try {

        $record = json_decode(file_get_contents('php://input'));

        $errors = [];

        //verify if client exists

        $sth = $conn->prepare("SELECT * FROM `zlecenia` WHERE `IdZlecenia` = :id LIMIT 1");
        $sth->bindParam(':id', $record->IdZlecenia, PDO::PARAM_INT);
        if($sth->execute()) {

          $result = $sth->fetchAll();

          if(isset($result[0])) {


            //Check for errors
            if($record->Data_otrzymania == "" or $record->Data_dostarczenia == "") $errors[] = "Daty nie mogą być puste...";
            else {

              //Insert user to database

              $sth = $conn->prepare("INSERT INTO `rejestr` (`data_otrzymania`, `data_dostarczenia`, `IdZlecenia`, `IdTypu`, `IdPracownika`)
              VALUES (:data_start, :data_end, :IdZlecenia, :IdTypu, :IdPracownika);");

              //binding data

              $sth->bindParam(':data_start', $record->Data_otrzymania, PDO::PARAM_STR);
              $sth->bindParam(':data_end', $record->Data_dostarczenia, PDO::PARAM_STR);
              $sth->bindParam(':IdZlecenia', $record->IdZlecenia, PDO::PARAM_INT);
              $sth->bindParam(':IdTypu', $record->IdTypu, PDO::PARAM_INT);
              $sth->bindParam(':IdPracownika', $user->IdPracownika, PDO::PARAM_INT);


              if($sth->execute()) echo 'success'; //everthng is all right
              else $errors[] = "Zapytanie nie mogło zostać wykonane";

            }
          } else $errors[] = "Taki klient nie istnieje!";
        } else $errors[] = "Zapytanie nie mogło zostać wykonane";
      } catch(Exception $e) {
        $errors[] = "Nieznany błąd".$e;
      }

      if(!empty($errors)) echo json_encode($errors);

    break;

    case 'update':

      require_once('logged.api.php');
      user_is('Kurier');

      try {

        $record = json_decode(file_get_contents('php://input'));

        $errors = [];

        //verify if client exists

        $sth = $conn->prepare("SELECT * FROM `klienci` WHERE `IdKlienta` = :id LIMIT 1");
        $sth->bindParam(':id', $record->IdKlienta, PDO::PARAM_INT);
        if($sth->execute()) {

          $result = $sth->fetchAll();

          if(isset($result[0])) {

            //Check for errors
            if($record->Data_otrzymania == "" or $record->Data_dostarczenia == "") $errors[] = "Daty nie mogą być puste...";
            else {

              //Insert user to database

              $sth = $conn->prepare("INSERT INTO `rejestr` (data_otrzymania`, `data_dostarczenia`, `IdZlecenia`, `IdTypu`, `IdPracownika`)
              VALUES (:data_start, :data_end, :IdZlecenia, :IdTypu, :IdPracownika);");

              //binding data
              global $user;

              $sth->bindParam(':data_start', $record->data_otrzymania, PDO::PARAM_STR);
              $sth->bindParam(':data_end', $record->Data_dostarczenia, PDO::PARAM_STR);
              $sth->bindParam(':IdZlecenia', $record->IdZlecenia, PDO::PARAM_INT);
              $sth->bindParam(':IdTypu', $record->IdTypu, PDO::PARAM_INT);
              $sth->bindParam(':IdPracownika', $user->IdPracownika, PDO::PARAM_INT);


              if($sth->execute()) echo 'success'; //everthng is all right
              else $errors[] = "Zapytanie nie mogło zostać wykonane";

            }
          } else $errors[] = "Taki zlecenie nie istnieje!";
        } else $errors[] = "Zapytanie nie mogło zostać wykonane";
      } catch(Exception $e) {
        $errors[] = "Nieznany błąd".$e;
      }
      if(!empty($errors)) echo json_encode($errors);

    break;

    case 'all':

      require_once('logged.api.php');
      $zle = json_decode(file_get_contents('php://input'));

      try {

        $sth = $conn->prepare("SELECT * FROM `Rejestr` INNER JOIN pracownicy ON pracownicy.IdPracownika = rejestr.IdPracownika WHERE rejestr.IdZlecenia = :id ORDER BY `Data_otrzymania` DESC");
        $sth->bindParam(':id', $zle->IdZlecenia, PDO::PARAM_INT);

        if($sth->execute()) {
          $result = $sth->fetchAll();
          echo json_encode(array_values($result));
        } else echo 'error';

       } catch(Exception $e) {
        echo 'error';
       }

    break;

    case 'remove':

          require_once('logged.api.php');
          user_is("Kurier");

          $zle = json_decode(file_get_contents('php://input'));


            $sth = $conn->prepare("DELETE FROM `rejestr` WHERE `IdWpisu` = :id LIMIT 1");
            $sth->bindParam(':id', $zle->IdWpisu, PDO::PARAM_INT);

            if($sth->execute()) echo 'success';
            else echo 'error #1';

    break;

    default:
    break;


}
?>
