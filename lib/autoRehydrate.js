'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = autoRehydrate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _constants = require('./constants');

var _utilsIsStatePlainEnough = require('./utils/isStatePlainEnough');

var _utilsIsStatePlainEnough2 = _interopRequireDefault(_utilsIsStatePlainEnough);

function autoRehydrate() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return function (next) {
    return function (reducer, initialState, enhancer) {
      return next(createRehydrationReducer(reducer), initialState, enhancer);
    };
  };

  function createRehydrationReducer(reducer) {
    var rehydrated = false;
    var preRehydrateActions = [];
    return function (state, action) {
      if (action.type !== _constants.REHYDRATE) {
        if (config.log && !rehydrated) preRehydrateActions.push(action); // store pre-rehydrate actions for debugging
        return reducer(state, action);
      } else {
        var _ret = (function () {
          if (config.log && !rehydrated) logPreRehydrate(preRehydrateActions);
          rehydrated = true;

          var inboundState = action.payload;
          var reducedState = reducer(state, action);
          var newState = _extends({}, reducedState);

          Object.keys(inboundState).forEach(function (key) {
            // if initialState does not have key, skip auto rehydration
            if (!state.hasOwnProperty(key)) return;

            // if reducer modifies substate, skip auto rehydration
            if (state[key] !== reducedState[key]) {
              if (config.log) console.log('redux-persist/autoRehydrate: sub state for key `%s` modified, skipping autoRehydrate.', key);
              newState[key] = reducedState[key];
              return;
            }

            // otherwise take the inboundState
            if ((0, _utilsIsStatePlainEnough2['default'])(inboundState[key]) && (0, _utilsIsStatePlainEnough2['default'])(state[key])) newState[key] = _extends({}, state[key], inboundState[key]); // shallow merge
            else newState[key] = inboundState[key]; // hard set

            if (config.log) console.log('redux-persist/autoRehydrate: key `%s`, rehydrated to ', key, newState[key]);
          });
          return {
            v: newState
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
    };
  }
}

function logPreRehydrate(preRehydrateActions) {
  if (preRehydrateActions.length > 0) {
    console.log('\n      redux-persist/autoRehydrate: %d actions were fired before rehydration completed. This can be a symptom of a race\n      condition where the rehydrate action may overwrite the previously affected state. Consider running these actions\n      after rehydration:\n    ', preRehydrateActions.length);
  }
}
module.exports = exports['default'];