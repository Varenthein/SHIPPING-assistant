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
