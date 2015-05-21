describe('myAppRename.view2 view2Ctrl', function () {

    var scope, httpBackendMock, modal, ctrl;
    var testResponse = {msg: "Test Message"};
    var airlineResponse = [{airline : "MLG airlines"}, {airline: "Ryanair"}];

    beforeEach(module('myAppRename.controllers'));

    //Faking the modal service.
    beforeEach(module({
        $modal: {
            open: function () {
            }
        }
    }));

    beforeEach(inject(function ($httpBackend, $rootScope, $controller) {
        httpBackendMock = $httpBackend;
        httpBackendMock.expectGET('userApi/test').
            respond(testResponse);
        httpBackendMock.expectGET('userApi/flights/CPH/1483574400000')
            .respond(testResponse);

        scope = $rootScope.$new();
        ctrl = $controller('View2Ctrl', {$scope: scope});
    }));

    it('Should fetch two names ', function () {
        expect(scope.info).toBeUndefined();
        httpBackendMock.flush();
        expect(scope.info.msg).toEqual("Test Message");
    });


    //TODO Is not working, parsing json object before it gets parsed by the controller.
    //it("Should fetch all flights from a given destination and date", function () {
    //    //Sets the date in the scope
    //    scope.dt = new Date(1432126800841);
    //
    //    scope.dt.setHours = function () {
    //    };
    //    scope.dt.setMinutes = function () {
    //    };
    //    scope.dt.setSeconds = function () {
    //    };
    //    scope.searchAirport = "CPH";
    //
    //    var jsonAirline = JSON.stringify(airlineResponse);
    //    httpBackendMock.expectGET("userApi/flights/CPH/1432126800841").
    //        respond(200,[{"test": "test"}]);
    //    scope.searchDateAirport();
    //    //scope.$digest();
    //
    //    httpBackendMock.flush();
    //    console.log(scope.airlines);
    //
    //
    //})

    it('Should test if the date-picker is working correctly', function(){

        expect(scope.dt).toEqual(new Date());

        // clears the date
        scope.clear();

        expect(scope.dt).toBeNull();

        // open the date-picker

        //TODO fake event?
        //element = angular.element("<div ng-click=(open())></div>");
        //
        //scope.open(element);
        //
        //expect(scope.opened).toBeTruthy();

    })

});