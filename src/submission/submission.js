(function (angular) {
  function SubmissionProvider() {

    var options = {
      baseUrl: 'localhost/'
    };
    this.config = function (param) {
      angular.extend(options, param)
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
          templateUrl: 'submission/submissionProgressDialog.tpl.html',
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