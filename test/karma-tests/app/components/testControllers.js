'use strict';

describe("AppCtrl", function () {

    var scope, httpBackend, location, route;

    beforeEach(module('myAppRename.controllers'));

    beforeEach(module({
        UserFactory: {
            setUser: function () {
            },
            getUser: function () {

            }
        }

    }));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location) {
        location = $location;
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        $controller("AppCtrl", {$scope: scope});
    }));

    it("should work", function () {
        expect(scope.title).toBe("Semester Project");
        expect(scope.username).toBe("");
    });

    it("should work1", function () {

        httpBackend.expectPOST('/authenticate').respond(200, {token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTUzYWUyY2Q5N2NhYjk0MjA2YjgyODgiLCJ1c2VyTmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAdGVzdC5kayIsInB3IjoiJDJhJDEwJDc2dXJwSjNYMFZYNUlsTXgxTnMuYS5waU1vZndqbjdIM2ZBR3pEMWhuWmNaNWZtUlcyRWZtIiwiYWN0aXZhdGVkIjp0cnVlLCJyb2xlIjoidXNlciIsIl9fdiI6MCwiY3JlYXRlZCI6IjIwMTUtMDUtMTNUMjA6MDA6NDUuMTAzWiJ9.V8qQ3p5-pCMnXQ7KL10xwiWgJT49S3Nt4t-e18yS5II"});

        expect(scope.isAuthenticated).toBeFalsy();
        expect(scope.isUser).toBeFalsy();
        expect(scope.isAdmin).toBeFalsy();

        scope.submit();
        httpBackend.flush();

        expect(scope.isAuthenticated).toBeTruthy();
        expect(scope.isUser).toBeTruthy();
        expect(scope.isAdmin).toBeFalsy();

        scope.logout();

        expect(scope.isAuthenticated).toBeFalsy();
        expect(scope.isUser).toBeFalsy();
        expect(scope.isAdmin).toBeFalsy();

        expect(location.path()).toBe('/view1');

    });


});

describe('CreateUserCtrl', function () {

    beforeEach(module('myAppRename.controllers'));

    var scope, httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();

        $controller("CreateUserCtrl", {$scope: scope});
    }));

    it("Should test on scope values", function () {
        expect(scope.showError).toBeFalsy();
        expect(scope.doFade).toBeFalsy();
    });

    it("should return user details, when a user is created", function () {
        var userObj = {user: "testuser", pw: "123"};
        httpBackend.expectPOST('/publicApi').respond(userObj);
        scope.makeUser();
        scope.$digest();
        expect(scope.postedUser).toBeUndefined();
        httpBackend.flush();
        expect(scope.postedUser).toEqual(userObj);
    })

});

describe("View2Ctrl", function () {

    var scope, httpBackend;

    var airlineResponse = [{airline: "MLG airlines"}, {airline: "Ryanair"}];

    beforeEach(module("myAppRename.controllers"));

    beforeEach(module({
        $modal: {
            open: function () {
            }
        }
    }));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        $controller('View2Ctrl', {$scope: scope});
    }));

    it("should return airlines when given an url, $scope.searchDateAirport", function () {
        scope.dt = new Date(1432126800841);

        scope.searchAirport = "CPH";
        var jsonAirline = JSON.stringify(airlineResponse);
        httpBackend.expectGET("userApi/flights/CPH/1432072800841").
            respond(200, [jsonAirline]);
        scope.searchDateAirport();
        scope.$digest();

        httpBackend.flush();
        expect(scope.airlines).toEqual(airlineResponse);
    });

    it('Should test if the date-picker is working correctly', function () {

        scope.dt = new Date(1432126800841);

        expect(scope.dt.getTime()).toBe(1432126800841);

        // clears the date
        scope.clear();

        expect(scope.dt).toBeNull();

    })

});

describe('AccordionDemoCtrl', function () {

    var user = {_id: 10};

    beforeEach(module('myAppRename.controllers'));

    beforeEach(module({
        UserFactory: {
            getUser: function (){
                return user;
            }
        }
    }));

    it("should get all reservations from a given userId", inject(function ($controller, $rootScope, $httpBackend) {
        var scope =  $rootScope.$new();
        $controller("AccordionDemoCtrl", {$scope: scope});
        $httpBackend.expectGET('userApi/reservation/10').respond('ryanair ticket');
        scope.$digest();
        expect(scope.reservation).toBeUndefined();
        $httpBackend.flush();
        expect(scope.reservations).toBe('ryanair ticket');

    }));

});
