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
