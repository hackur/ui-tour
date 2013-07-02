/*global angular */
/**
 * uiTour directive
 *
 * @example:
 *   <ul ui-tour="currentStep">
 *     <li target="#someId">
 *       First Tooltip
 *       <a ng-click="currentStep=currentStep+1">Next</a>
 *     </li>
 *     <li target=".items:eq(2)" key="two">
 *       Second Tooltip
 *       <a ng-click="currentStep=currentStep-1">Prev</a>
 *     </li>
 *     <li target=".items:eq(2)">
 *       Third Tooltip
 *       <a ng-click="currentStep='two'">Go directly to 'two'</a>
 *       <a ng-click="currentStep=0">Done</a>
 *     </li>
 *   </ul>
 */
angular.module('ui.tour', [])

.directive('uiTour', ['$timeout', '$parse', function($timeout, $parse){
  return {
    link: function($scope, $element, $attributes) {
      var model = $parse($attributes.uiTour);

      // Watch model and change steps
      $scope.$watch($attributes.uiTour, function(newVal, oldVal){
        if (angular.isNumber(newVal)) {
          showStep(newVal)
        } else {
          if (angular.isString(newVal)) {
            var stepNumber = 0,
              children = $element.children()
            angular.forEach(children, function(step, index) {
              if (angular.element(step).attr('key') === newVal)
                stepNumber = index+1;
            });
            model.assign($scope, stepNumber);
          } else {
            model.assign($scope, newVal && 1 || 0);
          }
        }
      });

      // Show step
      function showStep(stepNumber) {
        var elm, at, children = $element.children().removeClass('active');
        elm = children.eq(stepNumber - 1)
        if (stepNumber && elm.length) {
          at = elm.attr('at');
          $timeout(function(){
            var target = angular.element(elm.attr('target'))[0];
            offset = {};
            
            offset.top = target.offsetTop;
            offset.left = target.offsetLeft;
              
            if (at.indexOf('bottom') > -1)
                offset.top += target.offsetHeight;
            if (at.indexOf('right') > -1)
                offset.left += target.offsetWidth;
            
            elm.css(offset).addClass('active');
          });
        }
      }
    }
  };
}]);