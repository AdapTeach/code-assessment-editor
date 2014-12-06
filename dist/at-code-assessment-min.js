/**
 * code-assessment-editor - 
 * @version v 0.0.1
 * @link 
 * @license MIT
 */
(function(angular,document) {'use strict';
function atAssessmentEditor(){return{restrict:"E",scope:{assessment:"=",onSubmit:"=",onReset:"="},templateUrl:"assessment.tpl.html",controller:"AssessmentController"}}function atAssessmentCtrl(e,s){e.AceConfig=s,e.$watch("assessment",function(){e.reset()}),e.reset=function(){s.setLanguage(e.assessment.language),e.submission={assessment:e.assessment,submittedCompilationUnits:[]},angular.forEach(e.assessment.compilationUnitsToSubmit,function(s){var t={name:s.name,code:s.code};e.submission.submittedCompilationUnits.push(t)}),angular.isFunction(e.onReset)&&e.onReset()}}function AceConfig(){var e={config:{}},s={java:{mode:"java",theme:"eclipse",require:["ace/ext/language_tools"],advanced:{enableSnippets:!0,enableBasicAutocompletion:!0,enableLiveAutocompletion:!0}}};return e.setLanguage=function(t){e.config=s[t]},e}atAssessmentCtrl.$inject=["$scope","AceConfig"],angular.module("at.assessment.editor",["ui.ace"]).factory("AceConfig",AceConfig).directive("atAssessmentEditor",atAssessmentEditor).controller("AssessmentController",atAssessmentCtrl);

angular.module("at.assessment",["ngMaterial","at.assessment.editor"]);

angular.module("at.assessment").run(["$templateCache",function(n){n.put("assessment.tpl.html",'<md-toolbar class="fixed-toolbar">\n    <div class="md-toolbar-tools">\n        {{ assessment.title }}\n        <span flex></span>\n        <md-button ng-if="false">\n            Help\n        </md-button>\n        <md-button ng-click="reset()">\n            Reset\n        </md-button>\n        <md-button class="md-button-colored" ng-click="onSubmit(submission)">\n            Submit code\n        </md-button>\n    </div>\n</md-toolbar>\n<md-content class="md-content-padding" style="padding-top:80px;">\n\n    {{ assessment.instructions }}\n\n    <section ng-repeat="compilationUnit in assessment.providedCompilationUnits" style="padding-top:10px;">\n        <h3>{{ compilationUnit.name }}.java (read only)</h3>\n        <section\n                ng-model="compilationUnit.code"\n                ui-ace="AceConfig.config"\n                readonly="true"></section>\n    </section>\n\n    <section ng-repeat="compilationUnit in submission.submittedCompilationUnits" style="padding-top:10px;">\n        <h3>{{ compilationUnit.name }}.java</h3>\n        <section\n                ng-model="compilationUnit.code"\n                ui-ace="AceConfig.config"></section>\n    </section>\n\n    </section>\n\n</md-content>')}]);

})(angular, document);
