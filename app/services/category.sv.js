DataService.factory('CategoryDataOp', ['$http', function ($http) {

    var CategoryDataOp = {};

    CategoryDataOp.getAll = function () {
        return $http.get('api/category/all');
    };


    return CategoryDataOp;

}]);
