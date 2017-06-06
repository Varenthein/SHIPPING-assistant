<?php
header('Content-Type: text/html; charset=utf-8');

// Set db credientialts

$_HOST = "localhost";
$_LOGIN = "root";
$_PASS = "";
$_DB = "kurier";
$_DEBUG = 0;
$_URL = "http://127.0.0.1/kurier/";

//Estabilish connection with the database

try {
    $conn = new PDO("mysql:host=$_HOST;dbname=$_DB;charset=utf8", $_LOGIN, $_PASS);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    ($_DEBUG == 1) ? print "Connected successfully!" : "";
}
catch(PDOException $e) {
    ($_DEBUG == 1) ? print  "Connection failed: ".$e->getMessage() : "";
}


/* SESSION MANAGEMENT */

  session_start();
  if(isset($_SESSION['id'])) {

    //regenerate SESSION
    $sth = $conn->prepare("SELECT * FROM `pracownicy` WHERE `session` = :s_id LIMIT 1");
    $sth->bindParam(':s_id', $_SESSION['id'], PDO::PARAM_STR);
    $sth->execute();
    $result = $sth->fetchAll();
    if(isset($result[0])) {
      $user = (OBJECT) $result[0];
      $_SESSION['id'] = $user->hash.salt(10);
      $sth = $conn->prepare("UPDATE `pracownicy` SET `session` = '".$_SESSION['id']."', `last_logged` = Now() WHERE `IdPracownika` = '".$user->IdPracownika."' LIMIT 1");
      $sth->execute();
      //select permissions
      $sth = $conn->prepare("SELECT `Stanowisko` FROM `umowy` WHERE `IdPracownika` = :user_id LIMIT 1");
      $sth->bindParam(':user_id', $user->IdPracownika, PDO::PARAM_INT);
      $sth->execute();
      $result = $sth->fetchAll();
      if(isset($result[0])) {
        $user->Stanowisko = $result[0]['Stanowisko'];
      } else $user->Stanowisko = "brak";

    } else {
      session_destroy();
      header('Location: index.php');
    }

  }

//check perm function
function user_is($role) {
   global $user;
   if(!isset($user->Stanowisko) or ($user->Stanowisko != $role)) die("[\"Access denied...\"]");

}

//Salt generator

function salt($length = 10) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
    $randomString .= $characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
}
//JSON data management function
function raw_json_encode($input, $flags = 0) {
  $fails = implode('|', array_filter(array(
        '\\\\',
        $flags & JSON_HEX_TAG ? 'u003[CE]' : '',
        $flags & JSON_HEX_AMP ? 'u0026' : '',
        $flags & JSON_HEX_APOS ? 'u0027' : '',
        $flags & JSON_HEX_QUOT ? 'u0022' : '',
    )));
    $pattern = "/\\\\(?:(?:$fails)(*SKIP)(*FAIL)|u([0-9a-fA-F]{4}))/";
    $callback = function ($m) {
        return html_entity_decode("&#x$m[1];", ENT_QUOTES, 'UTF-8');
    };
  return preg_replace_callback($pattern, $callback, json_encode($input, $flags));
}

//load url
function loadUrl($url) {
  header("Location: ".$_URL.$url);
}

//validate date

function validateDate($date, $format = 'Y-m-d H:i:s')
{
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}


?>
