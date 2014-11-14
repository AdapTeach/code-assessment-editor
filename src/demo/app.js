angular.module('demo.app', [
    'at.assessment'
])

    .constant('BACKEND', {ASSESSMENT: 'http://codeassesser-adapteach.rhcloud.com/assess/'})

    .config(function config(atAssessmentProvider, atSubmissionProvider, BACKEND) {
        atAssessmentProvider.config({
            baseUrl: BACKEND.ASSESSMENT
        });

        atSubmissionProvider.config({
            baseUrl: BACKEND.ASSESSMENT
        });
    });