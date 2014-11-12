(function(angular){
  'use strict';

  function atAssessmentEditor(){
    return {
      restrict : 'EA',
      scope : {
        assessmentId : '@'
      },
      templateUrl :'assessment.tpl.html',
      controller : function(atAssessment,atSubmission,$mdToast){
        angular.extend(this,atAssessment.current);
        atAssessment.load(this.asssessmentId).success(function(assessment){
          this.assessment = atAssessment.current
        }).error(function(){
          $mdToast.show({
            template : '<md-toast>Error !</md-toast>'
          })
        });
        this.reset = atSubmission.resetCurrent;
        this.submit = atSubmission.submitCurrent;
      },
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

    function Assessment(){
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
    .provider('atAssessment',atAssessmentProvider);
})(angular);


