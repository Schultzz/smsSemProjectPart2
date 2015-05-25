angular.module('myAppRename.controllers', []).
    controller('AppCtrl', function ($scope, $http, $window, $location, UserFactory) {

        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
        }


        $scope.title = "Semester Project";
        $scope.username = "";
        $scope.isAuthenticated = false;
        $scope.isAdmin = false;
        $scope.isUser = false;
        $scope.message = '';
        $scope.error = null;

        $scope.submit = function () {
            $http
                .post('/authenticate', $scope.user)
                .success(function (data, status, headers, config) {

                    $window.sessionStorage.token = data.token;
                    $scope.isAuthenticated = true;
                    var encodedProfile = data.token.split('.')[1];
                    var profile = JSON.parse(url_base64_decode(encodedProfile));
                    UserFactory.setUser(profile);
                    $scope.username = profile.userName;
                    $scope.isAdmin = profile.role == "admin";
                    $scope.isUser = !$scope.isAdmin;
                    $scope.error = null;
                    $location.path("/view1");
                })

                .error(function (data, status, headers, config) {

                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;
                    $scope.isAuthenticated = false;

                    $scope.error = data;
                });
        };

        $scope.logout = function () {
            $scope.isAuthenticated = false;
            $scope.isAdmin = false;
            $scope.isUser = false;
            delete $window.sessionStorage.token;
            $location.path("/view1");
        }
    })
    // ---------------------- CreateUser controller ----------------------
    .controller('CreateUserCtrl', function ($scope, $http, $timeout) {

        $scope.showError = false;
        $scope.doFade = false;

        $scope.makeUser = function () {

            $scope.showError = false;
            $scope.doFade = false;

            $scope.showError = true;

            var url = "/publicApi";

            var payLoad = {
                "userName": $scope.userNameForm,
                "email": $scope.emailForm,
                "password": $scope.passwordForm,
                "role": "user"
            };
            $http.post(url, payLoad)
                .success(function (data, status, headers, config) {
                    //what the f? why doesnt it return a success or error?
                    $scope.postedUser = data;
                })
                .error(function (data, status, headers, config) {
                    console.log("ere")
                });


            $timeout(function () {
                $scope.doFade = true;
            }, 3000);

            $scope.userNameForm = "";
            $scope.emailForm = "";
            $scope.passwordForm = "";
        }
    })
    // ---------------------- View2 controller ----------------------
    .controller('View2Ctrl', ['$scope', '$modal', '$http', '$log', function ($scope, $modal, $http, $log) {

        // -------------- Search function :startAirport / :startDate --------------

        $scope.searchDateAirport = function () {

            $scope.searchTable1 = false;
            $scope.loader = true;

            $scope.dt.setHours(0);
            $scope.dt.setMinutes(0);
            $scope.dt.setSeconds(0);

            $http.get("userApi/flights/" + $scope.searchAirport + "/" + new Date($scope.dt).getTime())
                .success(function (data) {

                    $scope.loader = false;
                    $scope.searchTable1 = true;

                    var arrAirlines = [];

                    data.forEach(function (elem) {
                        elem = JSON.parse(elem);
                        if (elem instanceof Array) {
                            elem.forEach(function (airlines) {
                                arrAirlines.push(airlines);
                            });
                        }
                    });
                    $scope.airlines = arrAirlines;
                })
                .error(function (err) {
                    $scope.loader = false;
                    $scope.noFlightAlert = true;
                    console.log("error", err);
                });
        };

        //-------------- Date picker to searchDateAirport function --------------

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

        //-------------- Modal to searchDateAirport table --------------

        $scope.animationsEnabled = true;

        $scope.openRes = function (airline) {

            $scope.items = airline;
            var size = "lg";

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };


    }])
    // ---------------------- ModalInstance controller ----------------------
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, UserFactory, $http, $location) {
        $scope.passengers = [{firstName: "", lastName: "", city: "", country: "", street: ""}];
        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.newPassenger = function () {
            $scope.passengers.push({firstName: "", lastName: "", city: "", country: "", street: ""});
        };

        $scope.removePassenger = function (passenger) {
            var index = $scope.passengers.indexOf(passenger);
            if (index > -1) {
                $scope.passengers.splice(index, 1);
            }
        };

        $scope.ok = function () {

            var passengersJson = {"Passengers": $scope.passengers};
            var url = 'userApi/reservation/' + items.airline + '/' + items.flightId + '/' + UserFactory.getUser()._id;
            $http.post(url, passengersJson).
                success(function (data, status, headers, config) {
                    console.log(data);
                    $location.path('/reservations');
                    $modalInstance.dismiss('succes');
                }).
                error(function (data, status, headers, config) {
                    console.log("headers: " + headers);
                    console.log("Data: " + data);
                });


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }).

    // ---------------------- Accordion controller ----------------------

    controller('AccordionDemoCtrl', function ($scope, $http, UserFactory) {
        $scope.oneAtATime = true;

        var userId = UserFactory.getUser()._id;

        $http.get('userApi/reservation/' + userId).
            success(function (data) {
                $scope.reservations = data;
            }).
            error(function (error) {
                //should be in the scope.
                console.log('error', error);
            });

    });