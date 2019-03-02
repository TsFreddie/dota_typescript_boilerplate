type IServerEvents = {
    "custom_server_event": NoPayLoad;
    "custom_response": IServerResponse;
};

interface IServerResponse {
    status: "Success" | "Failure"
}
