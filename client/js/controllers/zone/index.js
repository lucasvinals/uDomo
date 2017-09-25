import { controller, inject } from 'ng-annotations';

@controller()
@inject('FactoryZone', 'FactoryCommon')
export default class ControllerZone {
  constructor(FactoryZone, FactoryCommon) {
    this.Zone = FactoryZone;
    this.Common = FactoryCommon;
    this.GetZones();
    // this.scope.$on('$destroy', this.Zone.ClearListeners);
  }

  GetZones() {
    return this.Zone
      .GetZones()
      .then((zones) => {
        this.zones = zones;
        return this.zones;
      })
      .catch(this.Common.ThrowError);
  }

  CreateZone(zone) {
    const newZone = Object.assign(zone, { _id: this.Common.newID() });
    return this.Zone.CreateZone(newZone);
  }

  ModifyZone(zone) {
    return this.Zone.ModifyZone(zone);
  }

  RemoveZone(id) {
    return this.Zone.DeleteZone(id);
  }

  SetInfo(zone) {
    this.zoneInformation = zone;
    return this.zoneInformation;
  }

  SetDelete(zone) {
    this.deleteZone = zone;
    return this.deleteZone;
  }
}
