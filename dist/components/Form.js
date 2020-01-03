"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _utils = require("../lib/utils");

var _utils2 = require("../utils");

var _types = require("../types");

var _Input = require("./Input");

var _CustomPicker = require("./CustomPicker");

var _Checkbox = require("./Checkbox");

var _CustomField = require("./CustomField");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Form =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Form, _React$Component);

  function Form(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Form);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Form).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "filtersStream", new _rxjs.Subject());
    _this.state = {
      form: (0, _utils2.prepareFormInitialState)(_this.props.formConfig)
    };
    _this.submitForm = _this.submitForm.bind((0, _assertThisInitialized2.default)(_this));
    _this.clearValues = _this.clearValues.bind((0, _assertThisInitialized2.default)(_this));
    _this.updateState = _this.updateState.bind((0, _assertThisInitialized2.default)(_this));
    _this.renderChild = _this.renderChild.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleFormError = _this.handleFormError.bind((0, _assertThisInitialized2.default)(_this));
    _this.checkedFormFields = _this.checkedFormFields.bind((0, _assertThisInitialized2.default)(_this));
    _this.restoreInitialValues = _this.restoreInitialValues.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Form, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.filtersStream.pipe((0, _operators.debounceTime)(this.props.debounceTime || 0)).subscribe(function () {
        if (_this2.props.onFormUpdate) {
          _this2.props.onFormUpdate(_this2.formValues);
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.filtersStream.unsubscribe();
    }
  }, {
    key: "restoreInitialValues",
    value: function restoreInitialValues() {
      var _this3 = this;

      this.setState({
        form: (0, _utils2.prepareFormInitialState)(this.props.formConfig)
      }, function () {
        return _this3.filtersStream.next();
      });
    }
  }, {
    key: "clearValues",
    value: function clearValues() {
      var _this4 = this;

      this.setState({
        form: (0, _utils2.clearFormState)(this.props.formConfig)
      }, function () {
        return _this4.filtersStream.next();
      });
    }
  }, {
    key: "updateState",
    value: function updateState(form, callBack) {
      var _this5 = this;

      this.setState({
        form: form
      }, function () {
        if (callBack) {
          callBack();
        }

        _this5.filtersStream.next();
      });
    }
  }, {
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
      this.updateState(_objectSpread({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, _objectSpread({}, this.state.form[fieldName], {
        hasError: errorMessage,
        isValid: false
      }))));
    }
  }, {
    key: "setCustomFieldValue",
    value: function setCustomFieldValue(fieldName, value) {
      var form = this.state.form;
      var field = form[fieldName];

      if (field.fieldType === _types.FormField.CustomPicker) {
        var customPickerField = field;
        return this.updateState(_objectSpread({}, form, (0, _defineProperty2.default)({}, fieldName, _objectSpread({}, customPickerField, {
          options: customPickerField.options.map(function (option) {
            if (option.value === value) {
              return _objectSpread({}, option, {
                isSelected: true
              });
            }

            return _objectSpread({}, option, {
              isSelected: false
            });
          })
        }))));
      }

      this.updateState(_objectSpread({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, _objectSpread({}, this.state.form[fieldName], {
        value: value
      }))));
    }
  }, {
    key: "checkFieldValidation",
    value: function checkFieldValidation(fieldName, fieldObject, value) {
      var _this6 = this;

      if (fieldObject.fieldType === _types.FormField.Input) {
        var fieldProperties = fieldObject;
        var isValid = this.validateField(fieldName, fieldProperties.value);
        var _ref3 = this.props.formConfig[fieldName],
            compareWith = _ref3.compareWith;

        var hasError = _utils.R.cond([[function () {
          return !isValid;
        }, function () {
          return _this6.getFieldErrorMessage(fieldName, fieldProperties.value);
        }], [function () {
          return Boolean(compareWith);
        }, function () {
          return fieldProperties.value !== (value || _this6.state.form[compareWith.fieldName].value) ? compareWith.errorMessage : undefined;
        }], [_utils.R.T, _utils.R.always(undefined)]])();

        return [fieldName, _objectSpread({}, fieldObject, {
          isValid: isValid,
          hasError: hasError
        })];
      }

      if (fieldObject.fieldType === _types.FormField.Checkbox) {
        return [fieldName, _objectSpread({}, fieldObject, {
          hasError: this.getCheckboxErrorMessage(fieldName, fieldObject.value)
        })];
      } // CustomPicker


      return [fieldName, _objectSpread({}, fieldObject, {
        hasError: this.getCustomPickerErrorMessage(fieldName)
      })];
    }
  }, {
    key: "checkedFormFields",
    value: function checkedFormFields() {
      var _this7 = this;

      return _utils.R.toPairs(this.state.form).filter(function (_ref4) {
        var _ref5 = (0, _slicedToArray2.default)(_ref4, 2),
            fieldName = _ref5[0],
            fieldObject = _ref5[1];

        return fieldObject.isRequired || fieldObject.fieldType === _types.FormField.Input && Boolean(fieldObject.value) && Boolean(_this7.props.formConfig[fieldName].validationRules);
      }).map(function (_ref6) {
        var _ref7 = (0, _slicedToArray2.default)(_ref6, 2),
            fieldName = _ref7[0],
            fieldObject = _ref7[1];

        return _this7.checkFieldValidation(fieldName, fieldObject);
      }).reduce(function (acc, _ref8) {
        var _ref9 = (0, _slicedToArray2.default)(_ref8, 2),
            fieldName = _ref9[0],
            fieldObject = _ref9[1];

        return _objectSpread({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldObject));
      }, {});
    }
  }, {
    key: "fieldHasValidCompares",
    value: function fieldHasValidCompares(fieldName, compareWith, value) {
      var formField = this.state.form[compareWith];

      var _this$checkFieldValid = this.checkFieldValidation(fieldName, formField, value),
          _this$checkFieldValid2 = (0, _slicedToArray2.default)(_this$checkFieldValid, 2),
          fieldObject = _this$checkFieldValid2[1];

      var validatedFieldObject = fieldObject;
      return !Boolean(validatedFieldObject.hasError);
    }
  }, {
    key: "showErrorsOnSubmit",
    value: function showErrorsOnSubmit() {
      var checkedFormFields = this.checkedFormFields();
      this.updateState(_objectSpread({}, this.state.form, {}, checkedFormFields), this.handleFormError);
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
      if (!this.isFormValid || !this.hasValidCompares) {
        return this.showErrorsOnSubmit();
      }

      this.props.onFormSubmit(this.formValues);
    }
  }, {
    key: "validateField",
    value: function validateField(formFieldName, value) {
      var fieldConfig = this.props.formConfig[formFieldName];

      if (!fieldConfig.isRequired && !value) {
        return true;
      }

      if (fieldConfig.validationRules) {
        return fieldConfig.validationRules.map(function (_ref12) {
          var validationFunction = _ref12.validationFunction;
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
        var _fieldConfig$validati = fieldConfig.validationRules.map(function (_ref13) {
          var validationFunction = _ref13.validationFunction,
              errorMessage = _ref13.errorMessage;
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
    key: "validateComparedFields",
    value: function validateComparedFields(valueToCompare, compareFieldName) {
      var fieldToCompare = this.state.form[compareFieldName];
      var compareFieldsConfigProps = this.props.formConfig[compareFieldName];
      var shouldLiveCheckCompareWith = Boolean(fieldToCompare.hasError) || !fieldToCompare.isPristine;
      var isValid = this.validateField(compareFieldName, fieldToCompare.value);

      if (!isValid) {
        return (0, _defineProperty2.default)({}, compareFieldName, fieldToCompare);
      }

      if (valueToCompare === fieldToCompare.value && shouldLiveCheckCompareWith) {
        return (0, _defineProperty2.default)({}, compareFieldName, _objectSpread({}, fieldToCompare, {
          hasError: undefined
        }));
      }

      var newComparedFiledState = !shouldLiveCheckCompareWith ? _objectSpread({}, fieldToCompare, {
        hasError: undefined
      }) : _objectSpread({}, fieldToCompare, {
        hasError: compareFieldsConfigProps.compareWith && compareFieldsConfigProps.compareWith.errorMessage
      });
      return (0, _defineProperty2.default)({}, compareFieldName, newComparedFiledState);
    }
  }, {
    key: "onTextChange",
    value: function onTextChange(value, formFieldName) {
      var formField = this.state.form[formFieldName];
      var formFieldConfigProps = this.props.formConfig[formFieldName];
      var shouldLiveCheck = Boolean(formField.hasError) || this.isFormValid;
      var valueParser = this.props.formConfig[formFieldName].liveParser;
      var newValue = valueParser ? valueParser(value) : value;
      var isValid = shouldLiveCheck ? this.validateField(formFieldName, newValue) : formField.isValid;
      var hasValidCompare = isValid && shouldLiveCheck && Boolean(formFieldConfigProps.compareWith) ? this.fieldHasValidCompares(formFieldName, formFieldConfigProps.compareWith.fieldName, value) : true;
      var errorMessage = !isValid && shouldLiveCheck ? this.getFieldErrorMessage(formFieldName, newValue) : !hasValidCompare ? formFieldConfigProps.compareWith && formFieldConfigProps.compareWith.errorMessage : undefined;
      var isPristine = !(value !== this.props.formConfig[formFieldName].value);
      var comparedFieldState = formFieldConfigProps.compareWith && (errorMessage || isValid) ? this.validateComparedFields(value, formFieldConfigProps.compareWith.fieldName) : {};
      this.updateState(_objectSpread({}, this.state.form, {}, comparedFieldState, (0, _defineProperty2.default)({}, formFieldName, _objectSpread({}, this.state.form[formFieldName], {
        value: newValue,
        isValid: isValid,
        hasError: errorMessage,
        isPristine: isPristine
      }))));
    }
  }, {
    key: "onInputBlur",
    value: function onInputBlur(fieldName) {
      var currentValue = this.state.form[fieldName].value.trim();
      var isValid = this.validateField(fieldName, currentValue);
      var formFieldConfigProps = this.props.formConfig[fieldName]; // isValid and compareWith exists and not comparedWithIsPristine

      var hasValidCompare = isValid && Boolean(formFieldConfigProps.compareWith) && !this.state.form[formFieldConfigProps.compareWith.fieldName].isPristine ? this.fieldHasValidCompares(fieldName, formFieldConfigProps.compareWith.fieldName, currentValue) : true;
      var errorMessage = !isValid ? this.getFieldErrorMessage(fieldName, currentValue) : !hasValidCompare ? formFieldConfigProps.compareWith && formFieldConfigProps.compareWith.errorMessage : undefined;
      var isPristine = !(currentValue !== this.props.formConfig[fieldName].value);
      this.updateState(_objectSpread({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, _objectSpread({}, this.state.form[fieldName], {
        isValid: isValid,
        hasError: errorMessage,
        value: currentValue,
        isPristine: isPristine
      }))));
    }
  }, {
    key: "handlePickerOptionChange",
    value: function handlePickerOptionChange(fieldName, options) {
      var pickerConfig = this.props.formConfig[fieldName];
      var isSingleValueMode = pickerConfig.pickerMode === _types.CustomPickerMode.Single;
      var currentPickerState = this.state.form[fieldName];
      var lastValue = _utils.R.hasElements(options) ? options[options.length - 1] : '';
      var selectedOptions = _utils.R.isEmpty(lastValue) || !_utils.R.isDefined(lastValue) ? [lastValue] : options.filter(function (option) {
        return !_utils.R.isEmpty(option) && _utils.R.isDefined(option);
      });
      var updatedPickerOptions = currentPickerState.options.map(function (currentStateOption) {
        if (isSingleValueMode) {
          var _options = (0, _slicedToArray2.default)(options, 1),
              option = _options[0];

          return currentStateOption.value === option ? _objectSpread({}, currentStateOption, {
            isSelected: true
          }) : _objectSpread({}, currentStateOption, {
            isSelected: false
          });
        }

        return selectedOptions.includes(currentStateOption.value) ? _objectSpread({}, currentStateOption, {
          isSelected: true
        }) : _objectSpread({}, currentStateOption, {
          isSelected: false
        });
      });

      var comparator = function comparator(optionA, optionB) {
        return optionA.value === optionB.value && optionA.isSelected === optionB.isSelected;
      };

      var isPristine = !_utils.R.hasElements(_utils.R.differenceWith(comparator, updatedPickerOptions, pickerConfig.options));
      return this.updateState(_objectSpread({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, _objectSpread({}, currentPickerState, {
        hasError: this.getCustomPickerErrorMessage(fieldName),
        isPristine: isPristine,
        options: updatedPickerOptions
      }))));
    }
  }, {
    key: "handleCheckboxChange",
    value: function handleCheckboxChange(fieldName) {
      var newValue = !this.state.form[fieldName].value;
      this.updateState(_objectSpread({}, this.state.form, (0, _defineProperty2.default)({}, fieldName, _objectSpread({}, this.state.form[fieldName], {
        value: newValue,
        isPristine: false,
        hasError: this.getCheckboxErrorMessage(fieldName, newValue)
      }))));
    }
  }, {
    key: "renderChild",
    value: function renderChild(child) {
      var _this8 = this;

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
        return _react.default.cloneElement(reactElementChild, _objectSpread({}, reactElementChild.props, {
          withError: this.state.form[fieldName].hasError,
          inputProps: _objectSpread({
            disabled: Boolean(isLoading)
          }, configProps.inputProps, {
            style: _objectSpread({}, formConfigStyles, {}, customInputStyles),
            value: this.state.form[fieldName].value,
            onChange: function onChange(_ref17) {
              var currentTarget = _ref17.currentTarget;
              return _this8.onTextChange(currentTarget.value, fieldName);
            },
            onBlur: function onBlur() {
              return _this8.onInputBlur(fieldName);
            }
          })
        }));
      }

      if (reactElementChild.type === _CustomField.CustomField) {
        var _fieldName = reactElementChild.props.formFieldName;
        return _react.default.cloneElement(reactElementChild, _objectSpread({}, reactElementChild.props, {
          withError: this.state.form[_fieldName].hasError,
          isPristine: this.state.form[_fieldName].isPristine,
          value: this.state.form[_fieldName].value,
          onChange: function onChange(value) {
            return _this8.onTextChange(value, _fieldName);
          },
          onBlur: function onBlur() {
            return _this8.onInputBlur(_fieldName);
          }
        }));
      }

      if (reactElementChild.type === _CustomPicker.CustomPicker) {
        var _fieldName2 = reactElementChild.props.formFieldName;
        var pickerState = this.state.form[_fieldName2];
        return _react.default.cloneElement(reactElementChild, _objectSpread({}, reactElementChild.props, {
          withError: this.state.form[_fieldName2].hasError,
          options: pickerState.options,
          isPristine: this.state.form[_fieldName2].isPristine,
          onOptionChange: function onOptionChange(options) {
            return _this8.handlePickerOptionChange(_fieldName2, options);
          }
        }));
      }

      if (reactElementChild.type === _Checkbox.Checkbox) {
        var _fieldName3 = reactElementChild.props.formFieldName;
        return _react.default.cloneElement(reactElementChild, _objectSpread({}, reactElementChild.props, {
          withError: this.state.form[_fieldName3].hasError,
          isSelected: this.state.form[_fieldName3].value,
          onClick: function onClick() {
            return _this8.handleCheckboxChange(_fieldName3);
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
        style: _objectSpread({}, styles.container, {}, this.props.customFormContainerStyles)
      }, this.renderForm());
    }
  }, {
    key: "isFormValid",
    get: function get() {
      var _this9 = this;

      var areInputsValid = _utils.R.toPairs(this.state.form).filter(function (_ref18) {
        var _ref19 = (0, _slicedToArray2.default)(_ref18, 2),
            fieldObject = _ref19[1];

        return fieldObject.fieldType === _types.FormField.Input;
      }).map(function (_ref20) {
        var _ref21 = (0, _slicedToArray2.default)(_ref20, 2),
            fieldName = _ref21[0],
            fieldObject = _ref21[1];

        return _this9.validateField(fieldName, fieldObject.value);
      }).every(Boolean);

      var areCustomPickersValid = _utils.R.toPairs(this.state.form).filter(function (_ref22) {
        var _ref23 = (0, _slicedToArray2.default)(_ref22, 2),
            fieldObject = _ref23[1];

        return fieldObject.fieldType === _types.FormField.CustomPicker;
      }).map(function (_ref24) {
        var _ref25 = (0, _slicedToArray2.default)(_ref24, 1),
            fieldName = _ref25[0];

        return _this9.validateCustomPicker(fieldName);
      }).every(Boolean);

      var areCheckboxesValid = _utils.R.toPairs(this.state.form).filter(function (_ref26) {
        var _ref27 = (0, _slicedToArray2.default)(_ref26, 2),
            fieldObject = _ref27[1];

        return fieldObject.fieldType === _types.FormField.Checkbox && fieldObject.isRequired;
      }).map(function (_ref28) {
        var _ref29 = (0, _slicedToArray2.default)(_ref28, 1),
            fieldName = _ref29[0];

        return _this9.validateCheckbox(fieldName);
      }).every(Boolean);

      return _utils.R.all(areInputsValid, areCustomPickersValid, areCheckboxesValid, !this.props.isLoading);
    }
  }, {
    key: "hasValidCompares",
    get: function get() {
      var _this10 = this;

      var inputsToCompare = _utils.R.toPairs(this.state.form).filter(function (_ref30) {
        var _ref31 = (0, _slicedToArray2.default)(_ref30, 2),
            fieldName = _ref31[0],
            fieldObject = _ref31[1];

        return fieldObject.fieldType === _types.FormField.Input && Boolean(_this10.props.formConfig[fieldName].compareWith);
      });

      return inputsToCompare.length ? inputsToCompare.map(function (_ref32) {
        var _ref33 = (0, _slicedToArray2.default)(_ref32, 2),
            fieldName = _ref33[0],
            fieldObject = _ref33[1];

        var fieldToCompare = _this10.props.formConfig[fieldName].compareWith.fieldName;
        return fieldObject.value === _this10.state.form[fieldToCompare].value;
      }).every(Boolean) : true;
    }
  }, {
    key: "formValues",
    get: function get() {
      var _this11 = this;

      return _utils.R.toPairs(this.state.form).reduce(function (acc, _ref34) {
        var _ref35 = (0, _slicedToArray2.default)(_ref34, 2),
            fieldName = _ref35[0],
            fieldObject = _ref35[1];

        if (fieldObject.fieldType === _types.FormField.Input) {
          var inputStateProperties = fieldObject;
          var submitParser = _this11.props.formConfig[fieldName].submitParser;
          return _objectSpread({}, acc, (0, _defineProperty2.default)({}, fieldName, submitParser ? submitParser(fieldObject.value) : inputStateProperties.value));
        }

        if (fieldObject.fieldType === _types.FormField.Checkbox) {
          return _objectSpread({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldObject.value));
        }

        if (fieldObject.fieldType === _types.FormField.CustomField) {
          return _objectSpread({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldObject.value));
        } // CustomPicker


        return _objectSpread({}, acc, (0, _defineProperty2.default)({}, fieldName, fieldObject.options.filter(function (option) {
          return option.isSelected;
        }).map(function (option) {
          return option.value;
        })));
      }, {});
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