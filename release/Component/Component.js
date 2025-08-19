/**
 * Thank you for downloading library!
 * Author: ArtemKot
 * Year: 2025
 */
// LIBRARY({
//     name: "Component",
//     version: 1,
//     api: "CoreEngine",
//     shared: true
// });
// Translation.addTranslation("component.message.browser_link_title", {
//     en: "Switching to browser",
//     ru: "Переход в браузер"
// });
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
// Translation.addTranslation("component.message.browser_link_message", {
//     en: "Element ask switching by link",
//     ru: "Элемент запрашивает переход по ссылке"
// });
// Translation.addTranslation("component.message.browser_link_button", {
//     en: "Перейти",
//     ru: "Switch"
// });
var UI;
(function (UI) {
    UI.DRAWING_TYPES = [
        "background",
        // "text",
        "line",
        "bitmap",
        // "frame",
        // "custom"
    ];
    /**
     * Namespace to manipulate your jsx, tsx and provide it to function calls.
     */
    var JSX;
    (function (JSX) {
        JSX.divClasses = {};
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
        function getBitmapFromPath(path) {
            console.log(path);
            path = path.replace(new RegExp("__dir__", "g"), __dir__);
            try {
                return FileTools.ReadImage(path);
            }
            catch (e) {
                Logger.Log("Bitmap from path \"".concat(path, "\" is not exists"), "Component");
                return null;
            }
        }
        JSX.getBitmapFromPath = getBitmapFromPath;
        function openLink(url) {
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "http://" + url;
            }
            var context = UI.getContext();
            new android.app.AlertDialog.Builder(context)
                .setTitle(Translation.translate("component.message.browser_link_title"))
                .setMessage(Translation.translate("component.message.browser_link_message"))
                .setPositiveButton(Translation.translate("component.message.browser_link_button"), new android.content.DialogInterface.OnClickListener({
                onClick: function () {
                    try {
                        var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url));
                        context.startActivity(intent);
                    }
                    catch (_a) {
                        alert("Error with opening ".concat(url));
                    }
                }
            }))
                .setCancelable(true);
        }
        JSX.openLink = openLink;
        function getClickFunctionForLink(link, onClick) {
            return function (position, container, tileEntity, window, canvas, scale) {
                openLink(link);
                if (onClick != null) {
                    return onClick(position, container, tileEntity, window, canvas, scale);
                }
                return;
            };
        }
        JSX.getClickFunctionForLink = getClickFunctionForLink;
        function parseWindowContent(properties, children) {
            var content = {
                location: {
                    x: properties.x || 0,
                    y: properties.y || 0,
                    width: Number(properties.width) || 0,
                    height: Number(properties.height) || 0,
                    scrollX: Number(properties.scrollX || 0),
                    scrollY: Number(properties.scroolY || 0),
                    forceScrollX: properties.forceScrollX || false,
                    forceScrollY: properties.forceScrollY || false,
                    globalScale: properties.globalScale || false
                },
                drawing: children.drawing || [],
                elements: children.elements || {}
            };
            if (properties.background != null) {
                content.drawing.push({
                    type: "background",
                    color: properties.background
                });
            }
            //window.content = content;
            return content; //window;
        }
        JSX.parseWindowContent = parseWindowContent;
        function parseWindow(tag, properties, children) {
            var data = {};
            for (var i in children) {
                Object.assign(data, children[i]);
            }
            // const window = new UI.Window();
            // window.setContent(parseWindowContent(properties, children));
            // window.setBlockingBackground(properties.blockingBackground || false);
            // window.setCloseOnBackPressed(properties.closeOnBackPressed || false);
            // window.setAsGameOverlay(properties.overlay || false);
            // window.setDynamic(properties.dynamic || true);
            // window.setTouchable(properties.touchable || true);
            // window.setInventoryNeeded(properties.inventoryNeeded || false);
            // window.setEventListener({
            //     onOpen(window) {
            //         if(properties.alpha) {
            //             window.layout.setAlpha(properties.alpha);
            //         }
            //         if("onOpen" in children[0].events) {
            //             return properties.onOpen(window);
            //         }
            //     },
            //     onClose(window) {
            //         if("onClose" in children[0].events) {
            //             return properties.onClose(window);
            //         }
            //     }
            // });
            return parseWindowContent(properties, data); //window;
        }
        JSX.parseWindow = parseWindow;
        function parseStandardWindow(properties, children) {
            //const window = new UI.StandardWindow();
            var data = {};
            for (var i in children) {
                Object.assign(data, children[i]);
            }
            var content = parseWindowContent(properties, data);
            if ("standard" in children) {
                content.standard = data.standard;
            }
            if ("params" in children) {
                content.params = data.params;
            }
            if ("style" in children) {
                content.style = data.style;
            }
            // window.setContent(content);
            // window.setBlockingBackground(properties.blockingBackground || false);
            // window.setCloseOnBackPressed(properties.closeOnBackPressed || false);
            return content; //window;
        }
        JSX.parseStandardWindow = parseStandardWindow;
        function parseElement(tag, properties, children) {
            var _a;
            var type = tag == "element" ? properties.type || "custom" : tag == "picture" ? "image" : tag;
            if (type == "text") {
                properties.text = properties.text || children.toString();
            }
            if (properties.name == null) {
                if (tag == "frame" || tag == "text" || tag == "custom") {
                    return parseDrawing(tag, properties, children);
                }
            }
            if (type != "text") {
                if (!("bitmap" in properties)) {
                    properties.bitmap = properties.src != null ? getBitmapFromPath(properties.src) : children.toString();
                }
                if (!("bitmap2" in properties) && properties.src2 != null) {
                    properties.bitmap2 = getBitmapFromPath(properties.src2);
                }
            }
            properties.clicker = {};
            properties.clicker.onClick = properties.href ? getClickFunctionForLink(properties.href, properties.onClick) : properties.clicker.onClick || null;
            properties.clicker.onLongClick = properties.hrefLong ? getClickFunctionForLink(properties.hrefLong, properties.onLongClick) : properties.onLongClick || null;
            if (!properties.type) {
                properties.type = type;
            }
            if (tag == "element") {
                return properties;
            }
            return _a = {},
                _a[properties.name || String(java.util.UUID.randomUUID())] = properties,
                _a;
        }
        JSX.parseElement = parseElement;
        function parseDrawing(tag, properties, children) {
            properties.type = tag;
            return properties;
        }
        JSX.parseDrawing = parseDrawing;
        function parse(tag, properties) {
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
            if (tag == "window") {
                return parseWindow(tag, properties, children);
            }
            if (tag == "standardWindow" || tag == "standartWindow") {
                return parseStandardWindow(properties, children);
            }
            if (tag == "drawing") {
                return {
                    drawing: children
                };
            }
            if (tag == "elements") {
                return {
                    elements: rebuildElementSet(getElementSetFrom(children))
                };
            }
            if (tag == "params") {
                return {
                    params: children
                };
            }
            if (tag == "style") {
                return {
                    style: children
                };
            }
            if (tag == "standard") {
                return {
                    standard: children
                };
            }
            if (tag == "div") {
                return getElementSetWithDiv(properties, children);
            }
            if (UI.DRAWING_TYPES.includes(tag)) {
                return parseDrawing(tag, properties, children);
            }
            return parseElement(tag, properties, children);
        }
        JSX.parse = parse;
        function deleteGarbage(element) {
            /* this keys can be used to rebuild.
            delete element.marginLeft;
            delete element.marginRight;
            delete element.marginTop;
            delete element.marginBottom;
            delete element.id;
            */
            // this make no sense
            delete element.name;
        }
        JSX.deleteGarbage = deleteGarbage;
        function getCommonStyle(mainStyle, nextStyle) {
            return __assign(__assign({}, mainStyle), nextStyle);
        }
        JSX.getCommonStyle = getCommonStyle;
        /**
         * Method to rebuild your elementSet using params defined earlier in xml.
         * @param elementSet element set for window
         * @returns UI.ElementSet
         */
        function rebuildElementSet(elementSet) {
            var dataID = {};
            var _loop_1 = function (key) {
                var element = elementSet[key];
                if (!element || typeof element !== "object") {
                    return "continue";
                }
                element.id = element.id || "default";
                var marginHeight = Number(element.marginBottom || 0) - Number(element.marginTop || 0);
                var marginWidth = Number(element.marginRight || 0) - Number(element.marginLeft || 0);
                var data = dataID[element.id] = dataID[element.id] || { x: 0, y: 0 };
                var bitmap = null; //TextureSource.getNullable(String(element.bitmap));
                var scale = element.scale || (element.font && element.font.size) || 1;
                var width = element.width || (bitmap && bitmap.getWidth() * scale) || ((element.multiline) ? Math.max.apply(Math, __spreadArray([], __read(element.text.split('\n').map(function (v) { return v.length * scale; })), false)) : (element.text ? element.text.length : 0) * scale);
                var height = element.height || (bitmap && bitmap.getHeight() * scale) || 0;
                data.x += marginWidth + width;
                data.y += marginHeight + height;
                element.x = (element.x || 0) + data.x;
                element.y = (element.y || 0) + data.y;
                deleteGarbage(element);
            };
            for (var key in elementSet) {
                _loop_1(key);
            }
            return elementSet;
        }
        JSX.rebuildElementSet = rebuildElementSet;
        function getElementSetFrom(children, style) {
            var elementSet = {};
            for (var i in children) {
                var element = children[i];
                //parseElement();
                if (style != null) {
                    setDefaultsForElement(element, style);
                }
                Object.assign(elementSet, element);
            }
            return elementSet;
        }
        JSX.getElementSetFrom = getElementSetFrom;
        function setDefaultsForElement(element, style) {
            Object.assign(element, style, element);
        }
        JSX.setDefaultsForElement = setDefaultsForElement;
        function getElementSetWithDiv(properties, children) {
            var commonStyle = typeof properties.style != "object" ? parseStyleFromString(properties.style) : properties.style;
            var elements = {};
            for (var i in children) {
                if (i == "div") {
                    var style = getCommonStyle(commonStyle, children[i].style);
                    //Object.assign(elements, getElementSetFrom(chil))
                }
            }
            return elements;
        }
        JSX.getElementSetWithDiv = getElementSetWithDiv;
        function parseStyleFromString(style) {
            throw new java.lang.UnsupportedOperationException("Not implemented");
        }
        JSX.parseStyleFromString = parseStyleFromString;
        function Fragment(properties) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            return rebuildElementSet(getElementSetFrom(children));
        }
        JSX.Fragment = Fragment;
        function getStyleParamsFromDiv(properties) {
            if (properties.className != null) {
                return JSX.divClasses[properties.className];
            }
            if (typeof properties.style == "string") {
                return parseStyleFromString(properties.style);
            }
            return properties.style;
        }
        JSX.getStyleParamsFromDiv = getStyleParamsFromDiv;
    })(JSX = UI.JSX || (UI.JSX = {}));
})(UI || (UI = {}));
var window = (UI.JSX.parse("window", { x: "500", forceScrollY: true, onOpen: function (window) { return console.log("aboba"); } },
    UI.JSX.parse("elements", null,
        UI.JSX.parse("text", { name: "aboba", marginBottom: "25" }, "Hi world!"),
        UI.JSX.parse("text", { name: "aboba2", marginBottom: "10", text: "abobalolpicture", y: 50 }))));
var Component = function () {
    return UI.JSX.parse(UI.JSX.Fragment, null,
        UI.JSX.parse("text", { name: "debug" }, " howdy! "));
};
var gui = window;
console.log(JSON.stringify(gui) + "\n\n" + JSON.stringify(Component()));
//EXPORT("UI", UI);
