class AchievementNotification extends Notification {
    public maxHeight: number = 100;
    public mark: boolean = false;
    public height: number = 0;
    public defaults: {};

    protected updateElementsHeight(value: number): void {
        const elements = this.UI.getElements();

        for(const name in this.defaults) {
            elements.get(name).setPosition(this.defaults[name].x, value + this.defaults[name].y);
        }
    }

    protected override onInit(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, description: INotificationWindowData): void {
        this.maxHeight = style.height * style.scale;
        this.height = -this.maxHeight;
        this.mark = false;
        this.defaults = {};

        for(const i in description.content.elements) {
            const element = description.content.elements[i];
            this.defaults[i] = {
                x: element.x || 0,
                y: element.y || 0
            }
        }
    }

    protected override work(style: INotificationStyle, runtimeStyle: INotificationRuntimeParams, data: INotificationWindowData): boolean {
        if(!this.mark) {
            if(this.height < 0) {
                this.updateElementsHeight(this.height += 1);
            } else {
                java.lang.Thread.sleep(data.waitTime);
                this.mark = true;
            }
        } else {
            if(this.height > -this.maxHeight) {
                this.updateElementsHeight(this.height -= 1);
            } else {
                java.lang.Thread.sleep(style.queueTime);
                this.close();

                return true;
            }
        }
    }
}

Notification.register("achievement", new AchievementNotification())
.addStyle("transparent", NotificationStyles.TRANSPARENT);