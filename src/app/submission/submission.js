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
                        compilationUnits: [],
                        finished: false,
                        result: {}
                    }
                },
                submission = {};
            angular.extend(submission, base);

            submission.resetCurrent = function () {
                submission.current.assessment = atAssessment.current;
                angular.forEach(atAssessment.current.compilationUnitsToSubmit, function (compilationUnitToSubmit) {
                    var compilationUnit = {
                        name: compilationUnitToSubmit.name,
                        code: compilationUnitToSubmit.startCode
                    };
                    submission.current.compilationUnits.push(compilationUnit);
                });
            };

            submission.submitCurrent = function () {
                return submission.submit(atAssessment.current, submission.current.compilationUnits);
            };

            submission.submit = function (assessment, compilationUnits) {
                $mdDialog.hide();
                $mdDialog.show({
                    templateUrl: 'app/submission/submissionProgressDialog.tpl.html',
                    clickOutsideToClose: false,
                    escapeToClose: false
                });
                submission.current = {
                    assessment: assessment,
                    compilationUnits: compilationUnits,
                    finished: false,
                    result: {}
                };
                var body = {
                    compilationUnits: compilationUnits
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