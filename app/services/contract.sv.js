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
