(function (angular) {
    'use strict';

    function atAssessmentEditor() {
        return {
            restrict: 'E',
            scope: {
                assessment: '=',
                submit: '='
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
angular.module("at.assessment").run(["$templateCache", function($templateCache) {$templateCache.put("app/assessment.tpl.html","<md-toolbar class=\"fixed-toolbar\">\n    <div class=\"md-toolbar-tools\">\n        {{ assessment.title }}\n        <span flex></span>\n        <md-button ng-if=\"false\">\n            Help\n        </md-button>\n        <md-button ng-click=\"reset()\">\n            Reset\n        </md-button>\n        <md-button class=\"md-button-colored\" ng-click=\"submit(submission)\">\n            Submit code\n        </md-button>\n    </div>\n</md-toolbar>\n<md-content class=\"md-content-padding\" style=\"padding-top:66px;\">\n\n    <p>\n        {{ assessment.instructions }}\n    </p>\n\n    <section ng-repeat=\"compilationUnit in submission.compilationUnits\">\n        <section\n                ng-model=\"compilationUnit.code\"\n                ui-ace=\"AceConfig.config\"\n                style=\"height:500px;width:100%;font-size: 16px\"></section>\n    </section>\n\n    </section>\n    <!--<submission-result></submission-result>-->\n\n</md-content>");}]);