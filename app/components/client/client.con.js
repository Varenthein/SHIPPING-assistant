angular.module('KurierCMS').controller('clientController',function($scope, $rootScope, $route, ClientDataOp) {


  $scope.type = $route.current.$$route.type;

  /************ CLIENT->add ***************/

  if($scope.type == "add") {

      if($rootScope.user.Stanowisko != "Administrator") {
        window.location = "#/404/";
        return false; //if no permission -> get out
      }

      $rootScope.breadcrumb = ["Admin", "Klienci", "Nowy klient"];

      $scope.user = { imie: "", nazwisko: "",  adres: "", telefon: "" };


        $scope.addUser = function() {

          ClientDataOp.addClient($scope.user)
          .then(function onSuccess(response) {
            if(response.data == 'success') {
              addAlert('success', 'Dodano klienta do bazy!');
              $scope.errors = false;
              angular.copy({},$scope.user);
              $scope.userForm.$setPristine();
            }
            else {
              $scope.errors = response.data;
            }
          }).catch(function onError(response) {
              addAlert('danger', 'Cos poszlo nie tak');
            });

            window.scroll(0,0);
          }


      }

     /************ CLIENT->all ***************/

      if($scope.type == "all") {

          $rootScope.breadcrumb = ["Admin", "Klienci"];

          $scope.user = {};
          $scope.clients = [];

          //Load user groups

          $scope.loadClients = function() {

            ClientDataOp.getAll()
            .then(function onSuccess(response) {
              if(response.data != 'error') {
                  $scope.clients = response.data;
                  if(response.data === "") {
                    addAlert('danger', 'Klienci nie zostali wczytywani...');
                }
              }
              else {
                  addAlert('danger', 'Klienci nie zostali wczytywani...');
                  window.location="#/client/all/";
              }
            }).catch(function onError(response) {
                addAlert('danger', 'Klienci nie zostali wczytywani...');
                window.location="#/client/all/";
            });


          }

          $scope.loadClients();


          /*************** REMOVE CLIENT **************/

          $scope.removeClient = function(user) {

            ClientDataOp.removeClient(user)
              .then(function onSuccess(response) {
                if(response.data == 'success') {
                  addAlert('success', 'Użytkownik został usunięty!');
                  $scope.loadClients(); //refresh users
                  } else addAlert('danger', 'Cos poszlo nie tak');
                }).catch(function onError(response) {
                  addAlert('danger', 'Cos poszlo nie tak');
                });
          }


          /*************** EDIT CLIENT **************/

          $scope.editClient = function(user) {

            $scope.user.IdKlienta = user.IdKlienta;
            $scope.user.imie = user.Imie;
            $scope.user.nazwisko = user.Nazwisko;
            $scope.user.telefon = parseInt(user.Telefon);
            $scope.user.adres = user.Adres;

            $("#editClientModal").modal('show');


          }

          $scope.updateClient = function() {

            ClientDataOp.updateClient($scope.user)
              .then(function onSuccess(response) {
                if(response.data == 'success') {
                  addAlert('success', 'Klient został zmieniony!');
                  $scope.loadClients(); //refresh users
                  } else addAlert('danger', 'Cos poszlo nie tak');
                }).catch(function onError(response) {
                  addAlert('danger', 'Cos poszlo nie tak');
                });
                $("#editClientModal").modal('hide');
          }

          /*************** SHOW CLIENT **************/

          $scope.showClient = function(user) {

      
            $scope.user.imie = user.Imie;
            $scope.user.nazwisko = user.Nazwisko;
            $scope.user.telefon = parseInt(user.Telefon);
            $scope.user.adres = user.Adres;


            $("#showClientModal").modal('show');

          }


      }




});
