type Received<T> = T & {
    PlayerID: number;
};

type IClientEvents = {
    "custom_client_event": NoPayLoad;
    "custom_message": IClientMessage;
};

interface IClientMessage {
    data: IEventData;
}
