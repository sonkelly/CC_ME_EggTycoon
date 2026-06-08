export class EventManager {

    private static events: Map<string, Function[]> =
        new Map();

    public static on(
        eventName: string,
        callback: Function
    ): void {

        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName)?.push(callback);
    }

    public static emit(
        eventName: string,
        data?: any
    ): void {

        const listeners =
            this.events.get(eventName);

        if (!listeners) {
            return;
        }

        listeners.forEach(cb => cb(data));
    }

    public static off(
        eventName: string,
        callback: Function
    ): void {

        const listeners =
            this.events.get(eventName);

        if (!listeners) {
            return;
        }

        const index =
            listeners.indexOf(callback);

        if (index >= 0) {
            listeners.splice(index, 1);
        }
    }
}