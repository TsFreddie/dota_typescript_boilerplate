type Received<T> = T & {
    PlayerID: number;
};

class EventManager {
    public static SendToAll<E extends keyof IEvents>(
        eventName: E,
        eventData: IEvents[E],
    ) {
        EventManager.MarkObjects(eventData);
        CustomGameEventManager.Send_ServerToAllClients(eventName, eventData);
    }

    public static SendToPlayer<E extends keyof IEvents>(
        player: CDOTAPlayer,
        eventName: E,
        eventData: IEvents[E],
    ) {
        EventManager.MarkObjects(eventData);
        CustomGameEventManager.Send_ServerToPlayer(player, eventName, eventData);
    }

    public static SendToTeam<E extends keyof IEvents>(
        team: DotaTeam,
        eventName: E,
        eventData: IEvents[E],
    ) {
        EventManager.MarkObjects(eventData);
        CustomGameEventManager.Send_ServerToTeam(team, eventName, eventData);
    }

    public static Subscribe<E extends keyof IEvents>(
        eventName: E,
        callback: (event: Received<IEvents[E]>) => void,
    ): number {
        return CustomGameEventManager.RegisterListener(eventName, (_: object, event?: object) => {
            callback(EventManager.PreprocessEvent(event as any));
        });
    }

    public static Unsubscribe(eventId: number) {
        CustomGameEventManager.UnregisterListener(eventId);
    }

    /*
        Preprocess Arrays
    */
    public static PreprocessEvent(e: any): any {
        if (typeof e !== "object") {
            return e;
        }

        if (e) {
            if (e._isArray) {
                delete e._isArray;
                const a: any[] = [];
                for (const k in e) {
                    if (e[k]) {
                        const numK = tonumber(k);
                        if (!numK) {
                            continue;
                        }
                        a[numK] = EventManager.PreprocessEvent(e[k]);
                    }
                }
                return a;
            } else if (e._isBoolean) {
                DeepPrintTable(e);
                return e.value > 0;
            }

            for (const k in e) {
                if (e[k]) {
                    e[k] = EventManager.PreprocessEvent(e[k]);
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

        let isArray = (eventData as Array<{}>).length > 0;
        let test = 1;
        for (const k in eventData) {
            if (eventData[k] !== undefined) {
                eventData[k] = EventManager.MarkObjects(eventData[k]);
                if (typeof k !== "number" || k !== test) {
                    isArray = false;
                }
                test++;
            }
        }
        if (isArray) {
            eventData._isArray = true;
        }

        return eventData;
    }
}

_G.EventManager = EventManager;