(function(angular){
  'use strict';

  function atAssessmentCtrl($scope,atAssessment,atSubmission,$mdToast){
    console.log(this,$scope);
    atAssessment.load($scope.assessmentId).success(function(assessment){
      this.assessment = atAssessment.current
    }).error(function(){
      $mdToast.show({
        template : '<md-toast>Error !</md-toast>'
      })
    });
    this.reset = atSubmission.resetCurrent;
    this.submit = atSubmission.submitCurrent;
  }

  function atAssessmentEditor(){
    return {
      restrict : 'EA',
      scope : {
        assessmentId : '='
      },
      templateUrl :'assessment.tpl.html',
      controller : 'atAssessmentCtrl',
      controllerAs : 'editor',
      transclude : true
    }
  }

  function atAssessmentProvider(){

    var options = {
      baseUrl : 'localhost/'
    };

    this.config = function(param){
      angular.extend(options,param);
    };

    function Assessment($http){
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


  angular.module('at.assessment.editor',[
    'ui.ace',
    'at.assessment.submission'
  ]).directive('atAssessmentEditor',atAssessmentEditor)
    .controller('atAssessmentCtrl',atAssessmentCtrl)
    .provider('atAssessment',atAssessmentProvider);
})(angular);


