class EventManager {
    public static SendToAll<E extends keyof IClientEvents>(
        eventName: E,
        eventData: IClientEvents[E],
    ) {
        GameEvents.SendCustomGameEventToAllClients(eventName, this.MarkArrays(eventData));
    }

    public static SendToClient<E extends keyof IClientEvents>(
        playerId: number,
        eventName: E,
        eventData: IClientEvents[E],
    ) {
        GameEvents.SendCustomGameEventToClient(eventName, playerId, this.MarkArrays(eventData));
    }

    public static SendToServer<E extends keyof IClientEvents>(
        eventName: E,
        eventData: IClientEvents[E],
    ) {
        GameEvents.SendCustomGameEventToServer(eventName, this.MarkArrays(eventData));
    }

    public static Subscribe<E extends keyof IServerEvents>(
        eventName: E,
        callback: (event: IServerEvents[E]) => void,
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

        if (e && e._isArray) {
            delete e._isArray;
            const vals = Object.keys(e).map((key) => this.PreprocessEvent(e[key]));
            return vals;
        }

        for (const k in e) {
            if (e[k]) {
                e[k] = this.PreprocessEvent(e[k]);
            }
        }

        return e;
    }

    public static MarkArrays(eventData: any): any {
        if (typeof eventData !== "object") {
            return eventData;
        }

        if (Array.isArray(eventData)) {
            return {_isArray: true, ...eventData};
        }
        
        for (const k in eventData) {
            if (eventData[k]) {
                eventData[k] = this.MarkArrays(eventData[k]);
            }
        }
        return eventData;
    }
}
