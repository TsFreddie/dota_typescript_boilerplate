require("libs.event_manager");

function Precache(context: CScriptPrecacheContext): void {
    /*
        Precache things we know we'll use.  Possible file types include (but not limited to):
            PrecacheResource( "model", "*.vmdl", context )
            PrecacheResource( "soundfile", "*.vsndevts", context )
            PrecacheResource( "particle", "*.vpcf", context )
            PrecacheResource( "particle_folder", "particles/folder", context )
    */
}

function Activate(): void {
    EventManager.Subscribe("custom_message", (event) => {
        print("Client send message: " + event.data.message);
    });
}
