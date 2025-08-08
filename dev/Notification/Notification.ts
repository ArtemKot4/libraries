/**
 * Class to create custom notification animations, be like as minecraft achievement animation.
 */

abstract class Notification<T extends INotificationParams = INotificationParams> {

    /**
     * List of all notifications with special unique type. 
     */

    public static list: Record<string, Notification> = {};

    /**
     * Type of animation. Must be unique 
     */

    public type: string;

    /**
     * List of styles 
     */

    protected styles: Record<string, T> = {};

    /**
     * Queue, from this field takes values to restart animation after previous. 
     */

    protected queue: INotificationInputData<T>[] = [];

    /**
     * Lock value, influences on init. 
     */

    protected lock: boolean = false;

    /**
     * Stop value, influences on work of animation. 
     */

    protected stop: boolean = false;

    /**
     * Thread special for notification. 
     */

    public thread: java.lang.Thread;

    /**
     * Current name of style from last start.
     */

    public currentStyleName!: string;

    /**
     * Current style, which usings in current notification from last start. 
     */
    
    public currentStyle: T;

    /**
     * User interface, using in animation. 
     */

    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setDynamic(true);
        return window;
    })();

    public constructor(type?: string) {
        if(type != null) {
            this.type = type;
        }  
    }

    /**
     * Method to add client packet, which can init animation for client from server request.
     */

    public buildPacket() {
        Network.addClientPacket(`packet.notification.send_${this.type}_notification`, (data: INotificationInputData<T>) => {
            return this.init(data.styleName, data.runtimeStyle);
        });
    }

    /**
     * Method to register new style for notification.
     * @param name name of your style
     * @param style style description
     */

    public addStyle(name: string, style: T): this {
        style.thread = style.thread || {};
        style.elements = style.elements || {};
        this.styles[name] = style;
        return this;
    }   

    /**
     * Method to disable thread if stop state is true.
     * @param stop state
     */

    public setStop(stop: boolean): this {
        this.stop = stop;
        return this;
    }

    /**
     * Method clears queue.
     */

    public clearQueue(): void {
        this.queue = [];
    }

    /**
     * Changes lock state.
     * @param lock lock state
     */

    public setLock(lock: boolean): this {
        this.lock = lock;
        return this;
    }

    /**
     * Default value of UI color.
     */

    public getColor(): number {
        return android.graphics.Color.TRANSPARENT;
    }

    /**
     * Default value of x.
     */

    public getLocationX(): number {
        return 0;
    }

    /**
     * Default value of y.
     */

    public getLocationY(): number {
        return 0;
    }

    /**
     * Default value of width.
     */

    public getWidth(): number {
        return 200;
    }

    /**
     * Default value of height.
     */

    public getHeight(): number {
        return 100;
    }

    /**
     * Default value of scale.
     * @default 1
     */

    public getScale(): number {
        return 1;
    }

    /**
     * Time which using to sleep thread every cycle. Influences on speed of animation.
     */

    public getSleepTime(): number {
        return 3;
    }

    /**
     * Time between restart animation with new data.
     */

    public getQueueTime(): number {
        return 1000;
    }

    /**
     * Time to sleep in reach state.
     */

    public getReachTime(): number {
        return 2000;
    }

    /**
     * @returns ui is touchable or not (if not, button clicks will not work). 
     */

    public isTouchable(): boolean {
        return true;
    }

    /**
     * @returns ui is game overlay or not.
     */

    public isGameOverlay(): boolean {
        return true;
    }

    /**
     * Condition to prevent init animation.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     * @returns 
     */

    public preventInit(styleName: string, runtimeStyle: Partial<T>): boolean {
        return this.lock == true || screenName != "in_game_play_screen";
    }

    /**
     * Method, works when animation was prevented.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */

    protected onPreventInit(styleName: string, runtimeStyle: Partial<T>): void {
        this.queue.push({ styleName, runtimeStyle });
    }

    /**
     * Method to get style.  
     * Throws `java.lang.NoSuchFieldException` if style is not exists.
     * @param styleName name of style
     * @returns Notification style
     */

    public getStyle(styleName: string): T {
        if(!(styleName in this.styles)) {
            throw new java.lang.NoSuchFieldException(`Notification error: style ${styleName} is not exists`);
        }

        return this.styles[styleName];
    }

    /**
     * Method to set content of window
     */

    protected setContent(): void {
        this.UI.setContent(
            {
            location: Notification.getStyledLocation(this.currentStyle),
            drawing: [{
                type: "background",
                color: this.currentStyle.window.color
            }],
            elements: Notification.getStyledElementSet(this.currentStyle)
        });
        this.UI.forceRefresh();
    }

    /**
     * Method to open notification with specified style name and runtime data.
     * @param styleName name of your style in {@link styles}
     * @param runtimeStyle your runtime data. It can be text or image
     */

    public init(styleName: string, runtimeStyle: Partial<T>): void {
        if(this.preventInit(styleName, runtimeStyle)) {
            return this.onPreventInit(styleName, runtimeStyle);
        }
        this.currentStyleName = styleName;

        const style = this.getStyle(styleName);
        this.currentStyle = { 
            thread: {},
            window: {},
            elements: {} 
        } as T;
        this.preInit(style, runtimeStyle);
        
        this.UI.setAsGameOverlay(this.currentStyle.window.overlay);
        this.UI.setTouchable(this.currentStyle.window.touchable);
        this.UI.updateWindowLocation();

        if(!this.UI.isOpened()) {
            this.UI.open();
        }

        this.setLock(true);
        this.setContent();
        this.postInit();

        this.thread = Threading.initThread(`thread.ui.notification.${this.type}`, () => this.run());  
        return;
    }

    /**
     * Method to init thread, contains logic of change notifications. 
     */

    protected run(): void {
        while(this.stop == false) {
            java.lang.Thread.sleep(this.currentStyle.thread.sleepTime);

            const done = this.work();
            if(done == true) {
                this.setLock(false)
                this.initLast();
                break;
            }
        }
    }

    /**
     * Method {@link init inits} and deletes last notification from queue.
     * @returns true if notification was inited
     */

    public initLast(): boolean {
        if(this.queue.length > 0 && screenName == "in_game_play_screen") {
            const data = this.queue.shift();
            this.init(data.styleName, data.runtimeStyle);

            return true;
        }
        return false;
    }

    /**
     * Method to get common style from basic style and runtime data.
     * @param style your style
     * @param runtimeStyle your runtime data
     */

    protected getCommonStyle(style: T, runtimeStyle: Partial<T>): T {
        runtimeStyle.thread = runtimeStyle.thread || {};
        runtimeStyle.window = runtimeStyle.window || {};

        const commonStyle = {
            thread: {},
            window: {},
            elements: {},
            events: {}
        } as T;
        commonStyle.thread.sleepTime = (runtimeStyle.thread.sleepTime || style.thread.sleepTime) || this.getSleepTime();
        commonStyle.thread.reachTime = (runtimeStyle.thread.reachTime || style.thread.reachTime) || this.getReachTime();
        commonStyle.thread.queueTime = (runtimeStyle.thread.queueTime || style.thread.queueTime) || this.getQueueTime();
        commonStyle.window.color = (runtimeStyle.window.color || style.window.color) || this.getColor();
        commonStyle.window.height = (runtimeStyle.window.height || style.window.height) || this.getHeight();
        commonStyle.window.width = (runtimeStyle.window.width || style.window.width) || this.getWidth();
        commonStyle.window.scale = (runtimeStyle.window.scale || style.window.scale) || this.getScale();
        commonStyle.window.x = (runtimeStyle.window.x || style.window.x) || this.getLocationX();
        commonStyle.window.y = (runtimeStyle.window.y || style.window.y) || this.getLocationY();
        commonStyle.window.overlay = (runtimeStyle.window.overlay || style.window.overlay) || this.isGameOverlay();
        commonStyle.window.touchable = (runtimeStyle.window.touchable || style.window.touchable) || this.isTouchable();
        
        for(const elementName in style.elements) {
            commonStyle.elements[elementName] = Object.assign({}, 
                style.elements[elementName], 
                runtimeStyle.elements[elementName] || {}
            );
        }
        return commonStyle;
    }

    /**
     * Method, works before opening ui.
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */

    protected preInit(style: T, runtimeStyle: Partial<T>): void {
        this.currentStyle = this.getCommonStyle(style, runtimeStyle);
    }

    /**
     * Method, calls after opening ui. It can be used to set default values.
     */

    protected postInit(): void {};

    /**
     * Method, where your thread do work. Return true to reload thread with last element from queue.
     */

    protected abstract work(): boolean;

    /**
     * Method to send client from server notification with specified style name and runtime data.
     * @param styleName name of your style in {@link Notification.styles}
     * @param runtimeStyle your runtime data
     */

    public sendFor(playerUid: number, styleName: string, runtimeStyle: Partial<INotificationParams>): void {
        const client = Network.getClientForPlayer(playerUid);

        if(client) {
            client.send(`packet.notification.send_${this.type}_notification`, { styleName: styleName, runtimeStyle: runtimeStyle });
        }
    }

    /**
     * Method, calls with using close function.
     */

    protected onClose() {};

    /**
     * Method to close ui and call close events.
     */

    public close(): void {
        if("onClose" in this.currentStyle.events) {
            this.currentStyle.events.onClose(this);
        }
        this.onClose();
        this.UI.close();
        return;
    }

    /**
     * Method to call reach events.
     *  
     */

    public reach(): void {
        if("onReach" in this.currentStyle.events) {
            this.currentStyle.events.onReach(this);
        }
        this.onReach();
        return;
    }

    /**
     * Method works when elements reaches need position.
     */
    
    protected onReach(): void {};

    /**
     * Method to get styled location
     * @param style style
     * @param x addition x value concating with main, optional
     * @param y addition y value concating with main, optional
     */

    protected static getStyledLocation<T extends INotificationParams>(style: T, x?: number, y?: number): UI.WindowLocationParams {
        return {
            x: (x || 0) + style.window.x,
            y: (y || 0) + style.window.y,
            width: style.window.width * style.window.scale,
            height: style.window.height * style.window.scale
        };
    }

    /**
     * Method to get element set from your style
     * @param x addition x value concats to main, optional 
     * @param y addition y value concats to main, optional
     * @param keyword word, adds to default key name, optional. If defined, after keyword `"_"` will be added
     * @returns default `UI.ElementSet`
     */

    protected static getStyledElementSet<T extends INotificationParams>(style: T, x?: number, y?: number, keyword?: string): UI.ElementSet {
        const elements: Record<string, NotificationElement> = {};

        for(const elementName in style.elements) {
            const description: NotificationElement = style.elements[elementName];
            const element: NotificationElement = { ...description,
                x: (x || 0) + description.x,
                y: (y || 0) + description.y
            };

            if("preInit" in element) {
                element.preInit(element, style);
            }

            if("text" in description) {
                const maxLineLength = description.lineSize || 25;
                const text = separateText(
                    Translation.translate(description.text), 
                    maxLineLength
                );
                element.text = text;
                if(text.length > maxLineLength) {
                    element.multiline = true;
                }
            }

            if(description.item != null) {
                element.type = "slot";
                element.bitmap = "INotificationParams";
                element.source = { 
                    id: typeof description.item == "string" ? 
                    (
                        ItemID[description.item] || 
                        VanillaItemID[description.item] || 
                        BlockID[description.item] || 
                        VanillaBlockID[description.item]
                    ) : description.item, 
                    count: 1, 
                    data: 0 
                }
                element.iconScale = description.scale || 1;
            }

            if("postInit" in element) {
                element.postInit(element, style);
            }

            elements[(keyword != null ? keyword + "_" : "") + elementName] = element;
        }
        return elements;
    }

    /**
     * Method to learn, exists type of notification or not.
     */

    public static has(type: string): boolean {
        return type in this.list;
    }

    /**
     * Method to get specified Notification by type. {@link AchievementNotification} for example can be got with Notification.{@link get}("achievement").   
     * Throws `java.lang.NoSuchFieldException` if notification is not exists.
     * @param type type of the notification
     */

    public static get<T extends Notification>(type: string): T {
        if(!Notification.has(type)) {
            throw new java.lang.NoSuchFieldException(`Notification: type "${type}" of notification is not exists`);
        }
        return this.list[type] as T;
    }

    /**
     * Method to register new notification with special type.  
     * Throws `java.lang.SecurityException` if notification exists.
     * @param type keyword to register notification
     * @param notification object of notification
     */

    public static register(type: string, notification: Notification): Notification {
        if(Notification.has(type)) {
            throw new java.lang.SecurityException("Notification: notification is already registered");
        }

        if(notification.type == null) {
            notification.type = type;
            notification.buildPacket();
        }

        return Notification.list[type] = notification;
    }

    /**
     * Method to learn is active type or not now.
     */

    public static isActive(type: string): boolean {
        return Notification.get(type).lock;
    }

    /**
     * Method to get active types. 
     * @returns active types of notifications
     */

    public static getActiveTypes(): string[] {
        const types = [];
        for(const i in Notification.list) {
            if(Notification.list[i].lock == true) {
                types.push(Notification.list[i]);
            }
        }
        return types;
    }

    /**
     * Method to init notification with special type.
     * @param type type of notification
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */

    public static init(type: string, styleName: string, runtimeStyle: Partial<INotificationParams>): void {
        return Notification.get(type).init(styleName, runtimeStyle);
    }

    /**
     * Method to send client from server notification with specified style name and runtime data.  
     * Throws `java.lang.NoSuchFieldException` if notification is not exists.
     * @param playerUid unique player identifier
     * @param type type of notification
     * @param styleName name of style
     * @param runtimeStyle notification runtime params from init
     */

    public static sendFor(playerUid: number, type: string, styleName: string, runtimeStyle: Partial<INotificationParams>): void {
        if(!Notification.has(type)) {
            throw new java.lang.NoSuchFieldException(`Notification: type "${type}" of notification is not exists`)
        }
        const client = Network.getClientForPlayer(playerUid);

        if(client != null) {
            return client.send(`packet.notification.send_${type}_notification`, { styleName: styleName, runtimeStyle: runtimeStyle });
        }
    }
}

Callback.addCallback("LocalLevelLeft", () => {
    for(const i in Notification.list) {
        const notification = Notification.list[i];

        notification.clearQueue();
        notification.setStop(true);
        notification.UI.close();
    }
});

Callback.addCallback("NativeGuiChanged", (name, lastName, isPushEvent) => {
    screenName = name;

    if(name == "in_game_play_screen") {
        for(const i in Notification.list) {
            const notification = Notification.list[i];
            notification.initLast();
        }
    }
});

namespace NotificationStyles {
    export const TRANSPARENT: INotificationParams = {
        thread: {
            reachTime: 2000,
            queueTime: 1000
        },
        window: {
            scale: 2.3,
            width: 180,
            height: 20
        },
        elements: {
            text: {
                type: "text",
                x: 48,
                y: 15,
                font: {
                    color: android.graphics.Color.WHITE
                },
                lineSize: 30
            },
            icon: {
                type: "image",
                x: 8,
                y: 10
            }
        }
    };
}