interface INotificationElementInitEvent {
    preInit?(element: NotificationElement, style: INotificationParams): void;
    postInit?(element: NotificationElement, style: INotificationParams): void;
}

type NotificationElement = (
    UI.UICustomElement | 
    UI.UIButtonElement | 
    UI.UICloseButtonElement | 
    UI.UIFrameElement | 
    UI.UIImageElement & {
        /**
         * if defined, element will become slot, and scale from element will become iconScale.
         */ 
        item?: string | number
    } | 
    UI.UIScaleElement | 
    UI.UIScrollElement | 
    UI.UISlotElement | 
    UI.UISwitchElement | 
    UI.UITabElement | 
    UI.UITextElement & {
        /**
         * Max size of line. If text bigger, element will become multiline and `\n` will be placed each specified number.
         * @default 25
        */ 
        lineSize?: number 
    } | 
    UI.UIFPSTextElement | 
    UI.UIInvSlotElement
) & INotificationElementInitEvent;
