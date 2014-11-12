angular.module("at.assessment").run(["$templateCache", function($templateCache) {$templateCache.put("assessment/assessment.tpl.html","<md-toolbar class=\"fixed-toolbar\">\n    <div class=\"md-toolbar-tools\">\n        {{ assessment.title }}\n        <span flex></span>\n        <md-button ng-if=\"false\">\n            Help\n        </md-button>\n        <md-button ng-click=\"editor.reset()\">\n            Reset\n        </md-button>\n        <md-button class=\"md-button-colored\" ng-click=\"assessment.submit()\">\n            Submit code\n        </md-button>\n    </div>\n</md-toolbar>\n<md-content class=\"md-content-padding\" style=\"padding-top:66px;\">\n\n    <p>\n        {{ assessment.instructions }}\n    </p>\n\n    <section ui-ace=\"AceConfig.java\" ng-model=\"Submissions.current.code\"></section>\n\n    <section class=\"result\" ng-transclude>\n\n    </section>\n    <!--<submission-result></submission-result>-->\n\n</md-content>");
$templateCache.put("submission/submissionProgress.tpl.html","<md-dialog class=\"dialog-result\">\n    <md-toolbar class=\"md-theme-light\">\n        <div class=\"md-toolbar-tools\" layout=\"horizontal\" layout-align=\"center\">\n            <h3>\n                Work in progress....\n            </h3>\n        </div>\n    </md-toolbar>\n    <div class=\"dialog-content\">\n        <md-progress-linear mode=\"indeterminate\"></md-progress-linear>\n    </div>\n</md-dialog>");}]);