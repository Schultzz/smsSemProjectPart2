describe('myAppRename.factories', function () {

    beforeEach(module('myAppRename.factories'));

    describe('InfoFactory', function () {
        var infoFactory;
        beforeEach(inject(function (_InfoFactory_) {
            infoFactory = _InfoFactory_;
        }));

        it('Should be Hello World from a Factory', function () {
            expect(infoFactory.getInfo()).toBe("Hello World from a Factory");
        });
    });


    describe('UserFactory', function () {
        var userFactory;

        beforeEach(inject(function (_UserFactory_) {
            userFactory = _UserFactory_;
        }));

        it("should work", function () {
            var name = "Hans";

            expect(userFactory.getUser()).toEqual({});

            userFactory.setUser(name);

            expect(userFactory.getUser()).toBe(name);
        });


    });
});