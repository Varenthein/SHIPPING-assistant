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
