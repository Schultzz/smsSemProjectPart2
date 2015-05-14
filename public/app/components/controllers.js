angular.module('myAppRename.controllers', []).
    controller('AppCtrl', function ($scope, $http, $window, $location) {

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

    .controller('MyCtrl2', function ($scope) {
        // write MyCtrl2 here
    })
    .controller('CreateUserCtrl', function ($scope, $http, $timeout) {
        $scope.test = "WORKS!";

        $scope.showError = false;
        $scope.doFade = false;


        // {"userName": a , "email": a, "pw eller password"}
        $scope.makeUser = function () {

            $scope.showError = false;
            $scope.doFade = false;

            $scope.showError = true;

            var url = "/publicApi";
            console.log("userName: " + $scope.userNameForm);
            console.log("email: " + $scope.emailForm);
            console.log("password: " + $scope.passwordForm);

            var payLoad = {
                "userName": $scope.userNameForm,
                "email": $scope.emailForm,
                "password": $scope.passwordForm,
                "role": "user"
            };
            $http.post(url, payLoad)
                .success(function (data, status, headers, config) {
                    //what the f? why doesnt it return a success or error?
                    console.log(data);
                    console.log("sucsd")
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
    });