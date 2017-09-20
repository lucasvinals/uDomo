import { service, inject } from 'ng-annotations';

@service()
@inject('ResourceZone', 'FactoryCommon')
export default class FactoryZone {
  constructor(ResourceZone, Common) {
    this.Zone = ResourceZone;
    this.ProcessResponse = Common.ProcessResponse;
    this.ThrowError = Common.ThrowError;
  }

  GetZones() {
    return this.Zone
      .GetAll()
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
  }

  CreateZone(zoneToCreate) {
    return this.Zone
      .Create(zoneToCreate)
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
  }

  ModifyZone(zone) {
    return this.Zone
      .Modify(zone)
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
  }

  DeleteZone(zoneId) {
    return this.Zone
      .Delete(zoneId)
      .then(this.ProcessResponse)
      .catch(this.ThrowError);
  }
}
