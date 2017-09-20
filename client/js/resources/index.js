import { service, inject } from 'ng-annotations';

@service()
@inject('$http')
export default class Resource {
  constructor($http) {
    this.http = $http;
  }

  /**
   * Entities
   */
  Device() {
    this.type = 'device';
    return this;
  }
  User() {
    this.type = 'user';
    return this;
  }
  Zone() {
    this.type = 'zone';
    return this;
  }

  /**
   * Common methods 
   */
  GetAll() {
    return this.http.get(`/api/${ this.type }`);
  }

  GetOne(id) {
    return this.http.get(`/api/${ this.type }/${ id }`);
  }

  Create(entity) {
    return this.http.post(`/api/${ this.type }`, entity);
  }

  Modify(entity) {
    return this.http.put(`/api/${ this.type }`, entity);
  }

  Delete(id) {
    return this.http.put(`/api/${ this.type }/${ id }`);
  }
}
