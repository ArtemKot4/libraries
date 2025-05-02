abstract class EffectHud {
    public static positions: Set<number> = new Set();

    public height!: number;
    public thread!: java.lang.Thread;
    public index!: number;
    public lock: boolean = false;

    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setAsGameOverlay(true);
        window.setTouchable(false);

        return window;
    })();

    public constructor(
        public type: string
    ) {}

    public getThreadSleepTime(): number {
        return 50;
    }

    public getSpacing(): number {
        return 50;
    }

    public getLocation(): UI.WindowLocationParams {
        return {};
    }

    public getElements(): UI.ElementSet {
        return {};
    }

    public getBackgroundColor(): number {
        return android.graphics.Color.TRANSPARENT;
    }

    public getContent(): UI.WindowContent {
        const elements = this.getElements();
        const location = this.getLocation();
        location.y += this.getSpacing() * EffectHud.positions.size;

        const content: UI.WindowContent = {
            location: {
                x: location.x
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

    public isOpened(): boolean {
        return this.UI.isOpened();
    }
    
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

    public close(): void {
        this.lock = false;
        this.UI.close();
        EffectHud.decreaseCountBy(this.index);
    }

    public setScale(scale: string, value: number, max: number): void {
        this.UI.getElements().get(scale).setBinding("value", value / max);
        return;
    }

    public clear(): void {
        this.setScale("scale", 0, 0);

        if(this.isOpened()) {
            this.UI.layout.setAlpha(0);
        }
    }

    public preventInit(playerUid: number): boolean {
        return this.lock == true;
    }

    public onPreventInit(playerUid: number): void {};
    public onInit?(playerUid: number): void;
    public onThread?(playerUid: number, effectData: IEffectData): void;
    public onAppear?(playerUid: number, effectData: IEffectData): void;
    public onDisappear?(playerUid: number, effectData: IEffectData): void;
    public onClose(playerUid: number, effectData: IEffectData): void {};
    public onFull(playerUid: number, effectData: IEffectData): void {};

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

    public setHeight(height: number): void {
        const contentElements = this.getElements();
        const uiElements = this.UI.getElements();
        for(const i in contentElements) {
            const element = uiElements.get(i);
            element.setPosition(element.x, height + (contentElements[i].y || 0));
        }
        return;
    }

    public isValidHeightFor(index: number): boolean {
        return this.height <= this.getLocation().y + (this.getSpacing() * index);
    }

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

    public static increaseCount(): void {
        EffectHud.positions.add(EffectHud.positions.size + 1);
    }

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
        };
    };
});