describe("Testing routes", function () {

    var scope, location, route, httpBackend;

    beforeEach(module("myAppRename"));

    beforeEach(inject(function ($route, $location, $rootScope, $httpBackend) {
            httpBackend = $httpBackend;
            scope = $rootScope;
            location = $location;
            route = $route;
        })
    );

    it('should give the given controller and html, from the path url', function () {
        httpBackend.expectGET('app/createUser/createUser.html').respond("");
        expect(route.current).toBeUndefined();
        location.path('/createUser');
        scope.$digest();

        expect(route.current.templateUrl).toBe('app/createUser/createUser.html');
        expect(route.current.controller).toBe("CreateUserCtrl");


    });

    it("view2 route", function () {
        httpBackend.expectGET('app/view2/view2.html').respond("");
        expect(route.current).toBeUndefined();
        location.path("/view2");
        scope.$digest();

        expect(route.current.templateUrl).toBe('app/view2/view2.html');
        expect(route.current.controller).toBe("View2Ctrl");
    });

    it("should redirect to /task1 if an unknown path is given", function () {
        httpBackend.expectGET('app/view1/view1.html').respond("");
        location.path('/UnknownPATH');
        scope.$digest();

        expect(location.path()).toBe('/view1');
        expect(route.current.templateUrl).toEqual('app/view1/view1.html');
        expect(route.current.controller).toBeUndefined();

    });

});