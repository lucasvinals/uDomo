import { config, inject } from 'ng-annotations';

@config('uDomoConfig')
@inject('$httpProvider', '$compileProvider')
export default class {
  constructor(httpProvider, compileProvider) {
    this.httpProvider = httpProvider;
    this.compileProvider = compileProvider;
    if (PRODUCTION) {
      /**
       * Test these configurations!
       */
      this.compileProvider.debugInfoEnabled(false);
      this.compileProvider.commentDirectivesEnabled(false);
      this.compileProvider.cssClassDirectivesEnabled(false);
      this.httpProvider.useApplyAsync(true);
    }
  }
}
