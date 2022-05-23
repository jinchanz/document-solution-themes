"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

require("@alifd/next/es/affix/style");

var _affix = _interopRequireDefault(require("@alifd/next/es/affix"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _link = _interopRequireDefault(require("./link"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ActiveContext = _react.default.createContext('active');

var BizAnchor = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(BizAnchor, _React$Component);

  var _super = _createSuper(BizAnchor);

  function BizAnchor(props) {
    var _this;

    (0, _classCallCheck2.default)(this, BizAnchor);
    _this = _super.call(this, props);

    _this.onItemClick = function (key, e) {
      if (_this.props.noHash) {
        e.preventDefault();
        document.getElementById(key).scrollIntoView();
      }

      _this.setState({
        activeKey: key
      });
    };

    _this.state = {
      activeKey: null
    };
    return _this;
  }

  (0, _createClass2.default)(BizAnchor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.content()) {
        this.setState({});
      }
    }
  }, {
    key: "getChildren",
    value: function getChildren(childNode) {
      var _this2 = this;

      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return _react.default.Children.map(childNode, function (child) {
        if (child.type && child.type.displayName === 'Link') {
          var activeKey = child.props.href && child.props.href.replace('#', '') || '';

          if (child.props.children && child.props.children.length) {
            return [_react.default.cloneElement(child, {
              level: level,
              children: null,
              active: _this2.state.activeKey === activeKey || child.props.active,
              onItemClick: _this2.onItemClick.bind(_this2, activeKey)
            }), _this2.getChildren(child.props.children, level + 1)];
          }

          return _react.default.cloneElement(child, {
            level: level,
            active: _this2.state.activeKey === activeKey || child.props.active,
            onItemClick: _this2.onItemClick.bind(_this2, activeKey)
          });
        }

        return child;
      });
    }
  }, {
    key: "computeChildren",
    value: function computeChildren(originContent) {
      var _this3 = this;

      var nodeList = [];
      var maxLevel = 4;
      var content = originContent.children;

      if (content.length === 1 && !content[0].id && content[0].nodeName !== 'H') {
        content = content[0].children;
      }

      for (var index = 0; index < content.length; index++) {
        var ele = content[index];

        if (ele.id) {
          if (ele.nodeName === 'H1' || ele.nodeName === 'H2' || ele.nodeName === 'H3' || ele.nodeName === 'H4' || ele.nodeName === 'H5') {
            var level = Number(ele.nodeName.replace('H', ''));
            maxLevel = level < maxLevel ? level : maxLevel;
            nodeList.push({
              id: ele.id,
              level: level,
              title: ele.innerText
            });
          }
        }
      }

      return nodeList.map(function (n, i) {
        var onClick = function onClick() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this3.onItemClick.apply(_this3, [n.id].concat(args));
        };

        return /*#__PURE__*/_react.default.createElement(_link.default, {
          href: "#".concat(n.id),
          level: n.level - maxLevel + 1,
          key: i,
          title: n.title,
          onItemClick: onClick,
          active: _this3.state.activeKey === n.id
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          component = _this$props.component,
          content = _this$props.content,
          others = (0, _objectWithoutProperties2.default)(_this$props, ["children", "className", "component", "content"]);
      var cls = (0, _classnames.default)((_classNames = {}, (0, _defineProperty2.default)(_classNames, className, !!className), (0, _defineProperty2.default)(_classNames, 'biz-anchor', true), _classNames));
      var Tag = component || _affix.default;
      var childrenList = null;

      if (children) {
        childrenList = this.getChildren(children, 1);
      } else if (content()) {
        childrenList = this.computeChildren(content());
      }

      return /*#__PURE__*/_react.default.createElement(Tag, (0, _extends2.default)({
        className: cls
      }, others), childrenList);
    }
  }]);
  return BizAnchor;
}(_react.default.Component);

BizAnchor.displayName = 'BizAnchor';
BizAnchor.defaultProps = {
  content: function content() {
    return null;
  },
  noHash: false
};
var _default = BizAnchor;
exports.default = _default;
var Link = _link.default;
exports.Link = Link;