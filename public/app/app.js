'use strict';

// Declare app level module which depends on views, and components
angular.module('myAppRename', [
    'ngRoute',
    'ui.bootstrap',
    'myAppRename.controllers',
    'myAppRename.directives',
    'myAppRename.services',
    'myAppRename.factories',
    'myAppRename.filters',
    'myAppRename.view1',
    'myAppRename.view2',
    'myAppRename.view3',
    'myAppRename.reservation'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/createUser', {
            templateUrl: 'app/createUser/createUser.html',
            controller: 'CreateUserCtrl'
        });
    }]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });


