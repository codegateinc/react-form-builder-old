"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Checkbox = void 0;

var _react = _interopRequireDefault(require("react"));

var _ErrorMessage = require("./ErrorMessage");

var renderErrorText = function renderErrorText(withError, errorMessageStyles) {
  return _react.default.createElement(_ErrorMessage.ErrorMessage, {
    text: withError,
    style: errorMessageStyles
  });
};

var Checkbox = function Checkbox(_ref) {
  var renderComponent = _ref.renderComponent,
      isSelected = _ref.isSelected,
      withError = _ref.withError,
      errorMessageStyles = _ref.errorMessageStyles,
      onClick = _ref.onClick;
  return renderComponent ? _react.default.createElement("div", {
    onClick: onClick
  }, renderComponent(Boolean(isSelected)), renderErrorText(withError, errorMessageStyles)) : null;
};

exports.Checkbox = Checkbox;
Checkbox.defaultProps = {
  errorMessageStyles: {}
};