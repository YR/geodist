'use strict';

/**
 * Simple geographic distance calculator
 * https://github.com/yr/geodist
 * @copyright Yr
 * @license MIT
 */

var numberUtils = require('@yr/number-utils');

var RADIUS_UNITS = {
  feet: 20908800,
  yards: 6969600,
  miles: 3960,
  mi: 3960,
  kilometers: 6371,
  km: 6371,
  meters: 6371000,
  m: 6371000
};
var DEFAULT_UNIT = 'meters';

/**
 * Retrieve geographic distance between 'start' and 'end' lat/lon points
 * Options:
 *  - {Boolean} exact: return floating point value (default false)
 *  - {Boolean} format: return value + unit as string (default false)
 *  - {Number} limit: return boolean value if calculated distance is greater
 *  - {String} unit: return value in specified unit (default meters)
 *
 * @param {Object} start
 * @param {Object) end
 * @param {Object) options
 * @returns {Number}
 */
module.exports = function getDistance(start, end, options) {
  options = options || {};

  var earthRadius = getEarthRadius(options.unit);
  var latDelta = numberUtils.degreesToRadians(end.lat - start.lat);
  var latDeltaSin = Math.sin(latDelta * 0.5);
  var lonDelta = numberUtils.degreesToRadians(end.lon - start.lon);
  var lonDeltaSin = Math.sin(lonDelta * 0.5);
  var startLatRad = numberUtils.degreesToRadians(start.lat);
  var endLatRad = numberUtils.degreesToRadians(end.lat);
  var a = latDeltaSin * latDeltaSin + lonDeltaSin * lonDeltaSin * Math.cos(startLatRad) * Math.cos(endLatRad);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var dist = earthRadius * c;

  if (!options.exact) dist = Math.floor(dist);
  if (options.limit) return options.limit > dist ? true : false;
  if (options.format) dist = dist + ' ' + (options.unit || DEFAULT_UNIT);

  return dist;
};

/**
 * Retrieve radius of earth in specified 'unit'
 * @param {String} unit
 * @returns {Number}
 */
function getEarthRadius(unit) {
  unit = unit || DEFAULT_UNIT;
  unit = unit.toLowerCase();
  if (!RADIUS_UNITS[unit]) unit = DEFAULT_UNIT;

  return RADIUS_UNITS[unit];
}