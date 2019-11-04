"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomField = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _ErrorMessage = require("./ErrorMessage");

var CustomField =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(CustomField, _React$Component);

  function CustomField(props) {
    var _this;

    (0, _classCallCheck2.default)(this, CustomField);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CustomField).call(this, props));
    _this.onCustomFieldBlur = _this.onCustomFieldBlur.bind((0, _assertThisInitialized2.default)(_this));
    _this.onCustomFieldChange = _this.onCustomFieldChange.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(CustomField, [{
    key: "onCustomFieldChange",
    value: function onCustomFieldChange(value) {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: "onCustomFieldBlur",
    value: function onCustomFieldBlur() {
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  }, {
    key: "renderCustomField",
    value: function renderCustomField() {
      if (this.props.value === undefined) {
        throw Error('value is required');
      }

      return this.props.component(this.props.value, this.onCustomFieldChange, this.onCustomFieldBlur);
    }
  }, {
    key: "renderError",
    value: function renderError() {
      return _react.default.createElement(_ErrorMessage.ErrorMessage, {
        text: this.props.withError,
        style: this.props.customErrorStyle
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(_react.Fragment, null, this.renderCustomField(), this.renderError());
    }
  }]);
  return CustomField;
}(_react.default.Component);

exports.CustomField = CustomField;