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

    <!-- Medium-like editor -->
    <link href="assets/css/medium-editor.css" rel="stylesheet">
    <link href="assets/css/medium-editor-beagle.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Lato:700" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">


  </head>

  <body ng-app="KurierCMS">

    <section class="container">

      <!-- HEADER -->

      <header>
        <nav>
          <ul class="nav nav-pills float-right">
            <li class="nav-item">
              <div class="userBox">
                Witaj {{ $root.user.Imie + " " + $root.user.Nazwisko}}! <a class="btn btn-outline-info btn-sm" href="api/user/logout">Wyloguj</a>
              </div>
            </li>
          </ul>
        </nav>
        <h1 class="text-muted">SHIPPING Assistant</h2>
      </header>

          <!-- Angular load test  -->
          <div ng-hide="$root.angular || $root.user" class="alert alert-info">
                 <strong>Wczytywanie</strong> Angular.js przygotowuje się działania
          </div>

          <!-- Menu -->

          <nav ng-controller="menuController" class="menu dark">
              <div ng-repeat="cat in categories">
                <h4><i class="fa fa-{{ cat.icon || 'clone' }}" aria-hidden="true"></i> {{ cat.name }}</h4>
                <ul>
                  <li ng-show="($root.user.Stanowisko == link.perm || link.perm.length == undefined)" ng-repeat="link in cat.links"><a href="{{ link.url }}">{{ link.title }}</a>
                  </li>
                </ul>
              </div>
          </nav>

          <!-- Where am I? -->

          <ol class="breadcrumb">
              <li ng-repeat="slice in $root.breadcrumb" class="breadcrumb-item active">{{ slice }}</li>
          </ol>

          <!-- Pages here -->

          <ng-view></ng-view>

      <!-- FOOTER -->
      <footer class="footer">
          <p>&copy; Paweł Zagrobelny & Michał Graczyk 2017</p>
      </footer>

    </section>


    <!-- Bootstrap core JavaScript
    ================================================== -->
   <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>

   <!-- normal script imports etc  -->
   <script src="assets/js/jquery.min.js"></script>
   <script src="assets/js/tether.min.js"></script>
   <script src="assets/js/bootstrap.min.js"></script>
   <script src="assets/js/medium-editor.min.js"></script>
   <script src="assets/js/medium-editor-tables.js"></script>

   <!-- Angular vendor -->

   <script src="app/core/angular.min.js"></script>
   <script src="app/core/angular-route.min.js"></script>
   <script src="app/core/angular-medium-editor.min.js"></script>

   <!-- app -->

   <script src="app/app.js"></script>

   <!-- Services -->

   <script src="app/dist/services.js"></script>

   <!-- Controllers -->

   <script src="app/dist/controllers.js"></script>

   <!-- Routes -->

   <script src="app/app.route.js"></script>

   <!-- Insert this line after script imports -->
   <script>if (window.module) module = window.module;</script>
  </body>
</html>
