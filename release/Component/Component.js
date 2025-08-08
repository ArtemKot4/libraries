var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Thank you for downloading this lib!
 * Author: ArtemKot
 * Year: 2025
 */
var UI;
(function (UI) {
    /**
     * Namespace to manipulate your jsx, tsx and provide it to function calls.
     */
    var JSX;
    (function (JSX) {
        var PropertiesError = /** @class */ (function (_super) {
            __extends(PropertiesError, _super);
            function PropertiesError(message) {
                var _this = _super.call(this, message) || this;
                _this.name = "PropertiesError";
                return _this;
            }
            return PropertiesError;
        }(Error));
        JSX.PropertiesError = PropertiesError;
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
                properties = {};
                //if your component's must contain any properties, delete comment below.
                //throw new PropertiesError(`Params of element "${children}" can't be empty`);
            }
            properties.clicker = {};
            if ("onClick" in properties) {
                properties.clicker.onClick = properties.onClick;
            }
            if ("onLongClick" in properties) {
                properties.clicker.onLongClick = properties.onLongClick;
            }
            if (properties.type == "text") {
                properties.text = children.toString();
            }
            if (properties.type == "image") {
                properties.bitmap = children.toString().trim();
            }
            if (properties.type == "custom") {
                if ("onBindingUpdated" in properties) {
                    properties.custom.onBindingUpdated = properties.onBindingUpdated;
                }
                if ("onContainerInit" in properties) {
                    properties.custom.onContainerInit = properties.onContainerInit;
                }
                if ("onDraw" in properties) {
                    properties.custom.onDraw = properties.onDraw;
                }
                if ("onRelease" in properties) {
                    properties.custom.onRelease = properties.onRelease;
                }
                if ("onReset" in properties) {
                    properties.custom.onReset = properties.onReset;
                }
                if ("onSetup" in properties) {
                    properties.custom.onSetup = properties.onSetup;
                }
                if ("onTouchReleased" in properties) {
                    properties.custom.onTouchReleased = properties.onTouchReleased;
                }
            }
            if (tag == "element" && !("key" in properties)) {
                return properties;
            }
            return _a = {},
                _a[properties.key || tag] = properties,
                _a;
        }
        JSX.parseElement = parseElement;
        function deleteGarbage(element) {
            /* this keys can be used to rebuild.
            delete element.marginLeft;
            delete element.marginRight;
            delete element.marginTop;
            delete element.marginBottom;
            delete element.id;
            */
            // this make no sense
            delete element.key;
        }
        JSX.deleteGarbage = deleteGarbage;
        /**
         * Method to rebuild your elementSet using params defined earlier in xml.
         * @param elementSet element set for window
         * @returns UI.ElementSet
         */
        function rebuildElementSet(elementSet) {
            var dataID = {
                default: {
                    x: 0,
                    y: 0
                }
            };
            for (var i in elementSet) {
                if (typeof elementSet[i] != "object") {
                    continue;
                }
                var element = elementSet[i];
                var data = element.id ? dataID[element.id] = dataID[element.id] || { x: 0, y: 0 } : dataID["default"];
                var bitmap = null; //TextureSource.getNullable(String(element.bitmap));
                var width = element.width || bitmap && bitmap.getWidth() * element.scale() || 50;
                var height = element.height || bitmap && bitmap.getHeight() * element.scale() || 50;
                element.x = element.x || data.x;
                element.y = element.y || data.y;
                data.x = element.x + width + (element.marginRight || 0);
                data.y = element.y + height + (element.marginBottom || 0);
                deleteGarbage(element);
            }
            return elementSet;
        }
        JSX.rebuildElementSet = rebuildElementSet;
        function Fragment(properties) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            var elementSet = {};
            for (var i in children) {
                var element = children[i];
                Object.assign(elementSet, element);
            }
            return rebuildElementSet(elementSet);
        }
        JSX.Fragment = Fragment;
    })(JSX = UI.JSX || (UI.JSX = {}));
})(UI || (UI = {}));
