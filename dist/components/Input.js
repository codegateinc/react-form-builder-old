"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _styles = require("../lib/styles");

var _ErrorMessage = require("./ErrorMessage");

var renderErrorText = function renderErrorText(withError, errorMessageStyles) {
  return _react.default.createElement(_ErrorMessage.ErrorMessage, {
    text: withError,
    style: errorMessageStyles
  });
};

var Input = function Input(props) {
  var inputProps = props.inputProps,
      withError = props.withError,
      errorMessageStyles = props.errorMessageStyles;

  var _ref = inputProps || {},
      style = _ref.style,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["style"]);

  return _react.default.createElement("div", {
    style: styles.container
  }, _react.default.createElement("div", {
    style: styles.inputWrapper
  }, _react.default.createElement("input", (0, _extends2.default)({
    style: (0, _objectSpread2.default)({}, styles.input, withError ? styles.errorInput : {}, style)
  }, rest))), renderErrorText(withError, errorMessageStyles));
};

exports.Input = Input;
Input.defaultProps = {
  errorMessageStyles: {},
  inputProps: {
    style: {}
  }
};
var styles = {
  container: {
    width: '100%'
  },
  inputWrapper: {
    width: '100%'
  },
  input: {
    width: '100%',
    height: 36,
    borderRadius: 4,
    backgroundColor: _styles.colors.white,
    padding: '7px 15px',
    fontSize: 17,
    color: _styles.colors.midnightBlue,
    outline: 'none'
  },
  errorInput: {
    color: _styles.colors.red
  }
};