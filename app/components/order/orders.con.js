angular.module('KurierCMS').controller('orderController',function($scope, $rootScope, $route, OrderDataOp, ClientDataOp, CategoryDataOp, RecordDataOp) {


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

             /*************** SHOW RECORD  **************/

             $scope.records = {};

             $scope.loadRecord = function(order) {

               RecordDataOp.getOne(order)
                 .then(function onSuccess(response) {
                   if(response.data != 'error') {
                    $scope.records = response.data;
                    if(response.data === "") {
                       addAlert('danger', 'Rejestr nie został załadowany poprawnie');
                    }
                  }
                 else {
                    addAlert('danger', 'Rejestr nie został załadowany poprawnie');
                    window.location="#/order/all/";
                 }
               }).catch(function onError(response) {
                   addAlert('danger', 'Rejestr nie został załadowany poprawnie');
                   window.location="#/order/all/";
               });

             }

             $scope.showRecord = function(zle) {

               $scope.order = zle;
               $scope.loadRecord(zle);
               $("#recordModal").modal('show');

             }


             /*************** ADD RECORD *****************/

             $scope.record = { IdWpisu: "", Data_otrzymania: "", Data_dostarczenia: "", IdPracownik: "", IdKlienta: ""};
             $scope.addRecord = function() {

                 $scope.record.IdZlecenia = $scope.order.IdZlecenia;
                 $scope.record.IdTypu = $scope.order.IdTypu;
                 RecordDataOp.addRecord($scope.record)
                 .then(function onSuccess(response) {
                   if(response.data == 'success') {
                     $scope.errors = false;
                     angular.copy({},$scope.record);
                     $scope.recordForm.$setPristine();
                     $scope.loadRecord($scope.order);
                   }
                   else {

                   }
                 }).catch(function onError(response) {

                   });

                   window.scroll(0,0);
                 }


                 /*************** REMOVE RECORD **************/

                 $scope.removeRecord = function(record) {

                   RecordDataOp.removeRecord(record)
                     .then(function onSuccess(response) {
                       if(response.data == 'success') {
                         $scope.loadRecord($scope.order);
                         } else addAlert('danger', 'Cos poszlo nie tak');
                       }).catch(function onError(response) {

                       });
                 }




             /*************** REMOVE ORDER **************/

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
