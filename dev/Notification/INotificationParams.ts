interface INotificationParams<window = {}, thread = {}, events = {}> extends INotificationTimerParams<thread> {
    /**
     * Values to describe window.
     */
    window: {
        /**
         * scale of all elements.
         */
        scale?: number,
        /**
         * width of window in units.
         */
        width?: number,
        /**
         * height of window in units.
         */
        height?: number,
        /**
         * x position of window.
         */
        x?: number,
        /**
         * y position of window.
         */
        y?: number
        /**
         * color of window in red green blue alpha.
         */
        color?: number;
        /**
         * if true, window will be game overlay (can you hear sounds).
         */
        overlay?: boolean;
        /**
         * if true, window will be touchable (you can touch window with specified element events).
         */
        touchable?: boolean;
    } & window;
    /**
     * Events
     */
    events?: {
        onReach?(notification: Notification): void;
        onClose?(notification: Notification): void;
    } & events
    /**
     * Elements from {@link UI.ElementSet}.
     */
    elements: Record<string, NotificationElement>;
}