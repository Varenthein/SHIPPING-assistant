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

            $user = json_decode(file_get_contents('php://input'));

            $errors = [];

            //Check for errors

            if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->imie)) $errors[] = "Imię zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->nazwisko)) $errors[] = "Nazwisko zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^0-9]/i', $user->telefon)) $errors[] = "Telefon zawiera nieprawidłowe znaki...";
            else if($user->adres == "" or $user->telefon == "" or $user->nazwisko == "" or $user->imie == "") $errors[] = "Żadne pole nie może być puste!";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->adres)) $errors[] = "Adres zawiera nieprawidłowe znaki...";
            else {

              //Insert user to database

              $sth = $conn->prepare("INSERT INTO `klienci` ( `Imie`, `Nazwisko`, `Adres`, `Telefon`)
              VALUES (:imie, :nazwisko, :adres, :telefon);");

              //binding data

              $sth->bindParam(':imie', $user->imie, PDO::PARAM_STR);
              $sth->bindParam(':nazwisko', $user->nazwisko, PDO::PARAM_STR);
              $sth->bindParam(':adres', $user->adres, PDO::PARAM_STR);
              $sth->bindParam(':telefon', $user->telefon, PDO::PARAM_INT);

              if($sth->execute())  echo 'success'; //everthng is all right
              else $errors[] = "Zapytanie nie mogło zostać wykonane";
            }

      } catch(Exception $e) {
        $errors[] = "Nieznany błąd".$e;
      }

      if(!empty($errors)) echo json_encode($errors);

    break;

    case 'update':

      require_once('logged.api.php');
      user_is('Administrator');

      try {

        $user = json_decode(file_get_contents('php://input'));
        $errors = [];

        $sth = $conn->prepare("SELECT * FROM `klienci` WHERE `IdKlienta` = :id LIMIT 1");
        $sth->bindParam(':id', $user->idKlienta, PDO::PARAM_INT);

        if($sth->execute()) {

          $result = $sth->fetchAll();
          if(count($result) == 1) {

            //Check for errors

            if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->imie)) $errors[] = "Imię zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->nazwisko)) $errors[] = "Nazwisko zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^0-9]/i', $user->pesel)) $errors[] = "Nazwisko zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^0-9]/i', $user->telefon)) $errors[] = "Telefon zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->nazwisko)) $errors[] = "Adres zawiera nieprawidłowe znaki...";
            else if($user->adres == "" or $user->telefon == "" or $user->nazwisko == "" or $user->imie = "") $errors[] = "Żadne pole nie może być puste!";
            else {


              //Insert user to database

              $sth = $conn->prepare("UPDATE `klienci` SET `Imie` = :imie, `Nazwisko` = :nazwisko, `Adres` = :adres, `Telefon` = :telefon WHERE `IdKlienta` = :id");

              //binding data

              $sth->bindParam(':imie', $user->imie, PDO::PARAM_STR);
              $sth->bindParam(':nazwisko', $user->nazwisko, PDO::PARAM_STR);
              $sth->bindParam(':adres', $user->adres, PDO::PARAM_STR);
              $sth->bindParam(':id', $user->IdKlienta, PDO::PARAM_INT);

              if($sth->execute()) echo 'success';
              else $errors[] = "Zapytanie nie mogło zostać wykonane";
            }
          } else $errors[] = "Taki klient nie istnieje!";
        } else $errors[] = "Zapytanie nie mogło zostać wykonane";
      } catch(Exception $e) {
        $errors[] = "Nieznany błąd".$e;
      }
      if(!empty($errors)) echo json_encode($errors);

    break;

    case 'all':

      require_once('logged.api.php');

      try {

        $sth = $conn->prepare("SELECT * FROM klienci ORDER BY `nazwisko` DESC");

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

          $usr = json_decode(file_get_contents('php://input'));


            $sth = $conn->prepare("DELETE FROM `klienci` WHERE `IdKlienta` = :id LIMIT 1");
            $sth->bindParam(':id', $usr->IdKlienta, PDO::PARAM_INT);

            if($sth->execute()) echo 'success';
            else echo 'error #1';

    break;

    default:
    break;


}
?>
