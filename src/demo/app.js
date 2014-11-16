angular.module('demo.app', [
    'at.assessment'
])

    .factory('Assessments', function ($http) {

        var Assessments = {};

        Assessments.current = {};

        Assessments.load = function (assessmentURL) {
            return $http.get(assessmentURL).success(function (data) {
                Assessments.current = data;
            });
        };

        Assessments.load('http://codeassesser-adapteach.rhcloud.com/assess/inheritance');

        return Assessments;
    })

    .controller('DemoAppController', function ($scope, Assessments) {
        $scope.Assessments = Assessments;
        $scope.submit = function (submission) {
            console.log(submission);
        };
        $scope.reset = function () {
            console.log('RESET');
        }
    });