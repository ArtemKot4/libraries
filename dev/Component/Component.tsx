namespace UI {
    export declare namespace JSX {
        interface ClickerEvents {
            onclick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
            onlongclick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void
        }
        interface CustomEvents {
            onsetup?: (element: UICustomElement) => void,
            ondraw?: (element: UICustomElement, cvs: android.graphics.Canvas, scale: number) => void,
            ontouchreleased?: (element: UICustomElement) => void,
            onbindingupdated?: <T>(element: UICustomElement, name: string, val: T) => void,
            onreset?: (element: UICustomElement) => void,
            onrelease?: (element: UICustomElement) => void,
            oncontainerinit?: (element: UICustomElement, container: UI.Container, elementName: string) => void
        }
        type Element = (UI.Elements | (UI.UICustomElement & CustomEvents)) & ClickerEvents & { key?: string };
        export type Node = string[];
        export type properties = Nullable<JSX.Element>;
        export type Component = (properties: properties, ...children: Node) => Node;
        export type Tag = Component | string;
    }

    export class PropertiesError extends Error {
        public constructor(message: string) {
            super(message);
            this.name = "JSX.PropertiesError";
        }
    }

    export function parseElement(tag: JSX.Tag, properties: JSX.properties, ...children: JSX.Node): UI.Element {
        if(typeof tag == "function") {
            return tag({ ...properties }, ...children);
        }
        if(!properties) {
            throw new PropertiesError(`Params of element "${children}" can't be empty`);
        }
        properties.clicker = {};

        if("onclick" in properties) {
            properties.clicker.onClick = properties.onclick;
        }
        if("onlongclick" in properties) {
            properties.clicker.onLongClick = properties.onlongclick;
        }
        if(properties.type == "text") {
            properties.text = children.toString();
        }
        if(properties.type == "image") {
            properties.bitmap = children.toString().trim();
        }
        if(properties.type == "custom") {
            if("onbindingupdated" in properties) {
                properties.custom.onBindingUpdated = properties.onbindingupdated;
            }
            if("oncontainerinit" in properties) {
                properties.custom.onContainerInit = properties.oncontainerinit;
            }
            if("ondraw" in properties) {
                properties.custom.onDraw = properties.ondraw;
            }
            if("onrelease" in properties) {}
        }
        if(tag == "element" && !("key" in properties)) {
            return properties;
        } 
        return {
            [properties.key || tag]: properties
        }
    }

    export function Fragment(properties: JSX.properties, ...children: JSX.Node): UI.ElementSet {
        const elementSet = {};

        for(const i in children) {
            Object.assign(elementSet, children[i]);
        }
        return elementSet;
    }
}