angular.module('KurierCMS').config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(false);

  $routeProvider
        .when('/home/', {
            templateUrl: 'app/components/home/home.html',
            controller: 'homeController',
        })
        .when('/user/add/', {
            templateUrl: 'app/components/user/userAdd.html',
            controller: 'userController',
            type: 'add'
        })
        .when('/user/all/', {
            templateUrl: 'app/components/user/users.html',
            controller: 'userController',
            type: 'all'
        })
        .when('/user/edit/', {
            templateUrl: 'app/components/user/editProfile.html',
            controller: 'userController',
            type: 'editProfile'
        })
        .when('/client/add/', {
            templateUrl: 'app/components/client/clientAdd.html',
            controller: 'clientController',
            type: 'add'
        })
        .when('/client/all/', {
            templateUrl: 'app/components/client/clients.html',
            controller: 'clientController',
            type: 'all'
        })
        .when('/contract/all/', {
            templateUrl: 'app/components/contract/contracts.html',
            controller: 'contractController',
            type: 'all'
        })
        .when('/contract/add/', {
            templateUrl: 'app/components/contract/contractAdd.html',
            controller: 'contractController',
            type: 'add'
        })
        .when('/order/all/', {
            templateUrl: 'app/components/order/orders.html',
            controller: 'orderController',
            type: 'all'
        })
        .when('/order/add/', {
            templateUrl: 'app/components/order/orderAdd.html',
            controller: 'orderController',
            type: 'add'
        })
        .when('/404/', {
            templateUrl: 'app/components/errors/404.html',
        })
        .otherwise({
            redirectTo: '/404/'
        });


});

//Route to home at app start

window.location = "#/home/";
