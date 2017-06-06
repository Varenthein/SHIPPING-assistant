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

            $contract = json_decode(file_get_contents('php://input'));

            $errors = [];

            //verify if user exists

            $sth = $conn->prepare("SELECT * FROM `pracownicy` WHERE `IdPracownika` = :id LIMIT 1");
            $sth->bindParam(':id', $contract->Pracownik, PDO::PARAM_INT);
            if($sth->execute()) {

              $result = $sth->fetchAll();

              if(isset($result[0])) { //pass is okay

                $user = (OBJECT) $result[0];

                //Check for errors
                if(preg_match('/[^0-9]/i', $contract->Pensja)) $errors[] = "Pensja nie jest prawidłowo zapisana! [Cyfry od 0 do 9]";
                else if($contract->Pensja < 100) $errors[] = "Nie możesz zaoferować tak mało!";
                else if(validateDate($contract->Data_rozpoczecia, 'Y-m-d')) $errors[] = "Data rozpoczęcia jest nieprawidłowa!";
                else if(validateDate($contract->Data_zakonczenia, 'Y-m-d')) $errors[] = "Data zakończenia jest nieprawidłowa!";
                else if($contract->Data_zakonczenia < $contract->Data_rozpoczecia) $errors[] = "Data zakończenia nie może być starsza niż data rozpoczęcia...";
                else if(!in_array($contract->Stanowisko,['Kurier', 'Administrator'])) $errors[] = "Musisz wybrać stanowisko!";
                else if(!in_array($contract->Rodzaj,['Umowa o pracę', 'Umowa zlecenie', 'B2B'])) $errors[] = "Musisz wybrać rodaj zatrudnienia!";
                else {

                  //Insert user to database

                  $sth = $conn->prepare("INSERT INTO `umowy` (`Rodzaj`, `Pensja`, `Data_rozpoczecia`, `Data_zakonczenia`, `Stanowisko`, `IdPracownika`)
                  VALUES (:rodzaj, :pensja, :data_start, :data_end, :stanowisko, :user_id);");

                  //binding data

                  $sth->bindParam(':rodzaj', $contract->Rodzaj, PDO::PARAM_STR);
                  $sth->bindParam(':pensja', $contract->Pensja, PDO::PARAM_INT);
                  $sth->bindParam(':data_start', $contract->Data_rozpoczecia, PDO::PARAM_STR);
                  $sth->bindParam(':data_end', $contract->Data_zakonczenia, PDO::PARAM_STR);
                  $sth->bindParam(':stanowisko', $contract->Stanowisko, PDO::PARAM_STR);
                  $sth->bindParam(':user_id', $user->IdPracownika, PDO::PARAM_INT);

                  if($sth->execute()) {

                    $contract->IdUmowy = $conn->lastInsertId();

                    $sth2 = $conn->prepare("UPDATE `pracownicy` SET `IdUmowy` = :con_id WHERE `IdPracownika` = :user_id");
                    $sth2->bindParam(':con_id', $contract->IdUmowy, PDO::PARAM_INT);
                    $sth2->bindParam(':user_id', $user->IdPracownika, PDO::PARAM_INT);

                    if($sth2->execute()) echo 'success'; //everthng is all right
                    else $errors[] = "Zapytanie nie mogło zostać wykonane";
                  } else $errors[] = "Zapytanie nie mogło zostać wykonane";
                }
              } else $errors[] = "Taki użytkownik nie istnieje!";
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

        $contract = json_decode(file_get_contents('php://input'));
        $errors = [];

        $sth = $conn->prepare("SELECT * FROM `umowy` WHERE `IdUmowy` = :id LIMIT 1");
        $sth->bindParam(':id', $contract->IdUmowy, PDO::PARAM_INT);

        if($sth->execute()) {

          $result = $sth->fetchAll();
          if(count($result) == 1) {

            //Check for errors

            if(preg_match('/[^0-9]/i', $contract->Pensja)) $errors[] = "Pensja nie jest prawidłowo zapisana! [Cyfry od 0 do 9]";
            else if($contract->Pensja < 100) $errors[] = "Nie możesz zaoferować tak mało!";
            else if($contract->Data_zakonczenia < $contract->Data_rozpoczecia) $errors[] = "Data zakończenia nie może być starsza niż data rozpoczęcia...";
            else if(!in_array($contract->Stanowisko,['Kurier', 'Administrator'])) $errors[] = "Musisz wybrać stanowisko!";
            else if(!in_array($contract->Rodzaj,['Umowa o pracę', 'Umowa zlecenie', 'B2B'])) $errors[] = "Musisz wybrać rodaj zatrudnienia!";
            else {
              //Insert user to database

              $sth = $conn->prepare("UPDATE `umowy` SET `Pensja` = :pensja, `Rodzaj` = :rodzaj, `Stanowisko` = :stanowisko, `Data_rozpoczecia` = :data_start, `Data_zakonczenia` = :data_end WHERE `IdUmowy` = :id");

              //binding data

              $sth->bindParam(':rodzaj', $contract->Rodzaj, PDO::PARAM_STR);
              $sth->bindParam(':pensja', $contract->Pensja, PDO::PARAM_INT);
              $sth->bindParam(':data_start', $contract->Data_rozpoczecia, PDO::PARAM_STR);
              $sth->bindParam(':data_end', $contract->Data_zakonczenia, PDO::PARAM_STR);
              $sth->bindParam(':stanowisko', $contract->Stanowisko, PDO::PARAM_STR);
              $sth->bindParam(':id', $contract->IdUmowy, PDO::PARAM_INT);

              if($sth->execute())  echo 'success';
              else $errors[] = "Zapytanie nie mogło zostać wykonane";
            }
          } else $errors[] = "Taka umowa nie istnieje!";
        } else $errors[] = "Zapytanie nie mogło zostać wykonane";
      } catch(Exception $e) {
        $errors[] = "Nieznany błąd".$e;
      }
      if(!empty($errors)) echo json_encode($errors);

    break;

    case 'all':

      require_once('logged.api.php');

      try {

        $sth = $conn->prepare("SELECT * FROM umowy INNER JOIN pracownicy ON umowy.IdPracownika = pracownicy.IdPracownika ORDER BY `Nazwisko` DESC");

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

          $con = json_decode(file_get_contents('php://input'));


            $sth = $conn->prepare("DELETE FROM `umowy` WHERE `IdUmowy` = :id LIMIT 1");
            $sth->bindParam(':id', $con->IdUmowy, PDO::PARAM_INT);

            if($sth->execute()) echo 'success';
            else echo 'error #1';

    break;

    default:
    break;


}
?>
