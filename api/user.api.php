<?php

//Connect with database
require_once('main.api.php');

if(!$_GET['action']) die();

//select action
switch($_GET['action']) {

    case 'login':

    //Getting salt from the database

    $sth = $conn->prepare("SELECT `hash` FROM `pracownicy` WHERE `login` = :login LIMIT 1");
    $sth->bindParam(':login', $_POST['login'], PDO::PARAM_STR);
    $sth->execute();

    /* Fetch result */
    $result = $sth->fetchAll();

    if(isset($result[0])) {

      $_HASH = hash('sha256',$result[0]['hash']);
      $_LOGIN = $_POST['login'];
      $_PASS = hash('sha256',($_POST['pass'].$_HASH."yRdA"));

      $sth = $conn->prepare("SELECT * FROM `pracownicy` WHERE `login` = :login AND `password` = :pass LIMIT 1");
      $sth->bindParam(':pass', $_PASS, PDO::PARAM_STR);
      $sth->bindParam(':login', $_LOGIN, PDO::PARAM_STR);
      if($sth->execute()) {

        $result = $sth->fetchAll();
        if(isset($result[0])) { //pass is okay
          $user = (OBJECT) $result[0];
          $ses_id = $user->hash.salt(10);
          $sth = $conn->prepare("UPDATE `pracownicy` SET `session` = '".$ses_id."', `last_logged` = Now() WHERE `IdPracownika` = '".$user->IdPracownika."' LIMIT 1");
          if($sth->execute()) {
            $_SESSION['id'] = $ses_id;
            $_SESSION['logged'] = 1;
            setcookie("login", $user->Imie.' '.$user->Nazwisko, time() + 3600,'/');
            setcookie('avatar', $user->avatar, time() + 3600,'/');
          }

          header("Location: ../../index.php");
        } else header("Location: ../../index.php?err=logerror");




      } else  header("Location: ../../index.php?err=logerror");
    } else header("Location: ../../index.php?err=logerror");

    break;

    case 'logout':

    require_once('logged.api.php');
    $sth = $conn->prepare("UPDATE `pracownicy` SET `session` = '' WHERE `session` = :session LIMIT 1");
    $sth->bindParam(':session', $_SESSION['id'], PDO::PARAM_STR);
    $sth->execute();
    session_destroy();
    header('Location: ../../index.php');

    break;

    case 'exists':

      $user = json_decode(file_get_contents('php://input'));

      $sth = $conn->prepare("SELECT `hash` FROM `pracownicy` WHERE `Login` = :login LIMIT 1");
      $sth->bindParam(':login', $user->login, PDO::PARAM_STR);

      if($sth->execute()) {

        $result = $sth->fetchAll();
        if(count($result) > 0) echo 'true';
        else echo 'false';

      } else echo 'false';

    break;

    case 'get':

      if(isset($user->IdPracownika)) echo json_encode($user); else echo 'error';

    break;

    case 'all':

      require_once('logged.api.php');
      user_is('Administrator');

      try {

        $sth = $conn->prepare("SELECT * FROM pracownicy INNER JOIN umowy ON umowy.IdPracownika = pracownicy.IdPracownika ORDER BY `nazwisko` DESC");

        if($sth->execute()) {
          $result = $sth->fetchAll();
          echo json_encode(array_values($result));
        } else echo 'error';

       } catch(Exception $e) {
        echo 'error';
       }

    break;

    case 'withoutContract':

        require_once('logged.api.php');
        user_is('Administrator');

        try {

          $sth = $conn->prepare("SELECT * FROM pracownicy WHERE `IdUmowy` = 0 ORDER BY `nazwisko` DESC");

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

          if($user->IdPracownika != $usr->IdPracownika) { //checks if user doesnt want to remove himself

            $sth = $conn->prepare("DELETE FROM `pracownicy` WHERE `IdPracownika` = :id LIMIT 1");
            $sth->bindParam(':id', $usr->IdPracownika, PDO::PARAM_INT);

            if($sth->execute()) echo 'success';
            else echo 'error #1';

          } else echo 'error #0';

    break;

    case 'add':

      require_once('logged.api.php');
      user_is('Administrator');

      try {

        $user = (OBJECT) $_POST;
        $errors = [];

        $sth = $conn->prepare("SELECT `hash` FROM `pracownicy` WHERE `login` = :login LIMIT 1");
        $sth->bindParam(':login', $user->login, PDO::PARAM_STR);

        if($sth->execute()) {

          $result = $sth->fetchAll();
          if(count($result) == 0) {

            //Check for errors
            if(strlen($user->login) < 6 or strlen($user->login) > 25) $errors[] = "Długość loginu jest nieprawdidłowa";
            else if(strlen($user->pass) < 6) $errors[] = "Hasło jest za krótkie";
            else if($user->pass != $user->repass) $errors[] = "Hasło nie są takie same";
            else if(preg_match('/[^a-z_\-0-9]/i', $user->login)) $errors[] = "Login zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->imie)) $errors[] = "Imię zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->nazwisko)) $errors[] = "Nazwisko zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^0-9]/i', $user->pesel)) $errors[] = "Nazwisko zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^0-9]/i', $user->telefon)) $errors[] = "Telefon zawiera nieprawidłowe znaki...";
            else if($user->adres == "" or $user->telefon == "" or $user->nazwisko == "" or $user->imie == "") $errors[] = "Żadne pole nie może być puste!";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->adres)) $errors[] = "Adres zawiera nieprawidłowe znaki...";
            else {

              $_SALT = salt(10);
              $_PASS = hash('sha256',($user->pass.hash('sha256',$_SALT)."yRdA"));

              //Insert user to database

              $sth = $conn->prepare("INSERT INTO `pracownicy` (`Login`, `Imie`, `Nazwisko`, `Pesel`, `IdUmowy`, `Adres`, `Telefon`, `session`, `last_logged`, `password`, `hash`, `avatar`)
              VALUES (:login, :imie, :nazwisko, :pesel, '', :adres, :telefon, '', '', :pass, :hash, '');");

              //binding data
    
              $sth->bindParam(':login', $user->login, PDO::PARAM_STR);
              $sth->bindParam(':imie', $user->imie, PDO::PARAM_STR);
              $sth->bindParam(':nazwisko', $user->nazwisko, PDO::PARAM_STR);
              $sth->bindParam(':pesel', $user->pesel, PDO::PARAM_INT);
              $sth->bindParam(':adres', $user->adres, PDO::PARAM_STR);
              $sth->bindParam(':telefon', $user->telefon, PDO::PARAM_INT);
              $sth->bindParam(':pass', $_PASS, PDO::PARAM_STR);
              $sth->bindParam(':hash', $_SALT, PDO::PARAM_STR);


              if($sth->execute()) {

                //upload avatar
                if(isset($_FILES['file'])) {

                  $file = rand(1000,100000)."-".$conn->lastInsertId().".".pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
                  $file_loc = $_FILES['file']['tmp_name'];
                  $file_size = $_FILES['file']['size'];
                  $file_type = $_FILES['file']['type'];
                  $folder="../assets/img/avatars/";

                  if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
                    $errors[] = "Użytkownik dodany, ale avatar nie został ustawiony";
                  }
                  else {
                    $info = getimagesize($_FILES['file']['tmp_name']);
                    if ($info === FALSE) {
                      $errors[] = "Użytkownik dodany, ale avatar nie został ustawiony";
                    } else {
                      if (($info[2] !== IMAGETYPE_GIF) && ($info[2] !== IMAGETYPE_JPEG) && ($info[2] !== IMAGETYPE_PNG)) {
                      $errors[] = "Użytkownik dodany, ale format zdjecia niepoprawny (dozwolone: GIF/JPG/PNG)";
                    } else { //no errors
                      if(move_uploaded_file($file_loc,$folder.$file)) {
                        $user->IdPracownika = $conn->lastInsertId();
                        $user->avatar = 'assets/img/avatars/'.$file;
                        $sth= $conn->prepare("UPDATE `pracownicy` SET `avatar` = :avatar WHERE `IdPracownika` = :id");
                        $sth->bindParam(':id', $user->IdPracownika, PDO::PARAM_INT);
                        $sth->bindParam(':avatar',$user->avatar,PDO::PARAM_STR);
                        if($sth->execute()) { echo 'success'; } else $errors[] = "Użytkownik dodany, ale avatar nie został ustawiony";
                      }
                      else $errors[] = "Użytkownik dodany, ale avatar nie został ustawiony";
                      }
                    }
                  }

                } else echo 'success'; //everthng is all right
              }
              else $errors[] = "Zapytanie nie mogło zostać wykonane";
            }
          } else $errors[] = "Login jest już zajęty... :(";
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

        $user = json_decode(file_get_contents('php://input'));
        $errors = [];

        $sth = $conn->prepare("SELECT `hash` FROM `pracownicy` WHERE `login` = :login LIMIT 1");
        $sth->bindParam(':login', $user->login, PDO::PARAM_STR);

        if($sth->execute()) {

          $result = $sth->fetchAll();
          if(count($result) == 1) {

            //Check for errors
            if(strlen($user->login) < 6 or strlen($user->login) > 25) $errors[] = "Długość loginu jest nieprawdidłowa";
            else if($user->pass != "" && strlen($user->pass) < 6) $errors[] = "Hasło jest za krótkie";
            else if($user->pass != "" && $user->pass != $user->repass) $errors[] = "Hasło nie są takie same";
            else if(preg_match('/[^a-z_\-0-9]/i', $user->login)) $errors[] = "Login zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->imie)) $errors[] = "Imię zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->nazwisko)) $errors[] = "Nazwisko zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^0-9]/i', $user->pesel)) $errors[] = "Nazwisko zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^0-9]/i', $user->telefon)) $errors[] = "Telefon zawiera nieprawidłowe znaki...";
            else if(preg_match('/[^\xa-z_\-0-9ąćęłńóśźżĄĘŁŃÓŚŹŻ]/i', $user->nazwisko)) $errors[] = "Adres zawiera nieprawidłowe znaki...";
            else if($user->adres == "" or $user->telefon == "" or $user->nazwisko == "" or $user->imie == "") $errors[] = "Żadne pole nie może być puste!";
            else {


              //Insert user to database

              $sth = $conn->prepare("UPDATE `pracownicy` SET `Login` = :login, `Imie` = :imie, `Nazwisko` = :nazwisko, `Pesel` = :pesel,  `Adres` = :adres, `Telefon` = :telefon WHERE `IdPracownika` = :id");

              //binding data

              $sth->bindParam(':login', $user->login, PDO::PARAM_STR);
              $sth->bindParam(':imie', $user->imie, PDO::PARAM_STR);
              $sth->bindParam(':nazwisko', $user->nazwisko, PDO::PARAM_STR);
              $sth->bindParam(':pesel', $user->pesel, PDO::PARAM_INT);
              $sth->bindParam(':adres', $user->adres, PDO::PARAM_STR);
              $sth->bindParam(':telefon', $user->telefon, PDO::PARAM_INT);
              $sth->bindParam(':id', $user->IdPracownika, PDO::PARAM_INT);

              if($sth->execute()) {

                  if($user->pass != "") {

                    $_SALT = salt(10);
                    $_PASS = hash('sha256',($user->pass.hash('sha256',$_SALT)."yRdA"));

                    $sth = $conn->prepare("UPDATE `pracownicy` SET `password` = :pass, `hash` = :salt WHERE `IdPracownika` = :id");

                    //binding data

                    $sth->bindParam(':pass', $_PASS, PDO::PARAM_STR);
                    $sth->bindParam(':salt', $_SALT, PDO::PARAM_STR);
                    $sth->bindParam(':id', $user->IdPracownika, PDO::PARAM_INT);

                    if($sth->execute()) echo 'success';
                    else $errors[] = "Nie udało się zmienić hasła";

                  }
                  else echo 'success';

              }
              else $errors[] = "Zapytanie nie mogło zostać wykonane";
            }
          } else $errors[] = "Taki użytkownik nie istnieje!";
        } else $errors[] = "Zapytanie nie mogło zostać wykonane";
      } catch(Exception $e) {
        $errors[] = "Nieznany błąd".$e;
      }
      if(!empty($errors)) echo json_encode($errors);

    break;

    default:
    break;


}
?>
