"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorMessage = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _react = _interopRequireDefault(require("react"));

var _styles = require("../lib/styles");

var ErrorMessage = function ErrorMessage(_ref) {
  var text = _ref.text,
      style = _ref.style;
  return text ? _react.default.createElement("div", {
    style: (0, _objectSpread2.default)({}, styles.errorMessage, style)
  }, text) : null;
};

exports.ErrorMessage = ErrorMessage;
ErrorMessage.defaultProps = {
  style: {}
};
var styles = {
  errorMessage: {
    paddingHorizontal: 2,
    color: _styles.colors.red,
    fontSize: 11,
    paddingTop: 5
  }
};