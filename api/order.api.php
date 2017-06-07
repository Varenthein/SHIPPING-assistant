<?php

//Connect with database
require_once('main.api.php');

if(!$_GET['action']) die();

//select action
switch($_GET['action']) {


    case 'add':

      require_once('logged.api.php');
      user_is('Administrator');

      try {

            $order = json_decode(file_get_contents('php://input'));

            $errors = [];

            //verify if client exists

            $sth = $conn->prepare("SELECT * FROM `klienci` WHERE `IdKlienta` = :id LIMIT 1");
            $sth->bindParam(':id', $order->IdKlienta, PDO::PARAM_INT);
            if($sth->execute()) {

              $result = $sth->fetchAll();

              if(isset($result[0])) {

                $user = (OBJECT) $result[0];

                //Check for errors
                if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $order->Nazwa_produktu)) $errors[] = "Nazwa zawiera nieprawidłowe znaki...";
                else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $order->Uwagi)) $errors[] = "Uwagi zawierają nieprawidłowe znaki...";
                else {

                  //Insert user to database

                  $sth = $conn->prepare("INSERT INTO `zlecenia` (`Nazwa_produktu`, `Status`, `Uwagi`, `Data_zlozenia`, `Data_wyslania`, `Data_wykonania`, `IdKlienta`, `IdTypu`)
                  VALUES (:nazwa, :status, :uwagi, :data_start, :data_wys, :data_end, :IdKlienta, :IdTypu);");

                  //binding data

                  $sth->bindParam(':nazwa', $order->Nazwa_produktu, PDO::PARAM_STR);
                  $sth->bindParam(':status', $order->Status, PDO::PARAM_STR);
                  $sth->bindParam(':uwagi', $order->Uwagi, PDO::PARAM_STR);
                  $sth->bindParam(':data_start', $order->Data_zlozenia, PDO::PARAM_STR);
                  $sth->bindParam(':data_wys', $order->Data_wyslania, PDO::PARAM_STR);
                  $sth->bindParam(':data_end', $order->Data_wykonania, PDO::PARAM_STR);
                  $sth->bindParam(':IdKlienta', $order->IdKlienta, PDO::PARAM_INT);
                  $sth->bindParam(':IdTypu', $order->IdTypu, PDO::PARAM_INT);


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
      user_is('Administrator');

      try {

        $zle = json_decode(file_get_contents('php://input'));
        $errors = [];

        $sth = $conn->prepare("SELECT * FROM `zlecenia` WHERE `IdZlecenia` = :id LIMIT 1");
        $sth->bindParam(':id', $zle->IdZlecenia, PDO::PARAM_INT);

        if($sth->execute()) {

          $result = $sth->fetchAll();
          if(count($result) == 1) {

            //Check for errors

            if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $zle->Nazwa_produktu)) $errors[] = "Nazwa zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $zle->Uwagi)) $errors[] = "Uwagi zawierają nieprawidłowe znaki...";
            else {
              //Insert user to database

              $sth = $conn->prepare("UPDATE `zlecenia` SET
              `Nazwa_produktu` = :nazwa, `Status` = :status, `Uwagi` = :uwagi, `Data_zlozenia` = :data_start, `Data_wyslania` = :data_wys, `Data_wykonania` = :data_end, `IdTypu` = :IdTypu WHERE `IdZlecenia` = :id");

              //binding data

              $sth->bindParam(':nazwa', $zle->Nazwa_produktu, PDO::PARAM_STR);
              $sth->bindParam(':status', $zle->Status, PDO::PARAM_STR);
              $sth->bindParam(':uwagi', $zle->Uwagi, PDO::PARAM_STR);
              $sth->bindParam(':data_start', $zle->Data_zlozenia, PDO::PARAM_STR);
              $sth->bindParam(':data_wys', $zle->Data_wyslania, PDO::PARAM_STR);
              $sth->bindParam(':data_end', $zle->Data_wykonania, PDO::PARAM_STR);
              $sth->bindParam(':IdTypu', $zle->IdTypu, PDO::PARAM_INT);
              $sth->bindParam(':id', $zle->IdZlecenia, PDO::PARAM_INT);

              if($sth->execute())  echo 'success';
              else $errors[] = "Zapytanie nie mogło zostać wykonane";
            }
          } else $errors[] = "Takie zlecenie nie istnieje!";
        } else $errors[] = "Zapytanie nie mogło zostać wykonane";
      } catch(Exception $e) {
        $errors[] = "Nieznany błąd".$e;
      }
      if(!empty($errors)) echo json_encode($errors);

    break;

    case 'all':

      require_once('logged.api.php');

      try {

        $sth = $conn->prepare("SELECT * FROM zlecenia INNER JOIN klienci ON klienci.IdKlienta = zlecenia.IdKlienta ORDER BY `Data_zlozenia` DESC");

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
          user_is("Administrator");

          $zle = json_decode(file_get_contents('php://input'));


            $sth = $conn->prepare("DELETE FROM `zlecenia` WHERE `IdZlecenia` = :id LIMIT 1");
            $sth->bindParam(':id', $zle->IdZlecenia, PDO::PARAM_INT);

            if($sth->execute()) echo 'success';
            else echo 'error #1';

    break;

    default:
    break;


}
?>
