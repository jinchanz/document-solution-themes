"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Link = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Link, _React$Component);

  var _super = _createSuper(Link);

  function Link() {
    var _this;

    (0, _classCallCheck2.default)(this, Link);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.handleClick = function (e) {
      _this.props.onItemClick(e);
    };

    return _this;
  }

  (0, _createClass2.default)(Link, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children,
          href = _this$props.href,
          title = _this$props.title,
          active = _this$props.active,
          level = _this$props.level,
          others = (0, _objectWithoutProperties2.default)(_this$props, ["className", "children", "href", "title", "active", "level"]);
      var cls = (0, _classnames.default)((_classNames = {
        className: !!className,
        'biz-anchor-link': true
      }, (0, _defineProperty2.default)(_classNames, "biz-anchor-link-level-".concat(level), true), (0, _defineProperty2.default)(_classNames, 'biz-anchor-link-active', active), _classNames));
      return /*#__PURE__*/_react.default.createElement("div", {
        className: cls
      }, /*#__PURE__*/_react.default.createElement("a", {
        className: "biz-anchor-link-title",
        href: href,
        onClick: this.handleClick
      }, title), children);
    }
  }]);
  return Link;
}(_react.default.Component);

Link.displayName = 'Link';
Link.defaultProps = {
  onItemClick: function onItemClick() {}
};
var _default = Link;
exports.default = _default;