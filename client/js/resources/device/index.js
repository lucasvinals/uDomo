import { service, inject } from 'ng-annotations';

@service()
@inject('Resource')
export default class ResourceDevice {
  constructor(Resource) {
    this.Resource = Resource;
  }
  GetAll() {
    return this.Resource.Device().GetAll();
  }

  GetOne(id) {
    return this.Resource.Device().GetOne(id);
  }

  Create(device) {
    return this.Resource.Device().Create(device);
  }

  Modify(device) {
    return this.Resource.Device().Modify(device);
  }

  Delete(id) {
    return this.Resource.Device().Delete(id);
  }
}
