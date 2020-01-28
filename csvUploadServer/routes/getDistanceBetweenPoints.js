function getDistanceBetweenPoints($latitude1, $longitude1, $latitude2, $longitude2, $unit = 'Mi') {
  $theta = $longitude1 - $longitude2;
  $distance = Math.sin( deg2rad($latitude1)) * Math.sin( deg2rad($latitude2)) + Math.cos( deg2rad($latitude1)) * Math.cos( deg2rad($latitude2)) * Math.cos( deg2rad($theta));
  $distance =  Math.acos($distance);
  $distance =  Math.rad2deg($distance);
  $distance = $distance * 60 * 1.1515;
  switch ($unit) {
    case 'Mi': break;
    case 'Km': $distance = $distance * 1.609344;
  }
  return (round($distance, 2));
}


module.exports = getDistanceBetweenPoints

module.exports = function deg2rad (angle) {  
    return angle * 0.017453292519943295 // (angle / 180) * Math.PI;
  }