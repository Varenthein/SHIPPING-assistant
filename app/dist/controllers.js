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

angular.module('KurierCMS').controller('contractController',function($scope, $rootScope, $route, ContractDataOp, UserDataOp) {


  $scope.type = $route.current.$$route.type;

  /************ CONTRACT->add ***************/

  if($scope.type == "add") {

      if($rootScope.user.Stanowisko != "Administrator") {
        window.location = "#/404/";
        return false; //if no permission -> get out
      }

      $rootScope.breadcrumb = ["Admin", "Kontrakty", "Nowa umowa"];

      $scope.contract = { Rodzaj: "", Pensja: "",  Stanowisko: "", Pracownik: "", Data_rozpoczecia: "", Data_zakonczenia: "" };


      //load users without contract
      UserDataOp.getUsersWithoutContract()
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



      $scope.addContract = function() {

          ContractDataOp.addContract($scope.contract)
          .then(function onSuccess(response) {
            if(response.data == 'success') {
              addAlert('success', 'Dodano umowę dla pracownika!');
              $scope.errors = false;
              angular.copy({},$scope.contract);
              $scope.contractForm.$setPristine();
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

      /************ CONTRACT->all ***************/

       if($scope.type == "all") {

           $rootScope.breadcrumb = ["Admin", "Umowy"];

           $scope.contract = {};
           $scope.contracts = [];

           //Load user groups

           $scope.loadContracts = function() {
             ContractDataOp.getAll()
             .then(function onSuccess(response) {
               if(response.data != 'error') {
                   $scope.contracts = response.data;
                   if(response.data === "") {
                     addAlert('danger', 'Umowy nie zostały załadowane...');
                 }
               }
               else {
                   addAlert('danger', 'Umowy nie zostały załadowane..');
                   window.location="#/contract/all/";
               }
             }).catch(function onError(response) {
                 addAlert('danger', 'Umowy nie zostały załadowane..');
                 window.location="#/contract/all/";
             });
           }

           $scope.loadContracts();

             /*************** EDIT CONTRACT **************/

             $scope.editContract = function(con) {

               $scope.contract = con;
               $("#editContractModal").modal('show');

             }

             $scope.updateContract = function() {

               ContractDataOp.updateContract($scope.contract)
                 .then(function onSuccess(response) {
                   if(response.data == 'success') {
                     addAlert('success', 'Umowa została zmieniona!');
                     $scope.loadContracts(); //refresh users
                     } else addAlert('danger', 'Cos poszlo nie tak');
                   }).catch(function onError(response) {
                     addAlert('danger', 'Cos poszlo nie tak');
                   });
                   $("#editContractModal").modal('hide');
             }

             /*************** SHOW CONTRACT  **************/

             $scope.showContract = function(con) {

               $scope.contract = con;
               $("#showContractModal").modal('show');

             }

             /*************** REMOVE CLIENT **************/

             $scope.removeContract = function(con) {

               ContractDataOp.removeContract(con)
                 .then(function onSuccess(response) {
                   if(response.data == 'success') {
                     addAlert('success', 'Umowa została usunięta!');
                     $scope.loadContracts();
                     } else addAlert('danger', 'Cos poszlo nie tak');
                   }).catch(function onError(response) {
                     addAlert('danger', 'Cos poszlo nie tak');
                   });
             }



   }









});

angular.module('KurierCMS').controller('homeController',function($scope, $rootScope) {

  $rootScope.breadcrumb = ["Admin", "Home"]

});

angular.module('KurierCMS').controller('menuController',function($scope) {

    $scope.categories = [
      { name: "Zlecenia", icon: "newspaper-o", links: [
        {  title: "Dodaj przesyłkę", url: "#/order/add/" },
        {  title: "Wszystkie przesyłki", url: "#/order/all/" },
      ] },
      { name: "Pracownicy", icon: "user-o", links: [
        {  title: "Dodaj pracownika", url: "#/user/add/", perm: "Administrator" },
        {  title: "Pracownicy", url: "#/user/all/", perm: "Administrator"},
        {  title: "Edytuj profil", url: "#/user/edit/"  },
      ] },
      { name: "Umowy", icon: "handshake-o", links: [
        {  title: "Dodaj umowę", url: "#/contract/add/", perm: "Administrator" },
        {  title: "Umowy", url: "#/contract/all/" },
      ] },
      { name: "Klienci", icon: "dollar", links: [
        {  title: "Nowy klient", url: "#/client/add/", perm: "Administrator"},
        {  title: "Klienci", url: "#/client/all/" },
      ] }
    ];


});

angular.module('KurierCMS').controller('orderController',function($scope, $rootScope, $route, OrderDataOp, ClientDataOp, CategoryDataOp) {


  $scope.type = $route.current.$$route.type;

  /************ ORDERS->add ***************/

  if($scope.type == "add") {


      $rootScope.breadcrumb = ["Admin", "Zlecenia", "Nowa przesyłka"];

      $scope.order = { IdZlecenia: "", Nazwa_produktu: "", Status: "",  Stanowisko: "", Uwagi: "", Data_zlozenia: "", Data_wyslania: "", Data_wykonania: "", IdKlienta: "", IdTypu: "" };
      $scope.errors = false;

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
            window.location="#/order/all/";
        }
      }).catch(function onError(response) {
          addAlert('danger', 'Klienci nie zostali wczytywani...');
          window.location="#/order/all/";
      });

      CategoryDataOp.getAll()
      .then(function onSuccess(response) {
        if(response.data != 'error') {
            $scope.cats = response.data;
            if(response.data === "") {
              addAlert('danger', 'Typy przesyłek nie zostały załadowane...');
          }
        }
        else {
            addAlert('danger', 'Typy przesyłek nie zostały załadowane...');
            window.location="#/order/all/";
        }
      }).catch(function onError(response) {
          addAlert('danger', 'Typy przesyłek nie zostały załadowane...');
          window.location="#/order/all/";
      });


      $scope.addOrder = function() {

          OrderDataOp.addOrder($scope.order)
          .then(function onSuccess(response) {
            if(response.data == 'success') {
              addAlert('success', 'Dodano zlecenie!');
              $scope.errors = false;
              angular.copy({},$scope.order);
              $scope.orderForm.$setPristine();
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

      /************ ORDER->all ***************/

       if($scope.type == "all") {

           $rootScope.breadcrumb = ["Admin", "Umowy"];

           $scope.order = {};
           $scope.orders = [];

           //Load user groups

           $scope.loadOrders = function() {
             OrderDataOp.getAll()
             .then(function onSuccess(response) {
               if(response.data != 'error') {
                   $scope.orders = response.data;
                   if(response.data === "") {
                     addAlert('danger', 'Zlecenia nie zostały załadowane...');
                 }
               }
               else {
                   addAlert('danger', 'Zlecenia nie zostały załadowane..');
                   window.location="#/order/all/";
               }
             }).catch(function onError(response) {
                 addAlert('danger', 'Umowy nie zostały załadowane..');
                 window.location="#/order/all/";
             });
           }

           $scope.loadOrders();

             /*************** EDIT ORDER **************/


            CategoryDataOp.getAll()
              .then(function onSuccess(response) {
                if(response.data != 'error') {
                 $scope.cats = response.data;
                 if(response.data === "") {
                    addAlert('danger', 'Typy przesyłek nie zostały załadowane...');
                 }
               }
              else {
                 addAlert('danger', 'Typy przesyłek nie zostały załadowane...');
                 window.location="#/order/all/";
              }
            }).catch(function onError(response) {
                addAlert('danger', 'Typy przesyłek nie zostały załadowane...');
                window.location="#/order/all/";
            });


             $scope.editOrder = function(zle) {

               $scope.order = zle;
               $("#editOrderModal").modal('show');

             }

             $scope.updateOrder = function() {

               OrderDataOp.updateOrder($scope.order)
                 .then(function onSuccess(response) {
                   if(response.data == 'success') {
                     addAlert('success', 'Zlecenie zostało zmienione!');
                     $scope.loadOrders(); //refresh users
                     } else addAlert('danger', 'Cos poszlo nie tak');
                   }).catch(function onError(response) {
                     addAlert('danger', 'Cos poszlo nie tak');
                   });
                   $("#editOrderModal").modal('hide');
             }

             /*************** SHOW CONTRACT  **************/

             $scope.showOrder = function(zle) {

               $scope.order = zle;
               $("#showOrderModal").modal('show');

             }

             /*************** REMOVE CLIENT **************/

             $scope.removeOrder = function(zle) {

               OrderDataOp.removeOrder(zle)
                 .then(function onSuccess(response) {
                   if(response.data == 'success') {
                     addAlert('success', 'Zlecenie zostało usunięte!');
                     $scope.loadOrders();
                     } else addAlert('danger', 'Cos poszlo nie tak');
                   }).catch(function onError(response) {
                     addAlert('danger', 'Cos poszlo nie tak');
                   });
             }



   }









});

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
