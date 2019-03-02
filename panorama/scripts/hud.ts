function SendMessage() {
    $.Msg("Sending message.");
    GameUI.EventManager.SendToServer("custom_message", {data: {message: "button pressed"}});
}