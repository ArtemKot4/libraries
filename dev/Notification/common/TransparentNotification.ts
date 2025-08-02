class TransparentNotification extends Notification {
    public mark: boolean = false;

    public setAlpha(value: number): void {
        this.UI.layout.setAlpha(value);
    }

    protected override postInit(): void {
        this.mark = false;
        this.UI.layout.setAlpha(0);
    }

    protected override work(): boolean {
        const alpha = this.UI.layout.getAlpha();
        if(alpha < 1 && !this.mark) {
            this.setAlpha(alpha + 0.01);
        } else {
            if(!this.mark) {
                this.mark = true;
            
                java.lang.Thread.sleep(this.currentStyle.thread.reachTime);
                this.onReach();
            }
        }
        if(this.mark) {
            this.setAlpha(alpha - 0.01);
            if(alpha <= 0) {
                java.lang.Thread.sleep(this.currentStyle.thread.queueTime);
                this.close();

                return true;
            }
        }
    } 
}

Notification.register("transparent", new TransparentNotification())
.addStyle("transparent", NotificationStyles.TRANSPARENT);