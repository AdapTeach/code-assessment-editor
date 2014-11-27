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
            templateUrl: 'assessment.tpl.html',
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
                    code: compilationUnitToSubmit.code
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



(function (angular) {

    angular.module('at.assessment', [
        'ngMaterial',
        'at.assessment.editor'
    ]);
})(angular);
angular.module("at.assessment").run(["$templateCache", function($templateCache) {$templateCache.put("assessment.tpl.html","<md-toolbar class=\"fixed-toolbar\">\n    <div class=\"md-toolbar-tools\">\n        {{ assessment.title }}\n        <span flex></span>\n        <md-button ng-if=\"false\">\n            Help\n        </md-button>\n        <md-button ng-click=\"reset()\">\n            Reset\n        </md-button>\n        <md-button class=\"md-button-colored\" ng-click=\"onSubmit(submission)\">\n            Submit code\n        </md-button>\n    </div>\n</md-toolbar>\n<md-content class=\"md-content-padding\" style=\"padding-top:80px;\">\n\n    {{ assessment.instructions }}\n\n    <section ng-repeat=\"compilationUnit in assessment.providedCompilationUnits\" style=\"padding-top:10px;\">\n        <h3>{{ compilationUnit.name }}.java (read only)</h3>\n        <section\n                ng-model=\"compilationUnit.code\"\n                ui-ace=\"AceConfig.config\"\n                readonly=\"true\"></section>\n    </section>\n\n    <section ng-repeat=\"compilationUnit in submission.compilationUnits\" style=\"padding-top:10px;\">\n        <h3>{{ compilationUnit.name }}.java</h3>\n        <section\n                ng-model=\"compilationUnit.code\"\n                ui-ace=\"AceConfig.config\"></section>\n    </section>\n\n    </section>\n\n</md-content>");}]);