class AchievementNotification extends Notification {
    public maxHeight: number = 100;
    public mark: boolean = false;
    public height: number = 0;
    public defaultHeights: Record<string, number>;

    protected updateElementsHeight(height: number): void {
        const elements = this.UI.getElements();

        for(const name in this.defaultHeights) {
            elements.get(name).setPosition(this.UI.content.elements[name].x, height + this.defaultHeights[name]);
        }
    }

    protected setDefaultHeights(): void {
        this.defaultHeights = {};

        for(const i in this.UI.content.elements) {
            const element = this.UI.content.elements[i];
            this.defaultHeights[i] = element.y || 0;
        }
    }

    protected override postInit(): void {
        this.maxHeight = this.currentStyle.window.height * this.currentStyle.window.scale;
        this.height = -this.maxHeight;
        this.mark = false;

        this.setDefaultHeights();
        this.updateElementsHeight(this.height);
    }

    protected override work(): boolean {
        if(!this.mark) {
            if(this.height < 0) {
                this.updateElementsHeight(this.height++);
            } else {
                this.mark = true;
                
                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.onReach();
            }
        } else {
            if(this.height > -this.maxHeight) {
                this.updateElementsHeight(this.height--);
            } else {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
                this.close();

                return true;
            }
        }
    }
}

Notification.register("achievement", new AchievementNotification())
.addStyle("transparent", NotificationStyles.TRANSPARENT);