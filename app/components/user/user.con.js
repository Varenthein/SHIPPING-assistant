angular.module('KurierCMS').controller('userController',function($scope, $rootScope, $route, UserDataOp) {


  $scope.type = $route.current.$$route.type;

  /************ USER->add ***************/

  if($scope.type == "add") {

      if($rootScope.user.Stanowisko != "Administrator") {
        window.location = "#/404/";
        return false; //if no permission -> get out
      }

      $rootScope.breadcrumb = ["Admin", "Użytkownicy", "Dodaj pracownika"];

      $scope.user = { login: "", pass: "", repass: "", imie: "", nazwisko: "", pesel: "", adres: "", telefon: "" };


        $scope.addUser = function() {

          var file = $scope.avatar;

          UserDataOp.addUser($scope.user, file)
          .then(function onSuccess(response) {
            if(response.data == 'success') {
              addAlert('success', 'Dodano użytkownika!');
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

          $scope.userExists = function() {

            UserDataOp.userExists({ login: $scope.user.login })
              .then(function onSuccess(response) {
                if(response.data == 'false') {
                    $scope.loginOccupied = false;
                  } else $scope.loginOccupied = true;
                }).catch(function onError(response) {
                  addAlert('danger', 'Cos poszlo nie tak');
                });
          }



      }

     /************ USER->all ***************/

      if($scope.type == "all") {

          if($rootScope.user.Stanowisko != "Administrator") {
            window.location = "#/404/";
            return false; //if no permission -> get out
          }

          $rootScope.breadcrumb = ["Admin", "Użytkownicy"];
          
          $scope.users = [];
          $scope.user = {};

          //Load user groups

          $scope.loadUsers = function() {

            UserDataOp.getAll()
            .then(function onSuccess(response) {
              if(response.data != 'error') {
                  $scope.users = response.data;
                  if(response.data === "") {
                    addAlert('danger', 'Użytkownicy nie zostali wczytywani...');
                }
              }
              else {
                  addAlert('danger', 'Użytkownicy nie zostali wczytywani...');
                  window.location="#/user/all/";
              }
            }).catch(function onError(response) {
                addAlert('danger', 'Użytkownicy nie zostali wczytywani...');
                window.location="#/user/all/";
            });

            UserDataOp.getUsersWithoutContract()
            .then(function onSuccess(response) {
              if(response.data != 'error') {
                  $scope.usersWithoutContract = response.data;
                  if(response.data === "") {
                    addAlert('danger', 'Użytkownicy nie zostali wczytywani...');
                }
              }
              else {
                  addAlert('danger', 'Użytkownicy nie zostali wczytywani...');
                  window.location="#/user/all/";
              }
            }).catch(function onError(response) {
                addAlert('danger', 'Użytkownicy nie zostali wczytywani...');
                window.location="#/user/all/";
            });

          }

          $scope.loadUsers();


          /*************** REMOVE USER **************/

          $scope.removeUser = function(user) {

            UserDataOp.removeUser(user)
              .then(function onSuccess(response) {
                if(response.data == 'success') {
                  addAlert('success', 'Użytkownik został usunięty!');
                  $scope.loadUsers(); //refresh users
                  } else addAlert('danger', 'Cos poszlo nie tak');
                }).catch(function onError(response) {
                  addAlert('danger', 'Cos poszlo nie tak');
                });
          }


          /*************** EDIT USER **************/

          $scope.editUser = function(user) {

            $scope.user.IdPracownika = user.IdPracownika;
            $scope.user.login = user.Login;
            $scope.user.pass = "";
            $scope.user.repass = "";
            $scope.user.imie = user.Imie;
            $scope.user.telefon = parseInt(user.Telefon);
            $scope.user.pesel = parseInt(user.Pesel);
            $scope.user.adres = user.Adres;
            $scope.user.nazwisko = user.Nazwisko;

            $scope.userForm.$setPristine();

            $("#editUserModal").modal('show');


          }

          $scope.updateUser = function() {

            UserDataOp.updateUser($scope.user)
              .then(function onSuccess(response) {
                if(response.data == 'success') {
                  addAlert('success', 'Użytkownik został zmieniony!');
                  $scope.loadUsers(); //refresh users
                  } else addAlert('danger', 'Cos poszlo nie tak');
                }).catch(function onError(response) {
                  addAlert('danger', 'Cos poszlo nie tak');
                });
                $("#editUserModal").modal('hide');
          }

          /*************** SHOW USER **************/

          $scope.showUser = function(user) {

            $scope.user.IdPracownika = user.IdPracownika;
            $scope.user.login = user.Login;
            $scope.user.pass = "";
            $scope.user.repass = "";
            $scope.user.imie = user.Imie;
            $scope.user.telefon = parseInt(user.Telefon);
            $scope.user.pesel = parseInt(user.Pesel);
            $scope.user.adres = user.Adres;
            $scope.user.nazwisko = user.Nazwisko;

            $("#showUserModal").modal('show');

          }


      }

      /************ USER->edit profile ***************/

       if($scope.type == "editProfile") {


           /*************** EDIT USER **************/

             $scope.user = {};

             $scope.user.IdPracownika = $rootScope.user.IdPracownika;
             $scope.user.login = $rootScope.user.Login;
             $scope.user.pass = "";
             $scope.user.repass = "";
             $scope.user.imie = $rootScope.user.Imie;
             $scope.user.telefon = parseInt($rootScope.user.Telefon);
             $scope.user.pesel = parseInt($rootScope.user.Pesel);
             $scope.user.adres = $rootScope.user.Adres;
             $scope.user.nazwisko = $rootScope.user.Nazwisko;


           $scope.updateUser = function() {

             UserDataOp.updateUser($scope.user)
               .then(function onSuccess(response) {
                 if(response.data == 'success') {
                   addAlert('success', 'Użytkownik został zmieniony!');
                   } else addAlert('danger', 'Cos poszlo nie tak');
                 }).catch(function onError(response) {
                   addAlert('danger', 'Cos poszlo nie tak');
                 });
                 $("#editUserModal").modal('hide');
           }


       }

}).directive("compareTo",function() {
return {
    require: "ngModel",
    scope: {
        otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
            return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
            ngModel.$validate();
        });
    }
};
}).directive('fileModel', ['$parse', function ($parse) {
      return {
         restrict: 'A',
         link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                  modelSetter(scope, element[0].files[0]);
                  });
            });
         }
    };
 }]);
