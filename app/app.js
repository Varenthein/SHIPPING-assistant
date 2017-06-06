var app = angular.module('KurierCMS',['ngRoute','DataService','angular-medium-editor']);
var DataService = angular.module('DataService', []);

app.run(function($rootScope, $http, UserDataOp) {

  //APP setings
  $rootScope.APIurl = "api/";
  $rootScope.angular = true;
  $rootScope.breadcrumb = ["SHIPPING Assistant PRO", "Admin"];

  /**************** FUNCTIONS ******************/

  //get user info function
  $rootScope.getUser = function() {

      UserDataOp.getLoggedUser().then(function onSuccess(user) {
        if(user.data == 'error') window.location = "api/user/logout"; //if user doesnt exist -> logout
        else {
           $rootScope.user = user.data; //if user is verified, save user data to $rootScope.user
        }
      }).catch(function onError(response) { //if something wrong -> logout
           window.location = "api/user/logout";
        });

    }


    //confirmBox function

    $rootScope.confirmBox = function(title = "Brak tytułu", text = "Jesteś pewny?", fun, cat) {

        var box = document.createElement('DIV');
        box.className = 'modal fade';
        box.innerHTML = `
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>${text}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary modal-confirm">Kontynuuj</button>
              <button type="button" class="btn btn-secondary modal-close" data-dismiss="modal">Anuluj</button>
            </div>
          </div>
        </div>
        `;
        document.body.appendChild(box);
        box.querySelector(".modal-confirm").addEventListener('click', function() { fun(cat);
          jQuery(box).modal('hide');
          document.body.removeChild(box);
        });
        box.querySelector(".modal-close").addEventListener('click', function() {
          document.body.removeChild(box);
        });

        jQuery(box).modal('show');


    }


   /**************** CONFIG ******************/

      $rootScope.$on('$routeChangeStart', //on route change
            function(event, next, current) {
                $("ng-view").html('<h2>Wczytywanie...</h2><hr>'); //set ng-view to "Loading...";
                $rootScope.getUser(); //verify user
      });

    /**************** STARTUP ******************/

    $rootScope.getUser(); //verify user at start


});

/************ Interceptors *************/

app.factory('myHttpInterceptor', function ($q, $rootScope) {
    return {
        response: function (response) {
            // do something on success
            if(response.config.method === "POST") $rootScope.getUser();
            return response;
        },
        responseError: function (response) {
            // do something on error
            return $q.reject(response);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
});


/************ Filters *************/

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

/************ Additional functions *************/

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        //console.log(array[i][attr], "=",value," dla ",i);
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
 }

 Array.prototype.getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
    return -1;
}

/* Additional features */

function addAlert(type = 'info', text) {

  var box = document.createElement('DIV');
  box.className = 'alert test alert-'+type;
  box.style.setProperty('display', 'none');
  box.innerHTML = text;
  jQuery('ng-view').prepend(box);
  jQuery(box).fadeIn(500).delay(3000).fadeOut(500);

}
