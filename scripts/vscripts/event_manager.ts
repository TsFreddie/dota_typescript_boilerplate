type Received<T> = T & {
    PlayerID: number;
};

class EventManager {
    public static SendToAll<E extends keyof IServerEvents>(
        eventName: E,
        eventData: IServerEvents[E],
    ) {
        EventManager.MarkArrays(eventData);
        CustomGameEventManager.Send_ServerToAllClients(eventName, eventData);
    }

    public static SendToPlayer<E extends keyof IServerEvents>(
        player: CDOTAPlayer,
        eventName: E,
        eventData: IServerEvents[E],
    ) {
        EventManager.MarkArrays(eventData);
        CustomGameEventManager.Send_ServerToPlayer(player, eventName, eventData);
    }

    public static SendToTeam<E extends keyof IServerEvents>(
        team: DOTATeam_t,
        eventName: E,
        eventData: IServerEvents[E],
    ) {
        EventManager.MarkArrays(eventData);
        CustomGameEventManager.Send_ServerToTeam(team, eventName, eventData);
    }

    public static Subscribe<E extends keyof IClientEvents>(
        eventName: E,
        callback: (event: Received<IClientEvents[E]>) => void,
    ): number {
        return CustomGameEventManager.RegisterListener(eventName, (_, e) => {
            callback(EventManager.PreprocessEvent(e as any));
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

        if (e && e._isArray) {
            delete e._isArray;
            const a = [];
            for (const k in e) {
                if (e[k]) {
                    a[tonumber(k)] = EventManager.PreprocessEvent(e[k]);
                }
            }
            return a;
        }
        for (const k in e) {
            if (e[k]) {
                e[k] = EventManager.PreprocessEvent(e[k]);
            }
        }
        return e;
    }

    public static MarkArrays(eventData: any) {
        if (typeof eventData !== "object") {
            return;
        }

        let isArray = (eventData as Array<{}>).length > 0;
        let test = 1;
        for (const k in eventData) {
            if (eventData[k]) {
                EventManager.MarkArrays(eventData[k]);
                if (typeof k !== "number" || k !== test) {
                    isArray = false;
                }
                test++;
            }
        }
        if (isArray) {
            eventData._isArray = true;
        }
    }
}
