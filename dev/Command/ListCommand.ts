class ListCommand extends ClientCommand {
    public constructor() {
        super("commandlist", {});
    }

    public onCall(data: {}): void {
        let message = Translation.translate("message.command.list");
        let index = 1;
        for(const i in Command.list) {
            message += "\n";
            const current = Command.list[i];
            const description = (index + "." + " " + "/" + current.caller + " " + Object.entries(current.arguments).
                reduce((pv, cv) => {
                    pv +=  "<" + cv[0] + ":" + cv[1] + ">" + " ";
                    return pv;
                }, "")
            .concat("—" + " " + (current.getDescription() || "...")))
            message += description;
            index++;
        }
        Game.message(message);
    }
}

Command.register(new ListCommand());