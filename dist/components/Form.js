"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _objectSpread11 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("../lib/utils");

var _utils2 = require("../utils");

var _types = require("../types");

var _Input = require("./Input");

var _CustomPicker = require("./CustomPicker");

var _Checkbox = require("./Checkbox");

var Form =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Form, _React$Component);

  function Form(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Form);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Form).call(this, props));
    _this.state = {
      form: (0, _utils2.prepareFormInitialState)(_this.props.formConfig)
    };
    _this.submitForm = _this.submitForm.bind((0, _assertThisInitialized2.default)(_this));
    _this.renderChild = _this.renderChild.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleFormError = _this.handleFormError.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Form, [{
    key: "hasChanges",
    value: function hasChanges() {
      return _utils.R.toPairs(this.state.form).some(function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
            fieldObject = _ref2[1];

        return !fieldObject.isPristine;
      });
    }
  }, {
    key: "handleFormError",
    value: function handleFormError() {
      if (this.props.onFormError) {
        var errors = (0, _utils2.getFormErrors)(this.state.form);
        this.props.onFormError(errors);
      }
    }
  }, {
    key: "setCustomFieldError",
    value: function setCustomFieldError(fieldName, errorMessage) {
      this.setState({
        form: (0, _objectSpread11.default)({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, (0, _objectSpread11.default)({}, this.state.form[fieldName], {
          hasError: errorMessage,
          isValid: false
        })))
      });
    }
  }, {
    key: "showErrorsOnSubmit",
    value: function showErrorsOnSubmit() {
      var _this2 = this;

      var checkedFormFields = _utils.R.toPairs(this.state.form).filter(function (_ref3) {
        var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
            fieldName = _ref4[0],
            fieldObject = _ref4[1];

        return fieldObject.isRequired || fieldObject.fieldType === _types.FormField.Input && Boolean(fieldObject.value) && Boolean(_this2.props.formConfig[fieldName].validationRules);
      }).map(function (_ref5) {
        var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
            fieldName = _ref6[0],
            fieldObject = _ref6[1];

        if (fieldObject.fieldType === _types.FormField.Input) {
          var fieldProperties = fieldObject;

          var isValid = _this2.validateField(fieldName, fieldProperties.value);

          var _ref7 = _this2.props.formConfig[fieldName],
              compareWith = _ref7.compareWith;

          var hasError = _utils.R.cond([[function () {
            return !isValid;
          }, function () {
            return _this2.getFieldErrorMessage(fieldName, fieldProperties.value);
          }], [function () {
            return Boolean(compareWith);
          }, function () {
            return fieldProperties.value !== _this2.state.form[compareWith.fieldName].value ? compareWith.errorMessage : undefined;
          }], [_utils.R.T, _utils.R.always(undefined)]])();

          return [fieldName, (0, _objectSpread11.default)({}, fieldObject, {
            isValid: isValid,
            hasError: hasError
          })];
        }

        if (fieldObject.fieldType === _types.FormField.Checkbox) {
          return [fieldName, (0, _objectSpread11.default)({}, fieldObject, {
            hasError: _this2.getCheckboxErrorMessage(fieldName, fieldObject.value)
          })];
        } // CustomPicker


        return [fieldName, (0, _objectSpread11.default)({}, fieldObject, {
          hasError: _this2.getCustomPickerErrorMessage(fieldName)
        })];
      }).reduce(function (acc, _ref8) {
        var _ref9 = (0, _slicedToArray2.default)(_ref8, 2),
            fieldName = _ref9[0],
            fieldObject = _ref9[1];

        return (0, _objectSpread11.default)({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldObject));
      }, {});

      this.setState({
        form: (0, _objectSpread11.default)({}, this.state.form, checkedFormFields)
      }, this.handleFormError);
    }
  }, {
    key: "getCustomPickerErrorMessage",
    value: function getCustomPickerErrorMessage(fieldName) {
      var pickerConfig = this.props.formConfig[fieldName];

      if (!pickerConfig.validationRules) {
        return;
      }

      var pickerState = this.state.form[fieldName];
      var selectedOptions = pickerState.options.filter(function (option) {
        return option.isSelected;
      });

      var _pickerConfig$validat = pickerConfig.validationRules.map(function (_ref10) {
        var validationFunction = _ref10.validationFunction,
            errorMessage = _ref10.errorMessage;
        var isValid = validationFunction(selectedOptions);
        return !isValid ? errorMessage : undefined;
      }).filter(Boolean),
          _pickerConfig$validat2 = (0, _slicedToArray2.default)(_pickerConfig$validat, 1),
          errorMessage = _pickerConfig$validat2[0];

      return errorMessage;
    }
  }, {
    key: "getCheckboxErrorMessage",
    value: function getCheckboxErrorMessage(fieldName, value) {
      var checkboxConfig = this.props.formConfig[fieldName];

      if (!checkboxConfig.validationRule) {
        return undefined;
      }

      return !checkboxConfig.validationRule.validationFunction(value) ? checkboxConfig.validationRule.errorMessage : undefined;
    }
  }, {
    key: "validateCustomPicker",
    value: function validateCustomPicker(fieldName) {
      var pickerConfig = this.props.formConfig[fieldName];

      if (!pickerConfig.validationRules) {
        return true;
      }

      var pickerState = this.state.form[fieldName];
      var selectedOptions = pickerState.options.filter(function (option) {
        return option.isSelected;
      });
      return pickerConfig.validationRules.map(function (_ref11) {
        var validationFunction = _ref11.validationFunction;
        return validationFunction(selectedOptions);
      }).every(Boolean);
    }
  }, {
    key: "validateCheckbox",
    value: function validateCheckbox(fieldName) {
      var checkboxConfig = this.props.formConfig[fieldName];

      if (!checkboxConfig.validationRule) {
        return true;
      }

      var checkboxValue = this.state.form[fieldName].value;
      return checkboxConfig.validationRule.validationFunction(checkboxValue);
    }
  }, {
    key: "submitForm",
    value: function submitForm() {
      var _this3 = this;

      if (!this.isFormValid || !this.hasValidCompares) {
        return this.showErrorsOnSubmit();
      }

      var form = _utils.R.toPairs(this.state.form).reduce(function (acc, _ref12) {
        var _ref13 = (0, _slicedToArray2.default)(_ref12, 2),
            fieldName = _ref13[0],
            fieldObject = _ref13[1];

        if (fieldObject.fieldType === _types.FormField.Input) {
          var inputStateProperties = fieldObject;
          var submitParser = _this3.props.formConfig[fieldName].submitParser;
          return (0, _objectSpread11.default)({}, acc, (0, _defineProperty2.default)({}, fieldName, submitParser ? submitParser(fieldObject.value) : inputStateProperties.value));
        }

        if (fieldObject.fieldType === _types.FormField.Checkbox) {
          return (0, _objectSpread11.default)({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldObject.value));
        } // CustomPicker


        return (0, _objectSpread11.default)({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldObject.options.filter(function (option) {
          return option.isSelected;
        }).map(function (option) {
          return option.value;
        })));
      }, {});

      this.props.onFormSubmit(form);
    }
  }, {
    key: "validateField",
    value: function validateField(formFieldName, value) {
      var fieldConfig = this.props.formConfig[formFieldName];

      if (!fieldConfig.isRequired && !value) {
        return true;
      }

      if (fieldConfig.validationRules) {
        return fieldConfig.validationRules.map(function (_ref14) {
          var validationFunction = _ref14.validationFunction;
          return validationFunction(value);
        }).every(Boolean);
      }

      return true;
    }
  }, {
    key: "getFieldErrorMessage",
    value: function getFieldErrorMessage(formFieldName, value) {
      var fieldConfig = this.props.formConfig[formFieldName];

      if (!fieldConfig.isRequired && !value) {
        return;
      }

      if (fieldConfig.validationRules) {
        var _fieldConfig$validati = fieldConfig.validationRules.map(function (_ref15) {
          var validationFunction = _ref15.validationFunction,
              errorMessage = _ref15.errorMessage;
          var isValid = validationFunction(value);
          return !isValid ? errorMessage : undefined;
        }).filter(Boolean),
            _fieldConfig$validati2 = (0, _slicedToArray2.default)(_fieldConfig$validati, 1),
            errorMessage = _fieldConfig$validati2[0];

        return errorMessage;
      }

      return;
    }
  }, {
    key: "onTextChange",
    value: function onTextChange(value, formFieldName) {
      var formField = this.state.form[formFieldName];
      var shouldLiveCheck = Boolean(formField.hasError) || this.isFormValid;
      var valueParser = this.props.formConfig[formFieldName].liveParser;
      var newValue = valueParser ? valueParser(value) : value; // todo handle compare check to get rid of error that doesnt exist anymore

      var isValid = shouldLiveCheck ? this.validateField(formFieldName, newValue) : formField.isValid;
      var errorMessage = !isValid && shouldLiveCheck ? this.getFieldErrorMessage(formFieldName, newValue) : undefined;
      var isPristine = !(value !== this.props.formConfig[formFieldName].value);
      this.setState({
        form: (0, _objectSpread11.default)({}, this.state.form, (0, _defineProperty2.default)({}, formFieldName, (0, _objectSpread11.default)({}, this.state.form[formFieldName], {
          value: newValue,
          isValid: isValid,
          hasError: errorMessage,
          isPristine: isPristine
        })))
      });
    }
  }, {
    key: "onInputBlur",
    value: function onInputBlur(fieldName) {
      var currentValue = this.state.form[fieldName].value.trim();
      var isValid = this.validateField(fieldName, currentValue);
      var errorMessage = !isValid ? this.getFieldErrorMessage(fieldName, currentValue) : undefined;
      var isPristine = !(currentValue !== this.props.formConfig[fieldName].value);
      this.setState({
        form: (0, _objectSpread11.default)({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, (0, _objectSpread11.default)({}, this.state.form[fieldName], {
          isValid: isValid,
          hasError: errorMessage,
          value: currentValue,
          isPristine: isPristine
        })))
      });
    }
  }, {
    key: "handlePickerOptionChange",
    value: function handlePickerOptionChange(fieldName, option) {
      var pickerConfig = this.props.formConfig[fieldName];
      var isSingleValueMode = pickerConfig.pickerMode === _types.CustomPickerMode.Single;
      var currentPickerState = this.state.form[fieldName]; // todo handle isPristine in customPicker

      return this.setState({
        form: (0, _objectSpread11.default)({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, (0, _objectSpread11.default)({}, currentPickerState, {
          hasError: undefined,
          isPristine: false,
          options: currentPickerState.options.map(function (currentStateOption) {
            if (isSingleValueMode) {
              return currentStateOption.value === option.value ? option : (0, _objectSpread11.default)({}, currentStateOption, {
                isSelected: false
              });
            }

            return currentStateOption.value === option.value ? option : currentStateOption;
          })
        })))
      });
    }
  }, {
    key: "handleCheckboxChange",
    value: function handleCheckboxChange(fieldName) {
      var newValue = !this.state.form[fieldName].value;
      this.setState({
        form: (0, _objectSpread11.default)({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, (0, _objectSpread11.default)({}, this.state.form[fieldName], {
          value: newValue,
          isPristine: false,
          hasError: this.getCheckboxErrorMessage(fieldName, newValue)
        })))
      });
    }
  }, {
    key: "renderChild",
    value: function renderChild(child) {
      var _this4 = this;

      if (_utils.R.is(String, child) || _utils.R.is(Number, child) || child === null) {
        return child;
      }

      var reactElementChild = child; // tslint:disable-line no-any

      if (reactElementChild.type === _Input.Input) {
        var _this$props = this.props,
            formConfig = _this$props.formConfig,
            isLoading = _this$props.isLoading;
        var fieldName = reactElementChild.props.formFieldName;
        var configProps = formConfig[fieldName];
        var inputProps = reactElementChild.props.inputProps;
        var customInputStyles = inputProps && inputProps.style ? inputProps.style : {};
        var formConfigStyles = configProps.inputProps && configProps.inputProps.style ? configProps.inputProps.style : {};
        return _react.default.cloneElement(reactElementChild, (0, _objectSpread11.default)({}, reactElementChild.props, {
          withError: this.state.form[fieldName].hasError,
          inputProps: (0, _objectSpread11.default)({
            disabled: Boolean(isLoading)
          }, configProps.inputProps, {
            style: (0, _objectSpread11.default)({}, formConfigStyles, customInputStyles),
            value: this.state.form[fieldName].value,
            onChange: function onChange(_ref16) {
              var currentTarget = _ref16.currentTarget;
              return _this4.onTextChange(currentTarget.value, fieldName);
            },
            onBlur: function onBlur() {
              return _this4.onInputBlur(fieldName);
            }
          })
        }));
      }

      if (reactElementChild.type === _CustomPicker.CustomPicker) {
        var _fieldName = reactElementChild.props.formFieldName;
        var pickerState = this.state.form[_fieldName];
        return _react.default.cloneElement(reactElementChild, (0, _objectSpread11.default)({}, reactElementChild.props, {
          withError: this.state.form[_fieldName].hasError,
          options: pickerState.options,
          onOptionChange: function onOptionChange(option) {
            return _this4.handlePickerOptionChange(_fieldName, option);
          }
        }));
      }

      if (reactElementChild.type === _Checkbox.Checkbox) {
        var _fieldName2 = reactElementChild.props.formFieldName;
        return _react.default.cloneElement(reactElementChild, (0, _objectSpread11.default)({}, reactElementChild.props, {
          withError: this.state.form[_fieldName2].hasError,
          isSelected: this.state.form[_fieldName2].value,
          onClick: function onClick() {
            return _this4.handleCheckboxChange(_fieldName2);
          }
        }));
      }

      var reactElementChildren = reactElementChild.props.children;

      if (reactElementChildren) {
        var newChildren = _react.default.Children.map(reactElementChildren, this.renderChild);

        return _react.default.cloneElement(reactElementChild, reactElementChild.props, newChildren);
      }

      return reactElementChild;
    }
  }, {
    key: "renderForm",
    value: function renderForm() {
      var children = this.props.children;

      if (!children) {
        throw new Error('children are mandatory');
      }

      return _react.default.Children.map(this.props.children, this.renderChild);
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        style: (0, _objectSpread11.default)({}, styles.container, this.props.customFormContainerStyles)
      }, this.renderForm());
    }
  }, {
    key: "isFormValid",
    get: function get() {
      var _this5 = this;

      var areInputsValid = _utils.R.toPairs(this.state.form).filter(function (_ref17) {
        var _ref18 = (0, _slicedToArray2.default)(_ref17, 2),
            fieldObject = _ref18[1];

        return fieldObject.fieldType === _types.FormField.Input;
      }).map(function (_ref19) {
        var _ref20 = (0, _slicedToArray2.default)(_ref19, 2),
            fieldName = _ref20[0],
            fieldObject = _ref20[1];

        return _this5.validateField(fieldName, fieldObject.value);
      }).every(Boolean);

      var areCustomPickersValid = _utils.R.toPairs(this.state.form).filter(function (_ref21) {
        var _ref22 = (0, _slicedToArray2.default)(_ref21, 2),
            fieldObject = _ref22[1];

        return fieldObject.fieldType === _types.FormField.CustomPicker;
      }).map(function (_ref23) {
        var _ref24 = (0, _slicedToArray2.default)(_ref23, 1),
            fieldName = _ref24[0];

        return _this5.validateCustomPicker(fieldName);
      }).every(Boolean);

      var areCheckboxesValid = _utils.R.toPairs(this.state.form).filter(function (_ref25) {
        var _ref26 = (0, _slicedToArray2.default)(_ref25, 2),
            fieldObject = _ref26[1];

        return fieldObject.fieldType === _types.FormField.Checkbox && fieldObject.isRequired;
      }).map(function (_ref27) {
        var _ref28 = (0, _slicedToArray2.default)(_ref27, 1),
            fieldName = _ref28[0];

        return _this5.validateCheckbox(fieldName);
      }).every(Boolean);

      return _utils.R.all(areInputsValid, areCustomPickersValid, areCheckboxesValid, !this.props.isLoading);
    }
  }, {
    key: "hasValidCompares",
    get: function get() {
      var _this6 = this;

      var inputsToCompare = _utils.R.toPairs(this.state.form).filter(function (_ref29) {
        var _ref30 = (0, _slicedToArray2.default)(_ref29, 2),
            fieldName = _ref30[0],
            fieldObject = _ref30[1];

        return fieldObject.fieldType === _types.FormField.Input && Boolean(_this6.props.formConfig[fieldName].compareWith);
      });

      return inputsToCompare.length ? inputsToCompare.map(function (_ref31) {
        var _ref32 = (0, _slicedToArray2.default)(_ref31, 2),
            fieldName = _ref32[0],
            fieldObject = _ref32[1];

        var fieldToCompare = _this6.props.formConfig[fieldName].compareWith.fieldName;
        return fieldObject.value === _this6.state.form[fieldToCompare].value;
      }).every(Boolean) : true;
    }
  }]);
  return Form;
}(_react.default.Component);

exports.Form = Form;
(0, _defineProperty2.default)(Form, "defaultProps", {
  customFormContainerStyles: {}
});
var styles = {
  container: {
    width: '100%'
  }
};