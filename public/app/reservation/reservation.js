'use strict';

angular.module('myAppRename.reservation', ['ngRoute']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/reservations', {
            templateUrl: 'app/reservation/reservation.html',
            controller: 'AccordionDemoCtrl'
        });
    }]);