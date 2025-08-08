var __extends =
	(this && this.__extends) ||
	(function () {
		var extendStatics = function (d, b) {
			extendStatics =
				Object.setPrototypeOf ||
				({__proto__: []} instanceof Array &&
					function (d, b) {
						d.__proto__ = b;
					}) ||
				function (d, b) {
					for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
				};
			return extendStatics(d, b);
		};
		return function (d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
		};
	})();
var __assign =
	(this && this.__assign) ||
	function () {
		__assign =
			Object.assign ||
			function (t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
var __read =
	(this && this.__read) ||
	function (o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o),
			r,
			ar = [],
			e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = {error: error};
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
var __spreadArray =
	(this && this.__spreadArray) ||
	function (to, from, pack) {
		if (pack || arguments.length === 2)
			for (var i = 0, l = from.length, ar; i < l; i++) {
				if (ar || !(i in from)) {
					if (!ar) ar = Array.prototype.slice.call(from, 0, i);
					ar[i] = from[i];
				}
			}
		return to.concat(ar || Array.prototype.slice.call(from));
	};
var UI;
(function (UI) {
	var PropertiesError = /** @class */ (function (_super) {
		__extends(PropertiesError, _super);
		function PropertiesError(message) {
			var _this = _super.call(this, message) || this;
			_this.name = "JSX.PropertiesError";
			return _this;
		}
		return PropertiesError;
	})(Error);
	UI.PropertiesError = PropertiesError;
	function parseElement(tag, properties) {
		var _a;
		var children = [];
		for (var _i = 2; _i < arguments.length; _i++) {
			children[_i - 2] = arguments[_i];
		}
		if (typeof tag == "function") {
			return tag.apply(void 0, __spreadArray([__assign({}, properties)], __read(children), false));
		}
		if (!properties) {
			throw new PropertiesError('Params of element "'.concat(children, "\" can't be empty"));
		}
		properties.clicker = {};
		if ("onclick" in properties) {
			properties.clicker.onClick = properties.onclick;
		}
		if ("onlongclick" in properties) {
			properties.clicker.onLongClick = properties.onlongclick;
		}
		if (properties.type == "text") {
			properties.text = children.toString();
		}
		if (properties.type == "image") {
			properties.bitmap = children.toString().trim();
		}
		if (properties.type == "custom") {
			if ("onbindingupdated" in properties) {
				properties.custom.onBindingUpdated = properties.onbindingupdated;
			}
			if ("oncontainerinit" in properties) {
				properties.custom.onContainerInit = properties.oncontainerinit;
			}
			if ("ondraw" in properties) {
				properties.custom.onDraw = properties.ondraw;
			}
			if ("onrelease" in properties) {
				properties.custom.onRelease = properties.onrelease;
			}
			if ("onreset" in properties) {
				properties.custom.onReset = properties.onreset;
			}
			if ("onsetup" in properties) {
				properties.custom.onSetup = properties.onsetup;
			}
			if ("ontouchreleased" in properties) {
				properties.custom.onTouchReleased = properties.ontouchreleased;
			}
		}
		if (tag == "element" && !("key" in properties)) {
			return properties;
		}
		return (_a = {}), (_a[properties.key || tag] = properties), _a;
	}
	UI.parseElement = parseElement;
	function Fragment(properties) {
		var children = [];
		for (var _i = 1; _i < arguments.length; _i++) {
			children[_i - 1] = arguments[_i];
		}
		var elementSet = {};
		for (var i in children) {
			Object.assign(elementSet, children[i]);
		}
		return elementSet;
	}
	UI.Fragment = Fragment;
})(UI || (UI = {}));