"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "toPairs", {
  enumerable: true,
  get: function get() {
    return _ramda.toPairs;
  }
});
Object.defineProperty(exports, "cond", {
  enumerable: true,
  get: function get() {
    return _ramda.cond;
  }
});
Object.defineProperty(exports, "is", {
  enumerable: true,
  get: function get() {
    return _ramda.is;
  }
});
Object.defineProperty(exports, "fromPairs", {
  enumerable: true,
  get: function get() {
    return _ramda.fromPairs;
  }
});
Object.defineProperty(exports, "always", {
  enumerable: true,
  get: function get() {
    return _ramda.always;
  }
});
Object.defineProperty(exports, "T", {
  enumerable: true,
  get: function get() {
    return _ramda.T;
  }
});
Object.defineProperty(exports, "differenceWith", {
  enumerable: true,
  get: function get() {
    return _ramda.differenceWith;
  }
});
exports.hasElements = exports.all = exports.isDefined = exports.isEqual = void 0;

var _ramda = require("ramda");

/* tslint:disable no-any */
var isDefined = function isDefined(subject) {
  return typeof subject !== 'undefined' && subject !== null;
};

exports.isDefined = isDefined;

var isEqual = function isEqual(comparator, followingValue) {
  return function (value) {
    return (0, _ramda.is)(Function, comparator) ? comparator(value) === followingValue : value === comparator;
  };
};
/* tslint:enable no-any */


exports.isEqual = isEqual;

var hasElements = function hasElements(array) {
  return Array.isArray(array) && array.length > 0;
};

exports.hasElements = hasElements;

var all = function all() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (arg) {
    return !Boolean(arg);
  });
};

exports.all = all;