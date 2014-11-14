(function (angular) {
    'use strict';

    function atAssessmentEditor() {
        return {
            restrict: 'E',
            scope: {
                assessment: '=',
                onSubmit: '=',
                onReset: '='
            },
            templateUrl: 'app/assessment.tpl.html',
            controller: 'AssessmentController'
        };
    }

    function atAssessmentCtrl($scope, AceConfig) {
        $scope.AceConfig = AceConfig;

        $scope.$watch('assessment', function () {
            $scope.reset();
        });

        $scope.reset = function () {
            AceConfig.setLanguage($scope.assessment.language);
            $scope.submission = {
                assessment: $scope.assessment,
                compilationUnits: []
            };
            angular.forEach($scope.assessment.compilationUnitsToSubmit, function (compilationUnitToSubmit) {
                var compilationUnit = {
                    name: compilationUnitToSubmit.name,
                    code: compilationUnitToSubmit.startCode
                };
                $scope.submission.compilationUnits.push(compilationUnit);
            });
            if (angular.isFunction($scope.onReset))
                $scope.onReset();
        };
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
        'ui.ace'
    ])
        .factory('AceConfig', AceConfig)
        .directive('atAssessmentEditor', atAssessmentEditor)
        .controller('AssessmentController', atAssessmentCtrl);
})(angular);


