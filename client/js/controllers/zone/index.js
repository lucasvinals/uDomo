import { controller, inject } from 'ng-annotations';
import { get, set } from 'lodash';

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
    set(zone, 'id', this.Common.newID());
    this.Zone.CreateZone(zone);
  }

  RemoveZone(index) {
    this.Zone.DeleteZone(get(this.zones[index], '_id'));
  }
}
