//     timing.io 0.1
//     http://timing.io
//     (c) 2014 Max Diachenko
//     Timing.io may be freely distributed under the MIT license.

(function () {
  'use strict';

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  var $timing = {};

  // Export the Timing object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `$timing` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = $timing;
    }
    exports.$timing = $timing;
  } else {
    root.$timing = $timing;
  }

  // Current version.
  $timing.VERSION = '0.1';

  $timing.mark = function (markerName) {
    window.performance.mark(markerName);
  };

  $timing.measure = function (resultName, markerFrom, markerTo) {
    window.performance.measure(resultName, markerFrom, markerTo);
  };

  $timing.result = function (name, log) {
    log = log || false;
    if (typeof name === 'string') {
      var result = window.performance.getEntriesByName(name);
      if (log) {
        console.log(result);
      }
      return result;
    } else if (Array.isArray(name)) {
      var result = [];
      name.forEach(function (measureName) {
        result.push($timing.result(measureName));
      });
      if (log) {
        console.log(result);
      }
      return result;
    } else {

    }

  };

  // amdefine
  if (typeof define === 'function' && define.amd) {
    define('$timing', [], function () {
      return $timing;
    });
  }
}).call(this);