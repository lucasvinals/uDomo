import { inject, controller } from 'ng-annotations';

@controller('ControllerNotFound')
@inject('$rootScope', '$scope')
export default class {
  constructor(rootScope, scope) {
    this.rootScope = rootScope;
    this.scope = scope;
    this.SetNotFoundBackground();
    this.CleanExit();
  }
  /**
   * If we are here, a 404 page, set a cool background
   */
  SetNotFoundBackground() {
    this.rootScope.ChangeImage = { background: 'url(img/notFound.jpg)', 'background-size': 'cover' };
  }
  /**
   * Reset background when leaves the controller
   */
  CleanExit() {
    this.scope.$on('$destroy', () => (this.rootScope.ChangeImage = null));
  }
}
