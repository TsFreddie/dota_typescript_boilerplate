class EventManager {
    public static SendToAll<E extends keyof IEvents>(
        eventName: E,
        eventData: IEvents[E],
    ) {
        GameEvents.SendCustomGameEventToAllClients(eventName, this.MarkObjects(eventData));
    }

    public static SendToClient<E extends keyof IEvents>(
        playerId: number,
        eventName: E,
        eventData: IEvents[E],
    ) {
        GameEvents.SendCustomGameEventToClient(eventName, playerId, this.MarkObjects(eventData));
    }

    public static SendToServer<E extends keyof IEvents>(
        eventName: E,
        eventData: IEvents[E],
    ) {
        GameEvents.SendCustomGameEventToServer(eventName, this.MarkObjects(eventData));
    }

    public static Subscribe<E extends keyof IEvents>(
        eventName: E,
        callback: (event: IEvents[E]) => void,
    ): number {
        return GameEvents.Subscribe(eventName, (e) => {
            e = this.PreprocessEvent(e);
            callback(e as any);
        });
    }

    public static Unsubscribe(eventId: number) {
        GameEvents.Unsubscribe(eventId);
    }

    public static PreprocessEvent(e: any): any {
        if (typeof e !== "object") {
            return e;
        }

        if (e) {
            if (e._isArray) {
                delete e._isArray;
                const vals = Object.keys(e).map((key) => this.PreprocessEvent(e[key]));
                return vals;
            } else if (e._isBoolean) {
                return e.value > 0;
            }

            for (const k in e) {
                if (e[k]) {
                    e[k] = this.PreprocessEvent(e[k]);
                }
            }
        }

        return e;
    }

    public static MarkObjects(eventData: any): any {
        if (typeof eventData === "symbol" || typeof eventData === "function" ) {
            return undefined;
        }

        if (typeof eventData === "boolean") {
            return { _isBoolean: true, value: eventData };
        }

        if (typeof eventData !== "object") {
            return eventData;
        }

        if (Array.isArray(eventData)) {
            return {_isArray: true, ...eventData};
        }

        for (const k in eventData) {
            if (eventData[k] !== undefined) {
                eventData[k] = this.MarkObjects(eventData[k]);
            }
        }
        return eventData;
    }
}
