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
