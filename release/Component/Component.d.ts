/**
 * Thank you for downloading this lib!
 * Author: ArtemKot
 * Year: 2025
 */
declare namespace UI {
    /**
     * Namespace to manipulate your jsx, tsx and provide it to function calls.
     */
    namespace JSX {
        interface ClickerEvents {
            onClick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
            onLongClick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
        }
        interface CustomEvents {
            onSetup?: (element: UICustomElement) => void;
            onDraw?: (element: UICustomElement, cvs: android.graphics.Canvas, scale: number) => void;
            onTouchReleased?: (element: UICustomElement) => void;
            onBindingUpdated?: <T>(element: UICustomElement, name: string, val: T) => void;
            onReset?: (element: UICustomElement) => void;
            onRelease?: (element: UICustomElement) => void;
            onContainerInit?: (element: UICustomElement, container: UI.Container, elementName: string) => void;
        }
        type Element = (UI.Elements | (UI.UICustomElement & CustomEvents)) & ClickerEvents & {
            key?: string;
            marginTop?: number;
            marginBottom?: number;
            marginLeft?: number;
            marginRight?: number;
            id?: number;
        };
        export type Node = (Element | Record<string, Element>)[];
        export type Properties = Nullable<Element>;
        export type Component = (properties: Properties, ...children: Node) => Node;
        export type Tag = Component | string;
        export class PropertiesError extends Error {
            constructor(message: string);
        }
        export function parseElement(tag: Tag, properties: Properties, ...children: Node): UI.Element;
        export function deleteGarbage(element: Element): void;
        /**
         * Method to rebuild your elementSet using params defined earlier in xml.
         * @param elementSet element set for window
         * @returns UI.ElementSet
         */
        export function rebuildElementSet(elementSet: Record<string, Element> | UI.ElementSet): UI.ElementSet;
        export function Fragment(properties: Properties, ...children: Node): UI.ElementSet;
        export {};
    }
}
