(function (angular) {
    'use strict';

    function atAssessmentCtrl($scope, atAssessment, atSubmission, $mdToast, AceConfig) {
        $scope.AceConfig = AceConfig;
        atAssessment.load($scope.assessmentId).success(function () {
            $scope.assessment = atAssessment.current;
            atSubmission.resetCurrent();
            $scope.Submissions = atSubmission;
            AceConfig.setLanguage(atAssessment.current.language);
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

    function AceConfig() {
        var service = {config: {}};

        var configsByLanguages = {
            'java': {
                mode: 'java',
                theme: 'eclipse',
                require: ['ace/ext/language_tools'],
                advanced: {
                    enableSnippets: true,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true
                }
            }
        };

        service.setLanguage = function (language) {
            service.config = configsByLanguages[language];
        };

        return service;
    }


    angular.module('at.assessment.editor', [
        'ui.ace',
        'at.assessment.submission'
    ])
        .factory('AceConfig', AceConfig)
        .directive('atAssessmentEditor', atAssessmentEditor)
        .controller('AssessmentController', atAssessmentCtrl)
        .provider('atAssessment', atAssessmentProvider);
})(angular);


