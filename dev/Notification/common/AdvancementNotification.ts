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
        this.UI.setContent({
            location: Notification.getStyledLocation(
                this.currentStyle, 
                this.currentStyle.window.position == "left" ? 0 : 1000 - this.currentStyle.window.width * this.currentStyle.window.scale
            ),
            drawing: [{
                type: "background",
                color: this.currentStyle.window.color
            }],
            elements: Notification.getStyledElementSet(this.currentStyle)
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

        this.updateElementsOffset(this.offset);
        this.setDefaultOffsets();
        this.work = this.currentStyle.window.position == "left" ? this.moveLeft : this.moveRight;
    }

    public moveLeft(): boolean {
        if(!this.mark) {
            if(this.offset < 0) {
                this.updateElementsOffset(this.offset += 2);
            } else {
                this.mark = true;

                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.onReach();
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

    public moveRight(): boolean {
        if(!this.mark) {
            if(this.offset > this.maxOffset) {
                this.updateElementsOffset(this.offset -= 2);
            } else {
                this.mark = true;

                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.onReach();
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

Notification.register("advancement", new AdvancementNotification());
// .addStyle("transparent", {
//     thread: {  
//         reachTime: 2000,
//         queueTime: 1000
//     },
//     window: {
//         width: 240 * 2,
//         height: 40 * 2
//     },
//     elements: {
//         background: {
//             type: "image",
//             x: 0,
//             y: 0,
//             width: 240 * 2,
//             height: 40 * 2,
//             bitmap: "notification"
//         },
//         text: {
//             type: "text",
//             x: 50,
//             y: 9,
//             lineSize: 30,
//             font: {
//                 color: android.graphics.Color.WHITE,
//                 size: 25
//             }
//         },
//         icon: {
//             type: "image",
//             x: 100,
//             y: 5,
//             scale: 1.8,
//             size: 90,
//             width: 27,
//             height: 27
//         }
//     }
// });

// Callback.addCallback("ItemUse", (c, i, b, isE, p) => {
//     if(i.id == VanillaItemID.diamond) {
//         Notification.get("achievement").init("transparent", {
//             elements: {
//                 text: {
//                     type: "text",
//                     text: "2222"
//                 },
//                 icon: {
//                     type: "image",
//                     item: 263
//                 }
//             }
//         })
//     } else if (i.id == VanillaItemID.emerald) {
//         Notification.get<AdvancementNotification>("advancement").init("transparent", {
//             window: {
//                 position: Entity.getSneaking(p) == true ? "left" : "right"
//             },
//             elements: {
//                 text: {
//                     type: "text",
//                     text: String(Math.floor(Math.random()*20)-1)
//                 },
//                 icon: {
//                     type: "image",
//                     item: 263
//                 }
//             }
//         })
//     }
// });
