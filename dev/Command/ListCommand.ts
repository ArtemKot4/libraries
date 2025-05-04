class ListCommand extends ClientCommand {
    public constructor() {
        super("commandlist", {});
    }

    public onCall(data: {}): void {
        Game.message(Translation.translate("message.command.list"));
        let index = 0;
        for(const i in Command.list) {
            const current = Command.list[i];
            const description = (index + "." + " " + "/" + current.caller + " " + Object.keys(current.arguments).
                reduce((pv, cv) => {
                    pv +=  "<" + cv + ">" + " ";
                    return pv;
                }, "")
            .concat(" — " + (current.getDescription() || "...")))
            Game.message(description);
            index++;
        }
    }
}

Command.register(new ListCommand());