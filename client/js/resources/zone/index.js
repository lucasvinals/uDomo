import { service, inject } from 'ng-annotations';

@service('ResourceZone')
@inject('Resource')
export default class {
  constructor(Resource) {
    this.Resource = Resource;
  }
  GetAll() {
    return this.Resource.Zone().GetAll();
  }

  GetOne(id) {
    return this.Resource.Zone().GetOne(id);
  }

  Create(device) {
    return this.Resource.Zone().Create(device);
  }

  Modify(device) {
    return this.Resource.Zone().Modify(device);
  }

  Delete(id) {
    return this.Resource.Zone().Delete(id);
  }
}
