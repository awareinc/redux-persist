'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isStatePlainEnough;

var _lodash = require('lodash');

function isStatePlainEnough(a) {
  // isPlainObject + duck type not immutable
  if (!a) return false;
  if (typeof a !== 'object') return false;
  if (typeof a.mergeDeep === 'function') return false;
  if (!(0, _lodash.isPlainObject)(a)) return false;
  return true;
}

module.exports = exports['default'];