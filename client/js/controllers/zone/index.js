import Zone from '../../services/zone';
import Common from '../../services/common';

function ZoneController($scope) {
  function getZones() {
    return Zone.GetZones()
      .then((zones) => {
        $scope.zones = zones;
      })
      .catch((zoneError) => {
        throw new Error('ZoneError', zoneError);
      });
  }

  // let getZones = (function iifeGetZones(){
  //     Zone.GetZones((error, zones) => {
  //         error? log.error('Error obteniendo áreas ->' + error) : $scope.zones = zones;
  //     });
  //     return iifeGetZones;
  // })();
  /***********************************************************************************************/

  /**
   * With the Observer Pattern,
   * register the function to trigger whenever Zones changes
   */
  Zone.Subscribe(getZones);

  $scope.createZone = (zone) => {
    _.set(zone, 'id', Common.newID());
    Zone.CreateZone(zone);
  };

  $scope.removeZone = (index) => {
    Zone.DeleteZone(_.get($scope.zones[index], '_id'));
  };

  /**
   * Clean exit
   */
  $scope.$on('$destroy', Zone.clearListeners);
}

module.exports = angular
  .module('Zone')
  .controller('ZoneController', [ '$scope', ZoneController ]
);
