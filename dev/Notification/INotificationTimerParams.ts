interface INotificationTimerParams<thread> {
    /**
     * Values, usings in thread.
     */
    thread: {
        /**
         * time before moving back, in milliseconds.
         */
        reachTime?: number,
        /**
         * time between next notification, in milliseconds.
         */
        queueTime?: number,
        /**
         * time how much thread is sleep between elements moving, in milliseconds. 
         */ 
        sleepTime?: number
    } & thread;
}