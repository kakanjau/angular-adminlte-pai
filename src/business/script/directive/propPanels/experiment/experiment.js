import temp from './experiment.html';
import ctrl from './experimentCtrl';

export default app => {
  app.directive('snExperiment', [ () => {
    return {
      restrict: 'EA',
      template: temp,
      controller: ctrl,
      require: 'snPropPanel'
    }
  }]);
}