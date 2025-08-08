type IAdvancementParams = INotificationParams<{   
    /**
    * position of the window, influences on moving of animation.
    * @default "right"
    */
    position?: "left" | "right";
    /**
    * max count of notifications in one screen in one time when position and style equals.
    * @default 4;
    */
    maxCount?: number
}>;

class AdvancementNotification extends Notification<IAdvancementParams> {
    public maxOffset: number = 100;
    public mark: boolean = false;
    public offset: number = 0;
    public defaultOffsets: Record<string, number>;

    protected setDefaultOffsets(): void {
        this.defaultOffsets = {};

        for(const i in this.UI.content.elements) {
            const element = this.UI.content.elements[i];
            this.defaultOffsets[i] = element.x || 0;
        }
    }

    protected updateElementsOffset(offset: number): void {
        const elements = this.UI.getElements();

        for(const name in this.defaultOffsets) {
            elements.get(name).setPosition(offset + this.defaultOffsets[name], this.UI.content.elements[name].y);
        }
    }

    public override getSleepTime(): number {
        return 2;
    }

    protected override setContent(): void {
        //const style = this.getStyle(this.currentStyleName);
        const height = (this.currentStyle.window.height * this.currentStyle.window.scale) * this.currentStyle.window.maxCount;

        const elements = Notification.getStyledElementSet(this.currentStyle);
        // let count = 1;
        // for(let i = 0; i < this.queue.length; i++) {
        //     const element = this.queue[i];
        //     if(element != null) {
        //         element.runtimeStyle.window = element.runtimeStyle.window || {};
        //     }
        //     if(
        //         count >= this.currentStyle.window.maxCount || 
        //         typeof element != "object" ||
        //         element.styleName != this.currentStyleName || 
        //         element.runtimeStyle.window.position != null && element.runtimeStyle.window.position != this.currentStyle.window.position || 
        //         element.runtimeStyle.window.width != null && element.runtimeStyle.window.width != this.currentStyle.window.width || 
        //         element.runtimeStyle.window.height != null && element.runtimeStyle.window.height != this.currentStyle.window.height || 
        //         element.runtimeStyle.window.scale != null && element.runtimeStyle.window.scale != this.currentStyle.window.scale
        //     ) {
        //         break;
        //     }
        //     const elementSet = Notification.getStyledElementSet(
        //         this.getCommonStyle(style, element.runtimeStyle), 0, height * count, String(i)
        //     );
        //     Object.assign(elements, elementSet);
        //     this.queue.splice(i, 1);
        //     i--;
        //     count++;
        // }

        // for(const i in elements) {
        //     if("height" in elements[i]) {
        //         elements[i].height = Math.min(elements[i].height, height / count);
        //     }
        // }

        this.UI.setContent({
            location: {
                x: this.currentStyle.window.x + (this.currentStyle.window.position == "left" ? 0 : 1000 - this.currentStyle.window.width * this.currentStyle.window.scale),
                y: this.currentStyle.window.y,
                width: this.currentStyle.window.width * this.currentStyle.window.scale,
                height: height
            },
            drawing: [{
                type: "background",
                color: this.currentStyle.window.color
            }],
            elements: elements
        });
        this.UI.forceRefresh();
    }

    protected override preInit(style: IAdvancementParams, runtimeStyle: Partial<IAdvancementParams>): void {
        super.preInit(style, runtimeStyle);
        this.currentStyle.window.position = (runtimeStyle.window.position || style.window.position) || "right";
        this.currentStyle.window.maxCount = (runtimeStyle.window.maxCount || style.window.maxCount) || 4;
    }

    protected override postInit(): void {
        this.mark = false;
        this.maxOffset = this.currentStyle.window.width * this.currentStyle.window.scale;
        this.offset = this.currentStyle.window.position == "left" ? -this.maxOffset : this.maxOffset * 2; 
        this.work = this.currentStyle.window.position == "left" ? this.animationLeft : this.animationRight;

        this.setDefaultOffsets();
        this.updateElementsOffset(this.offset);
    }

    public animationLeft(): boolean {
        if(this.mark == false) {
            if(this.offset < 0) {
                this.updateElementsOffset(this.offset += 2);
            } else {
                this.mark = true;

                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.reach();
            }
        } else {
            if(this.offset > -this.maxOffset) {
                this.updateElementsOffset(this.offset -= 2);
            } else {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
                this.close();

                return true;
            }
        }
    }

    public animationRight(): boolean {
        if(this.mark == false) {
            if(this.offset > this.maxOffset) {
                this.updateElementsOffset(this.offset -= 2);
            } else {
                this.mark = true;

                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.reach();
            }
        } else {
            if(this.offset < this.maxOffset * 2) {
                this.updateElementsOffset(this.offset += 2);
            } else {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
                this.close();

                return true;
            }
        }
    }

    protected override work(): boolean {
        return false;
    }
}

Notification.register("advancement", new AdvancementNotification())