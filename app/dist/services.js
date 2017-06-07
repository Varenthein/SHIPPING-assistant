DataService.factory('CategoryDataOp', ['$http', function ($http) {

    var CategoryDataOp = {};

    CategoryDataOp.getAll = function () {
        return $http.get('api/category/all');
    };


    return CategoryDataOp;

}]);

DataService.factory('ClientDataOp', ['$http', function ($http) {

    var ClientDataOp = {};

    ClientDataOp.addClient = function (user) {
        return $http.post('api/client/add', user);
    };

    ClientDataOp.getAll = function () {
        return $http.get('api/client/all');
    };

    ClientDataOp.removeClient = function (user) {
        return $http.post('api/client/remove', user);
    };

    ClientDataOp.updateClient = function (user) {
        return $http.post('api/client/update', user);
    };

    return ClientDataOp;

}]);

DataService.factory('ContractDataOp', ['$http', function ($http) {

    var ContractDataOp = {};

    ContractDataOp.addContract = function (con) {
        return $http.post('api/contract/add', con);
    };

    ContractDataOp.getAll = function () {
        return $http.get('api/contract/all');
    };

    ContractDataOp.getMy = function () {
        return $http.get('api/contract/my');
    };

    ContractDataOp.removeContract = function (con) {
        return $http.post('api/contract/remove', con);
    };

    ContractDataOp.updateContract = function (con) {
        return $http.post('api/contract/update', con);
    };

    return ContractDataOp;

}]);

DataService.factory('OrderDataOp', ['$http', function ($http) {

    var OrderDataOp = {};

    OrderDataOp.addOrder = function (order) {
        return $http.post('api/order/add', order);
    };

    OrderDataOp.getAll = function () {
        return $http.get('api/order/all');
    };

    OrderDataOp.removeOrder = function (order) {
        return $http.post('api/order/remove', order);
    };

    OrderDataOp.updateOrder = function (order) {
        return $http.post('api/order/update', order);
    };

    return OrderDataOp;

}]);

DataService.factory('RecordDataOp', ['$http', function ($http) {

    var RecordDataOp = {};

    RecordDataOp.addRecord = function (con) {
        return $http.post('api/record/add', con);
    };

    RecordDataOp.getOne = function (order) {
        return $http.post('api/record/all', order);
    };

    RecordDataOp.removeRecord = function (con) {
        return $http.post('api/record/remove', con);
    };

    return RecordDataOp;

}]);

DataService.factory('UserDataOp', ['$http', function ($http) {

    var UserDataOp = {};

    UserDataOp.addUser = function (user, file) {
        var fd = new FormData();
        fd.append('file', file);
        for(var u in user) {
        if (user.hasOwnProperty(u)) {
           fd.append(u, user[u]);
        }
    }
        return $http.post('api/user/add', fd, {
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined,'Process-Data': false}
         });
    };

    UserDataOp.userExists = function (user) {
        return $http.post('api/user/exists', user);
    };

    UserDataOp.updateUser = function (user) {
        return $http.post('api/user/update', user);
    };

    UserDataOp.getLoggedUser = function () {
        return $http.get('api/user/get');
    };

    UserDataOp.getAll = function () {
        return $http.get('api/user/all');
    };

    UserDataOp.getUsersWithoutContract = function () {
        return $http.get('api/user/withoutContract');
    };

    UserDataOp.removeUser = function (user) {
        return $http.post('api/user/remove', user);
    };


    return UserDataOp;

}]);
