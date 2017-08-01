import { controller, inject } from 'ng-annotations';

@controller('ControllerZone')
@inject('FactoryZone', 'FactoryCommon', '$scope')
export default class {
  constructor(Zone, Common, scope) {
    this.Zone = Zone;
    this.Common = Common;
    this.scope = scope;
    this.GetZones();
    this.Zone.Subscribe(this.GetZones);
    this.scope.$on('$destroy', this.Zone.ClearListeners);
  }

  GetZones() {
    return this.Zone.GetZones()
      .then((zones) => {
        this.zones = zones;
      })
      .catch((zoneError) => {
        throw new Error('ZoneError', zoneError);
      });
  }

  CreateZone(zone) {
    zone._id = this.Common.newID();
    this.Zone.CreateZone(zone);
  }

  ModifyZone(zone) {
    this.Zone.ModifyZone(zone);
  }

  RemoveZone(index) {
    this.Zone.DeleteZone(this.zones[index]._id);
  }
}
