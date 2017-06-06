<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Paweł Zagrobelny">
    <link rel="icon" href="../../favicon.ico">

    <title>SHIPPING Assistant</title>

    <!-- Bootstrap core CSS -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="assets/css/base.css" rel="stylesheet">
  </head>

  <body>
    <section class="logBox">
    <div class="container">
      <h1>SHIPPING<br> Assistant<small>PRO</small> </h1>
      <hr>
      <img class="avatar" src="<?= (isset($_COOKIE['avatar'])) ? $_URL.$_COOKIE['avatar'] : 'assets/img/avatars/default.jpg'?>" alt="avatar">
      <h3><?= (isset($_COOKIE['login'])) ? $_COOKIE['login'] : 'Witaj!'?></h3>
      <div style="display: <?= (isset($_GET['err'])) ? 'block' : 'none'?>" class="alert alert-danger" role="alert">
          <strong>Błąd</strong> Login lub hasło jest błędne...
      </div>
      <form method="POST" action="api/user/login">
          <input placeholder="Wpisz login" type="text" name="login" class="form-control">
          <input placeholder="Wpisz hasło" type="password" name="pass" class="form-control">
          <input class="btn btn-primary" type="submit" value="Zaloguj" class="form-control">
      </form>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/tether.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
  </body>
</html>
