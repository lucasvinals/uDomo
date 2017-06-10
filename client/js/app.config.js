import { config, inject } from 'ng-annotations';

@config('uDomoConfig')
@inject('$httpProvider', '$compileProvider')
export default class {
  constructor(httpProvider, compileProvider) {
    this.httpProvider = httpProvider;
    this.compileProvider = compileProvider;
    if (!DEVELOPMENT) {
      this.compileProvider.debugInfoEnabled(false);
      this.httpProvider.useApplyAsync(true);
    }
  }
}
