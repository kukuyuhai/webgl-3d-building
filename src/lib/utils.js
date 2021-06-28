/**
 * wgs84(EPSG:4236)转EPSG:3857
 * @param {*} lonlat
 * @returns
 */
function lonLat2Mercator(lonlat) {
  const center = { x: 13520004.551524552, y: 3665513.498793947 };
  var mercator = {
    x: 0,
    y: 0,
  };
  var earthRad = 6378137.0;
  mercator.x = ((lonlat.lng * Math.PI) / 180) * earthRad - center.x;
  var a = (lonlat.lat * Math.PI) / 180;
  mercator.y = (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a))) - center.y;
  return mercator;
}

/**
 * EPSG:3857转wgs84(EPSG:4236)
 * @param {*} mercator
 * @returns
 */
function mercatorTolonlat(mercator) {
  var lonlat = {
    x: 0,
    y: 0,
  };
  var x = (mercator.x / 20037508.34) * 180;
  var y = (mercator.y / 20037508.34) * 180;
  y = (180 / Math.PI) * (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2);
  lonlat.x = x;
  lonlat.y = y;
  return lonlat;
}

/**
 * wgs84(EPSG:4236)转EPSG:3857
 * @param {*} lonlat
 * @returns
 */
function lonLat2Mercators(lonlat) {
  var mercator = {
    x: 0,
    y: 0,
  };
  var earthRad = 6378137.0;
  mercator.x = ((lonlat.lng * Math.PI) / 180) * earthRad;
  var a = (lonlat.lat * Math.PI) / 180;
  mercator.y = (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
  return mercator;
}

export default { lonLat2Mercator, mercatorTolonlat, lonLat2Mercators };
