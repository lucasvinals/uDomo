import { controller, inject } from 'ng-annotations';

let ZoneControllerInstance = null;

@controller('ControllerZone')
@inject('FactoryZone', 'FactoryCommon', '$scope')
export default class {
  constructor(Zone, Common, scope) {
    ZoneControllerInstance = this;
    this.Zone = Zone;
    this.Common = Common;
    this.scope = scope;
    this.GetZones();
    this.Zone.Subscribe(this.GetZones);
    this.scope.$on('$destroy', this.Zone.ClearListeners);
  }

  GetZones() {
    const { Zone, SetZones, Common } = ZoneControllerInstance;
    return Zone.GetZones()
      .then(SetZones)
      .catch(Common.ThrowError);
  }

  CreateZone(zone) {
    const { Zone } = ZoneControllerInstance;
    const newZone = Object.assign(zone, { _id: ZoneControllerInstance.Common.newID() });
    return Zone.CreateZone(newZone);
  }

  ModifyZone(zone) {
    const { Zone } = ZoneControllerInstance;
    return Zone.ModifyZone(zone);
  }

  RemoveZone(id) {
    const { Zone } = ZoneControllerInstance;
    return Zone.DeleteZone(id);
  }

  SetInfo(zone) {
    ZoneControllerInstance.zoneInformation = zone;
    return zone;
  }

  SetDelete(zone) {
    ZoneControllerInstance.deleteZone = zone;
    return zone;
  }

  SetZones(zones) {
    ZoneControllerInstance.zones = zones;
    return zones;
  }
}
