(function (angular) {
    'use strict';

    function atAssessmentCtrl($scope, atAssessment, atSubmission, $mdToast) {
        atAssessment.load($scope.assessmentId).success(function () {
            $scope.assessment = atAssessment.current;
            atSubmission.resetCurrent();
            $scope.Submissions = atSubmission;
        }).error(function () {
            $mdToast.show({
                template: '<md-toast>Error !</md-toast>'
            });
        });
        $scope.reset = atSubmission.resetCurrent;
        $scope.submit = atSubmission.submitCurrent;
    }

    function atAssessmentEditor() {
        return {
            restrict: 'EA',
            scope: {
                assessmentId: '@',
                aceConfig: '='
            },
            templateUrl: 'app/assessment/assessment.tpl.html',
            controller: 'AssessmentController',
            transclude: true
        };
    }

    function atAssessmentProvider() {

        var options = {
            baseUrl: 'localhost/'
        };

        this.config = function (param) {
            angular.extend(options, param);
        };

        function Assessment($http) {
            var assessment = {};

            assessment.current = {};

            assessment.load = function (assessmentId) {
                return $http.get(options.baseUrl + assessmentId).success(function (data) {
                    assessment.current = data;
                });
            };

            return assessment;
        }

        this.$get = Assessment;
    }


    angular.module('at.assessment.editor', [
        'ui.ace',
        'at.assessment.submission'
    ]).directive('atAssessmentEditor', atAssessmentEditor)
        .controller('AssessmentController', atAssessmentCtrl)
        .provider('atAssessment', atAssessmentProvider);
})(angular);


