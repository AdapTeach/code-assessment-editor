/**
 * code-assessment-editor - 
 * @version v 0.0.1
 * @link 
 * @license MIT
 */
(function(angular,document) {'use strict';
function atAssessmentEditor(){return{restrict:"E",scope:{assessment:"=",onSubmit:"=",onReset:"="},templateUrl:"assessment.tpl.html",controller:"AssessmentController"}}function atAssessmentCtrl(s,e,t){s.instructions=t.trustAsHtml(s.assessment.instructions),s.AceConfig=e,s.$watch("assessment",function(){s.reset()}),s.reset=function(){e.setLanguage(s.assessment.language),s.submission={assessment:s.assessment,submittedCompilationUnits:[]},angular.forEach(s.assessment.compilationUnitsToSubmit,function(e){var t={name:e.name,code:e.code};s.submission.submittedCompilationUnits.push(t)}),angular.isFunction(s.onReset)&&s.onReset()}}function AceConfig(){var s={config:{}},e={java:{mode:"java",theme:"eclipse",require:["ace/ext/language_tools"],advanced:{enableSnippets:!0,enableBasicAutocompletion:!0,enableLiveAutocompletion:!0}}};return s.setLanguage=function(t){s.config=e[t]},s}atAssessmentCtrl.$inject=["$scope","AceConfig","$sce"],angular.module("at.assessment.editor",["ui.ace"]).factory("AceConfig",AceConfig).directive("atAssessmentEditor",atAssessmentEditor).controller("AssessmentController",atAssessmentCtrl);

angular.module("at.assessment",["ngMaterial","at.assessment.editor"]);

angular.module("at.assessment").run(["$templateCache",function(n){n.put("assessment.tpl.html",'<md-toolbar class="fixed-toolbar">\n    <div class="md-toolbar-tools">\n        {{ assessment.title }}\n        <span flex></span>\n        <md-button ng-if="false">\n            Help\n        </md-button>\n        <md-button ng-click="reset()">\n            Reset\n        </md-button>\n        <md-button class="md-button-colored" ng-click="onSubmit(submission)">\n            Submit code\n        </md-button>\n    </div>\n</md-toolbar>\n<md-content class="md-content-padding" style="padding-top:80px;">\n    <p ng-bind-html="instructions">\n    </p>\n    <section ng-repeat="compilationUnit in assessment.providedCompilationUnits" style="padding-top:10px;">\n        <h3>{{ compilationUnit.name }}.java (read only)</h3>\n        <section\n                ng-model="compilationUnit.code"\n                ui-ace="AceConfig.config"\n                readonly="true"></section>\n    </section>\n\n    <section ng-repeat="compilationUnit in submission.submittedCompilationUnits" style="padding-top:10px;">\n        <h3>{{ compilationUnit.name }}.java</h3>\n        <section\n                ng-model="compilationUnit.code"\n                ui-ace="AceConfig.config"></section>\n    </section>\n\n    </section>\n\n</md-content>')}]);

})(angular, document);
