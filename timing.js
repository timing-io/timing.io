//     timing.io 0.1
//     http://timing.io
//     (c) 2014 Max Diachenko
//     Timing.io may be freely distributed under the MIT license.

(function () {
  'use strict';

  //addLoadEvent for use multiple functions window.onLoad
  var addLoadEvent = function (func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      window.onload = function () {
        if (oldonload) {
          oldonload();
        }
        func();
      }
    }
  };

  //specific log function
  var log = function (message, type) {
    if ($timing.logging) {
      console[type || 'log'](message);
    }
  }

  //specific log function
  var getConsoleType = function (duration, linesOfCode) {
    return 'info';
  }

  var markId = (function () {
    var id = 1;
    return function () {
      return id++;
    };
  })();

  var measureId = (function () {
    var id = 1;
    return function () {
      return id++;
    };
  })();

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
    if (markerName) {
      $timing.lastMark = markerName;
      root.performance.mark(markerName);
    } else {
      var markerName = 'marker' + markId();
      $timing.lastMark = markerName;
      root.performance.mark(markerName);
    }
  };

  $timing.measure = function (resultName, markerFrom, markerTo) {
    if (resultName && markerFrom && markerTo) {
      root.performance.measure(resultName, markerFrom, markerTo);
      return $timing.measure(resultName);
    } else if (resultName && markerFrom) {
      var markerTo = 'marker' + markId();
      $timing.mark(markerTo);
      return $timing.measure(resultName, markerFrom, markerTo);
    } else if (resultName) {
      var output = root.performance.getEntriesByName(resultName);
      output = output[output.length - 1];
      log(output.name + ' = ' + output.duration, getConsoleType());
      return output;
    } else {
      var output = $timing.measure('measure' + measureId(), $timing.lastMark);
      delete $timing.lastMark;
      return output;
    }
  };

  $timing.versus = function () {
    console.group(arguments[0]);

    for (var i = 1; i < arguments.length; i++) {
      $timing.mark('f'+i);
      arguments[i]();
      $timing.mark('ff'+i);
      $timing.measure('Function #' + i, 'f'+i, 'ff'+i);
    }

    console.groupEnd();
  };

  $timing.resources = function () {
    addLoadEvent(function () {
      var output = root.performance.getEntriesByType('resource');
      output.forEach(function (entry) {
        log(entry.name + ' (' + entry.duration + ')');
      });
      return output;
    });
  };


  $timing.navigation = function () {
    addLoadEvent(function () {
      var output = root.performance.timing;
      log(output);
      return output;
    });
  };

  // amdefine
  if (typeof define === 'function' && define.amd) {
    define('$timing', [], function () {
      return $timing;
    });
  }
}).call(this);