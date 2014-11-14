(function (angular) {

    angular.module('at.assessment', [
        'ngMaterial',
        'at.assessment.editor',
        'at.assessment.submission'
    ]);
})(angular);
(function (angular) {
    'use strict';

    function atAssessmentCtrl($scope, atAssessment, atSubmission, $mdToast) {
        atAssessment.load($scope.assessmentId).success(function () {
            $scope.assessment = atAssessment.current;
            atSubmission.current.code = angular.copy(atAssessment.current.startCode);
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



(function (angular) {
    function SubmissionProvider() {

        var options = {
            baseUrl: 'localhost/'
        };
        this.config = function (param) {
            angular.extend(options, param);
        };

        function Submission(atAssessment, $http, $mdDialog) {
            var base = {
                    current: {
                        assessment: {},
                        code: '',
                        finished: false,
                        result: {}
                    }
                },
                submission = {};
            angular.extend(submission, base);

            submission.resetCurrent = function () {
                submission.current = base;
                submission.current.code = atAssessment.current.startCode;
            };

            submission.submitCurrent = function () {
                return submission.submit(atAssessment.current, submission.current.code);
            };

            submission.submit = function (assessment, submittedCode) {
                $mdDialog.hide();
                $mdDialog.show({
                    templateUrl: 'app/submission/submissionProgressDialog.tpl.html',
                    clickOutsideToClose: false,
                    escapeToClose: false
                });
                submission.current = {
                    assessment: assessment,
                    code: submittedCode,
                    finished: false,
                    result: {}
                };
                var body = {
                    code: submittedCode
                };
                return $http.post(options.baseUrl + assessment.id, body)
                    .success(function (data) {
                        submission.current.result = data;
                    })
                    .error(function (error) {
                        console.log(error);
                    })
                    .finally(function () {
                        $mdDialog.hide();
                        submission.current.finished = true;
                    });
            };

            submission.hasResult = function () {
                return submission.current.assessment === atAssessment.current &&
                    submission.current.finished &&
                    submission.current.result !== undefined &&
                    submission.current.result.pass !== undefined;
            };

            return submission;
        }

        this.$get = Submission;
    }

    angular.module('at.assessment.submission', [])
        .provider('atSubmission', SubmissionProvider);
})(angular);
angular.module("at.assessment").run(["$templateCache", function($templateCache) {$templateCache.put("app/assessment/assessment.tpl.html","<md-toolbar class=\"fixed-toolbar\">\n    <div class=\"md-toolbar-tools\">\n        {{ assessment.title }}\n        <span flex></span>\n        <md-button ng-if=\"false\">\n            Help\n        </md-button>\n        <md-button ng-click=\"reset()\">\n            Reset\n        </md-button>\n        <md-button class=\"md-button-colored\" ng-click=\"submit()\">\n            Submit code\n        </md-button>\n    </div>\n</md-toolbar>\n<md-content class=\"md-content-padding\" style=\"padding-top:66px;\">\n\n    <p>\n        {{ assessment.instructions }}\n    </p>\n\n    <section ui-ace=\"AceConfig\" ng-model=\"Submissions.current.code\" style=\"height:500px;width:100%;\"></section>\n\n    <section class=\"result\" ng-transclude ng-show=\"Submissions.current.result\">\n\n    </section>\n    <!--<submission-result></submission-result>-->\n\n</md-content>");
$templateCache.put("app/submission/submissionProgressDialog.tpl.html","<md-dialog class=\"dialog-result\">\n    <md-toolbar class=\"md-theme-light\">\n        <div class=\"md-toolbar-tools\" layout=\"horizontal\" layout-align=\"center\">\n            <h3>\n                Work in progress....\n            </h3>\n        </div>\n    </md-toolbar>\n    <div class=\"dialog-content\">\n        <md-progress-linear mode=\"indeterminate\"></md-progress-linear>\n    </div>\n</md-dialog>");}]);