/**
 * Thank you for downloading this lib!
 * Author: ArtemKot
 * Year: 2025
 */
namespace UI {
    /**
     * Namespace to manipulate your jsx, tsx and provide it to function calls.
     */
    export namespace JSX {
        interface ClickerEvents {
            onClick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
            onLongClick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void
        }
        interface CustomEvents {
            onSetup?: (element: UICustomElement) => void,
            onDraw?: (element: UICustomElement, cvs: android.graphics.Canvas, scale: number) => void,
            onTouchReleased?: (element: UICustomElement) => void,
            onBindingUpdated?: <T>(element: UICustomElement, name: string, val: T) => void,
            onReset?: (element: UICustomElement) => void,
            onRelease?: (element: UICustomElement) => void,
            onContainerInit?: (element: UICustomElement, container: UI.Container, elementName: string) => void
        }
        type Element = (UI.Elements | (UI.UICustomElement & CustomEvents)) & ClickerEvents & 
        { 
            key?: string;
            marginTop?: number;
            marginBottom?: number;
            marginLeft?: number;
            marginRight?: number
            id?: number
        }

        export type Node = (Element | Record<string, Element>)[];
        export type Properties = Nullable<Element>;
        export type Component = (properties: Properties, ...children: Node) => Node;
        export type Tag = Component | string;

        export class PropertiesError extends Error {
            public constructor(message: string) {
                super(message);
                this.name = "PropertiesError";
            }
        }
    
        export function parseElement(tag: Tag, properties: Properties, ...children: Node): UI.Element {
            if(typeof tag == "function") {
                return tag({ ...properties }, ...children);
            }
            if(!properties) {
                properties = {} as Elements;
                //if your component's must contain any properties, delete comment below.
                //throw new PropertiesError(`Params of element "${children}" can't be empty`);
            }
            properties.clicker = {};
    
            if("onClick" in properties) {
                properties.clicker.onClick = properties.onClick;
            }
            if("onLongClick" in properties) {
                properties.clicker.onLongClick = properties.onLongClick;
            }
            if(properties.type == "text") {
                properties.text = children.toString();
            }
            if(properties.type == "image") {
                properties.bitmap = children.toString().trim();
            }
            if(properties.type == "custom") {
                if("onBindingUpdated" in properties) {
                    properties.custom.onBindingUpdated = properties.onBindingUpdated;
                }
                if("onContainerInit" in properties) {
                    properties.custom.onContainerInit = properties.onContainerInit;
                }
                if("onDraw" in properties) {
                    properties.custom.onDraw = properties.onDraw;
                }
                if("onRelease" in properties) {
                    properties.custom.onRelease = properties.onRelease;
                }
                if("onReset" in properties) {
                    properties.custom.onReset = properties.onReset;
                }
                if("onSetup" in properties) {
                    properties.custom.onSetup = properties.onSetup;
                }
                if("onTouchReleased" in properties) {
                    properties.custom.onTouchReleased = properties.onTouchReleased;
                }
            }
            if(tag == "element" && !("key" in properties)) {
                return properties;
            } 
            return {
                [properties.key || tag]: properties
            }
        }
    
        export function deleteGarbage(element: Element): void {
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

        /**
         * Method to rebuild your elementSet using params defined earlier in xml.
         * @param elementSet element set for window
         * @returns UI.ElementSet
         */
    
        export function rebuildElementSet(elementSet: Record<string, Element> | UI.ElementSet): UI.ElementSet {
            let dataID: Record<string, { x: number, y: number }> = {
                default: {
                    x: 0,
                    y: 0
                }
            }
            for(const i in elementSet) {
                if(typeof elementSet[i] != "object") {
                    continue;
                }
                const element = elementSet[i] as Element;
                const data = element.id ? dataID[element.id] = dataID[element.id] || { x: 0, y: 0 } : dataID["default"];
                
                const bitmap = TextureSource.getNullable(String(element.bitmap));
                const width = element.width || bitmap && bitmap.getWidth() * element.scale() || 50;
                const height = element.height || bitmap && bitmap.getHeight() * element.scale() || 50;

                element.x = element.x || data.x;
                element.y = element.y || data.y;

                data.x = element.x + width + (element.marginRight || 0);
                data.y = element.y + height + (element.marginBottom || 0);
                deleteGarbage(element);
            }
            return elementSet;
        }
    
        export function Fragment(properties: Properties, ...children: Node): UI.ElementSet {
            const elementSet: UI.ElementSet = {};
    
            for(const i in children) {
                const element = children[i];
                Object.assign(elementSet, element);
            }
            
            return rebuildElementSet(elementSet);
        }
    }
}