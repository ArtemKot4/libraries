/**
 * Class of effect hud.
 */
abstract class EffectHud {
    /**
     * Set of positions opened huds. Need to work animation of replace positions.
     */

    public static positions: Set<number> = new Set();

    /**
     * Common height of hud.
     */

    public height!: number;

    /**
     * Thread of hud. Use to improved operations.
     */

    public thread!: java.lang.Thread;

    /**
     * Current index of hud in {@link positions}.
     */

    public index!: number;

    /**
     * Lock state.
     */

    public lock: boolean = false;

    /**
     * UI of hud. Opening without {@link open} opens empty white ui.
     */

    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setTouchable(false);

        return window;
    })();

    /**
     * @param type effect type 
     */

    public constructor(public type: string) {};

    /**
     * Method, defines sleep time to thread.
     */

    public getThreadSleepTime(): number {
        return 50;
    }

    /**
     * Method, defines spacing between hud. Usings by formula: ({@link getLocation getLocation().y } + {@link getSpacing getSpacing()} * index).
     */

    public getSpacing(): number {
        return 50;
    }

    /**
     * Method, defines hud's location. "y" value uses to set positions to elements, but don't includes in result window content location "y" field. Method must be defined.
     */

    public abstract getLocation(): UI.WindowLocationParams;

    /**
     * Method, defines hud's elements. Must be defined.
     */

    public abstract getElements(): UI.ElementSet;

    /**
     * Method, defines hud's background color.
     * @default android.graphics.Color.TRANSPARENT
     */

    public getBackgroundColor(): number {
        return android.graphics.Color.TRANSPARENT;
    }

    /**
     * Method, builds and returns hud's window content by defined methods.
     */

    public getContent(): UI.WindowContent {
        const elements = this.getElements();
        const location = this.getLocation();

        if(!location) {
            throw new java.lang.RuntimeException(`Location of effect hud by type: "${this.type}" is not defined`);
        }

        if(!elements) {
            throw new java.lang.RuntimeException(`Elements of effect hud by type: "${this.type}" is not defined`);
        }

        location.y += this.getSpacing() * EffectHud.positions.size;

        const content: UI.WindowContent = {
            location: {
                ...location, y: 0
            },
            drawing: [
                {
                    type: "background",
                    color: this.getBackgroundColor()
                }
            ],
            elements: {}
        };

        for(const i in elements) {
            elements[i].y = location.y + (elements[i].y || 0);
        }

        content.elements = elements;
        return content;
    };

    /**
     * Method to get opened state of window.
     */

    public isOpened(): boolean {
        return this.UI.isOpened();
    }

    /**
     * Method, opens ui with builded content and increases {@link positions} size.
     */
    
    public open(): void {
        if(this.isOpened()) return;
        EffectHud.increaseCount();
        const content = this.getContent();
        
        this.index = EffectHud.positions.size;
        this.height = this.getLocation().y + this.getSpacing() * this.index;
        this.UI.setContent(content);
        this.UI.forceRefresh();
        this.UI.open();
        return;
    }

    /**
     * Method, closes ui and decreases {@link positions} size by delete {@link index} value.
     */

    public close(): void {
        this.lock = false;
        this.UI.close();
        EffectHud.decreaseCountBy(this.index);
    }

    /**
     * Method set scale of hud.
     * @param scale scale name
     * @param value value
     * @param max max value
     */

    public setScale(scale: string, value: number, max: number): void {
        this.UI.getElements().get(scale).setBinding("value", value / max);
        return;
    }

    /**
     * Method sets hud alpha to 0 and clears scale filling.
     */

    public clear(): void {
        this.setScale("scale", 0, 0);

        if(this.isOpened()) {
            this.UI.layout.setAlpha(0);
        }
    }

    /**
     * Method, defines condition to prevent init hud.
     * @param playerUid number
     * @returns condition
     */

    public preventInit(playerUid: number): boolean {
        return this.lock == true;
    }

    /**
     * Method, calls when initialization was prevented.
     * @param playerUid player unique identifier
     */

    public onPreventInit(playerUid: number): void {};

    /**
     * Method, calls when hud was initialized.
     * @param playerUid player unique identifier
     */

    public onInit?(playerUid: number): void;

    /**
     * Method, works when thread works.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onThread?(playerUid: number, effectData: IEffectData): void;

    /**
     * Method, calls when hud was appeared.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onAppear?(playerUid: number, effectData: IEffectData): void;

    /**
     * Method, calls when hud was disappeared.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onDisappear?(playerUid: number, effectData: IEffectData): void;

    /**
     * Method, calls when hud was closed.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onClose(playerUid: number, effectData: IEffectData): void {};

    /**
     * Method, calls when hud full.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onFull(playerUid: number, effectData: IEffectData): void {};

    /**
     * Method, inits hud.
     * @param playerUid player unique identifier
     */

    public init(playerUid: number): void {
        if(this.preventInit(playerUid)) {
            return this.onPreventInit(playerUid);
        }

        if("onInit" in this) {
            this.onInit(playerUid);
        }

        this.open();
        this.clear();
        this.thread = Threading.initThread("thread.effectbar.ui", () => this.run(playerUid));
    }

    /**
     * Method, sets height of hud elements.
     * @param height height
     */
    
    public setHeight(height: number): void {
        const contentElements = this.getElements();
        const uiElements = this.UI.getElements();
        for(const i in contentElements) {
            const element = uiElements.get(i);
            element.setPosition(element.x, height + (contentElements[i].y || 0));
        }
        return;
    }

    /**
     * Method, checks is valid height for hud with specified index.
     * @param index number
     * @returns condition
     */

    public isValidHeightFor(index: number): boolean {
        return this.height <= this.getLocation().y + (this.getSpacing() * index);
    }

    /**
     * Method, realizes animation of replace positions.
     * @param playerUid player unique identifier
     */

    public animate(playerUid: number): void {
        if(this.index > 1 && EffectHud.positions.has(this.index - 1) == false) {
            if(!this.isValidHeightFor(this.index - 1)) {//this.isValidHeightFor(this.index - 1) == false) {
                this.setHeight(this.height -= 2);
            } else {
                EffectHud.decreaseCountBy(this.index);
                this.index--;
                EffectHud.positions.add(this.index);
            }
        }
        return;
    }

    /**
     * Method, works in thread of hud.
     * @param playerUid player unique identifier
     */

    public run(playerUid: number): void {
        const threadSleepTime = this.getThreadSleepTime();
        while(true) {
            java.lang.Thread.sleep(threadSleepTime);

            if(!this.isOpened()) {
                continue;
            }

            const effectData = Effect.getFor(playerUid, this.type);

            this.animate(playerUid);
            this.setScale("scale", effectData.progress, effectData.progressMax);

            if("onThread" in this) {
                this.onThread(playerUid, effectData);
            }

            if(effectData.progress >= effectData.progressMax) {
                this.onFull(playerUid, effectData);
            }

            const alpha = this.UI.layout.getAlpha();
                
            if(effectData.timer > 0) {
                if(alpha < 1) {
                    if("onAppear" in this) {
                        this.onAppear(playerUid, effectData);
                    }
                    this.UI.layout.setAlpha(alpha + 0.05);
                }
            }

            if(effectData.timer <= 0 && effectData.progress <= 0) {
                if(alpha > 0) {
                    if("onDisappear" in this) {
                        this.onDisappear(playerUid, effectData);
                    }
                    this.UI.layout.setAlpha(alpha - 0.05);
                } else {
                    this.close();
                    this.onClose(playerUid, effectData);
                    return;
                }
            }
        }
        return;
    }

    /**
     * Method, increases {@link positions} size.
     */

    public static increaseCount(): void {
        EffectHud.positions.add(EffectHud.positions.size + 1);
    }

    /**
     * Method, decreases {@link positions} size with delete value by specified index.
     * @param index number
     */

    public static decreaseCountBy(index: number): void {
        EffectHud.positions.delete(index);
    }
}

Callback.addCallback("NativeGuiChanged", (screenName) => {
    for(const effectType in Effect.list) {
        const hud = Effect.get(effectType).hud;
        const effect = Effect.getFor(Player.getLocal(), effectType);
        if((screenName === "in_game_play_screen" || screenName === "death_screen") && (effect.lock == true && !hud.isOpened())) {
            hud.open();    
        } else {
            hud.close();
        }
    }
});