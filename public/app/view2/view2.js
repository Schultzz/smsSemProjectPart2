'use strict';

angular.module('myAppRename.view2', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'app/view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])
    .controller('View2Ctrl', ['$scope', '$modal', '$http', '$log', function ($scope, $modal, $http, $log) {

        $scope.searchForm = false;
        $scope.noFlightAlert;

        $http({
            method: 'GET',
            url: 'userApi/test'
        })
            .success(function (data, status, headers, config) {
                $scope.searchForm = true;
                $scope.info = data;
                $scope.error = null;
            }).
            error(function (data, status, headers, config) {
                if (status == 401) {
                    $scope.error = "You are not authenticated to request these data";
                    return;
                }
                $scope.error = data;
            });


        $http({
            method: 'GET',
            url: 'userApi/flights/CPH/1483574400000'
        })
            .success(function (data, status, headers, comfig) {
                $scope.testFlights = data;
                $scope.error = null;
            }).
            error(function (data, status, headers, config) {
                if (status == 401) {
                    $scope.error = "You are not authenticated to request these data";
                    return;
                }
                $scope.error = data;
            });


        $scope.test123 = function () {

            $scope.searchTable1 = false;
            $scope.loader = true;


            console.log($scope.dt, $scope.searchAirport);


            $scope.dt.setHours(0);
            $scope.dt.setMinutes(0);
            $scope.dt.setSeconds(0);

            console.log($scope.searchAirport, ($scope.dt).getTime());

            $http.get("http://localhost:3000/userApi/flights/" + $scope.searchAirport + "/" + new Date($scope.dt).getTime())
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

                        console.log(arrAirlines);

                        $scope.airlines = arrAirlines;




                })
                .error(function (err) {
                    console.log(3);
                    $scope.loader = false;
                    $scope.noFlightAlert = true;
                    console.log("error", err);
                });

        }


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


        //MODAL compenent


        $scope.animationsEnabled = true;

        $scope.openRes = function (airline) {

            console.log(airline)

            $scope.items = airline;
            var size;

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
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });