"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormErrors = exports.clearFormState = exports.prepareFormInitialState = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _utils = require("./lib/utils");

var _types = require("./types");

var prepareFormInitialState = function prepareFormInitialState(formConfig) {
  var preparedPairs = _utils.R.toPairs(formConfig).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        fieldName = _ref2[0],
        config = _ref2[1];

    if (config.fieldType === _types.FormField.Input) {
      var inputConfig = config;

      var isValidInputValue = _utils.R.is(String, inputConfig.value) || _utils.R.is(Number, inputConfig.value);

      return [fieldName, {
        isValid: Boolean(inputConfig.value),
        isRequired: config.isRequired,
        value: isValidInputValue ? inputConfig.value : '',
        fieldType: config.fieldType,
        isPristine: true
      }];
    }

    if (config.fieldType === _types.FormField.Checkbox) {
      var checkboxConfig = config;
      return [fieldName, {
        isRequired: config.isRequired,
        value: checkboxConfig.value,
        fieldType: checkboxConfig.fieldType,
        isPristine: true
      }];
    }

    if (config.fieldType === _types.FormField.CustomField) {
      var customFieldConfig = config;

      var _isValidInputValue = _utils.R.is(String, customFieldConfig.value) || _utils.R.is(Number, customFieldConfig.value);

      return [fieldName, {
        isValid: Boolean(customFieldConfig.value),
        isRequired: config.isRequired,
        value: _isValidInputValue ? customFieldConfig.value : '',
        fieldType: customFieldConfig.fieldType,
        isPristine: true
      }];
    } // CustomPicker


    var customPickerConfig = config;
    return [fieldName, {
      fieldType: customPickerConfig.fieldType,
      isRequired: customPickerConfig.isRequired,
      options: customPickerConfig.options,
      isPristine: true
    }];
  });

  return _utils.R.fromPairs(preparedPairs);
};

exports.prepareFormInitialState = prepareFormInitialState;

var clearFormState = function clearFormState(formConfig) {
  var preparedPairs = _utils.R.toPairs(formConfig).map(function (_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
        fieldName = _ref4[0],
        config = _ref4[1];

    if (config.fieldType === _types.FormField.Input) {
      var inputConfig = config;

      var isValidInputValue = _utils.R.is(String, inputConfig.value) || _utils.R.is(Number, inputConfig.value);

      return [fieldName, {
        isValid: Boolean(inputConfig.value),
        isRequired: config.isRequired,
        value: '',
        fieldType: config.fieldType,
        isPristine: true
      }];
    }

    if (config.fieldType === _types.FormField.Checkbox) {
      var checkboxConfig = config;
      return [fieldName, {
        isRequired: config.isRequired,
        value: false,
        fieldType: checkboxConfig.fieldType,
        isPristine: true
      }];
    }

    if (config.fieldType === _types.FormField.CustomField) {
      var customFieldConfig = config;

      var _isValidInputValue2 = _utils.R.is(String, customFieldConfig.value) || _utils.R.is(Number, customFieldConfig.value);

      return [fieldName, {
        isValid: Boolean(customFieldConfig.value),
        isRequired: config.isRequired,
        value: '',
        fieldType: customFieldConfig.fieldType,
        isPristine: true
      }];
    } // CustomPicker


    var customPickerConfig = config;
    return [fieldName, {
      fieldType: customPickerConfig.fieldType,
      isRequired: customPickerConfig.isRequired,
      options: customPickerConfig.options,
      isPristine: true,
      value: ''
    }];
  });

  return _utils.R.fromPairs(preparedPairs);
};

exports.clearFormState = clearFormState;

var getFormErrors = function getFormErrors(formState) {
  return _utils.R.toPairs(formState).filter(function (_ref5) {
    var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
        fieldState = _ref6[1];

    return Boolean(fieldState.hasError);
  }).reduce(function (acc, _ref7) {
    var _ref8 = (0, _slicedToArray2.default)(_ref7, 2),
        fieldName = _ref8[0],
        fieldState = _ref8[1];

    return (0, _objectSpread3.default)({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldState.hasError));
  }, {});
};

exports.getFormErrors = getFormErrors;