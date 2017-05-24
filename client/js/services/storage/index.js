import { service } from 'ng-annotations';

@service('FactoryStorage')
export default class {
  constructor() {
    this.store = window.localStorage || window.sessionStorage;
  }
  /**
   * Set Token in browser storage.
   * @param {string} token
   */
  setToken(token) {
    return this.store.setItem('uDomoToken', token.toString());
  }
  /**
   * Get Token from browser storage.
   */
  getToken() {
    return this.store.getItem('uDomoToken');
  }
  /**
   * Delete Token from browser storage.
   */
  deleteToken() {
    return this.store.removeItem('uDomoToken');
  }
}
