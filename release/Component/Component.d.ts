declare namespace UI {
    namespace JSX {
        interface ClickerEvents {
            onclick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
            onlongclick?: (position: Vector, container: UI.Container | ItemContainer, tileEntity: Nullable<TileEntity> | any, window: UI.IWindow, canvas: android.graphics.Canvas, scale: number) => void;
        }
        interface CustomEvents {
            onsetup?: (element: UICustomElement) => void;
            ondraw?: (element: UICustomElement, cvs: android.graphics.Canvas, scale: number) => void;
            ontouchreleased?: (element: UICustomElement) => void;
            onbindingupdated?: <T>(element: UICustomElement, name: string, val: T) => void;
            onreset?: (element: UICustomElement) => void;
            onrelease?: (element: UICustomElement) => void;
            oncontainerinit?: (element: UICustomElement, container: UI.Container, elementName: string) => void;
        }
        type Element = (UI.Elements | (UI.UICustomElement & CustomEvents)) & ClickerEvents & {
            key?: string;
        };
        type Node = string[];
        type properties = Nullable<JSX.Element>;
        type Component = (properties: properties, ...children: Node) => Node;
        type Tag = Component | string;
    }
    class PropertiesError extends Error {
        constructor(message: string);
    }
    function parseElement(tag: JSX.Tag, properties: JSX.properties, ...children: JSX.Node): UI.Element;
    function Fragment(properties: JSX.properties, ...children: JSX.Node): UI.ElementSet;
}
