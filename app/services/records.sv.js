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
