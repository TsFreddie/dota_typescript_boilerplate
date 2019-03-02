function SendMessage() {
    $.Msg("Sending message.");
    GameUI.EventManager.SendToServer("custom_message", {data: {message: "button pressed"}});
}

GameUI.EventManager.Subscribe("custom_response", (event) => {
    $.Msg("Message sent: " + event.status);
})