angular.module('KurierCMS').controller('menuController',function($scope) {

    $scope.categories = [
      { name: "Zlecenia", icon: "newspaper-o", links: [
        {  title: "Dodaj przesyłkę", url: "#/order/add/" },
        {  title: "Wszystkie przesyłki", url: "#/order/all/" },
      ] },
      { name: "Pracownicy", icon: "user-o", links: [
        {  title: "Dodaj pracownika", url: "#/user/add/", perm: "Administrator" },
        {  title: "Pracownicy", url: "#/user/all/", perm: "Administrator"},
        {  title: "Edytuj profil", url: "#/user/edit/"  },
      ] },
      { name: "Umowy", icon: "handshake-o", links: [
        {  title: "Dodaj umowę", url: "#/contract/add/", perm: "Administrator" },
        {  title: "Umowy", url: "#/contract/all/", perm: "Administrator" },
        {  title: "Mój kontrakt", url: "#/contract/my/" },
      ] },
      { name: "Klienci", icon: "dollar", links: [
        {  title: "Nowy klient", url: "#/client/add/", perm: "Administrator"},
        {  title: "Klienci", url: "#/client/all/" },
      ] }
    ];


});
