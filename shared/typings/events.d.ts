type IEvents = {
    "custom_event": NoPayLoad;
    "custom_message": IClientMessage;
    "custom_response": IServerResponse;
};

interface IClientMessage {
    data: IEventData;
}

interface IServerResponse {
    status: "Success" | "Failure"
}