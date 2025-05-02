Callback.addCallback("NativeCommand", (command) => {
    if(command.startsWith("/effectbar")) {
        Game.prevent();
        return Network.sendToServer("packet.effect.command", {
            args: command.split(" ").slice(1)
        });
    }
});

Network.addServerPacket("packet.effect.command", (client, data: { args: string[] }) => {
    if(client == null) return;
    const playerUid = client.getPlayerUid();
    if(!new PlayerActor(playerUid).isOperator()) {
        client.sendMessage(Native.Color.RED + Translation.translate("message.effect.not_allowed"));
    }

    const arguments = {
        action: data.args[0],
        effectType: data.args[1],
        progressMax: data.args[2],
        timerMax: data.args[3]
    }

    const effect = Effect.get(data.args[1]);
    switch(arguments.action) {
        case "set": {
            if(effect == null) {
                return client.sendMessage(Native.Color.RED + Translation.translate("message.effect.not_exists_effect").replace("%s", data.args[1]));
            }
            effect.init(playerUid, Number(arguments.progressMax) || effect.progressMax, Number(arguments.timerMax) || effect.timerMax);
            return client.sendMessage(Native.Color.GREEN + Translation.translate("message.effect.effect_successfully_set").replace("%s", data.args[1]));
        }
        case "clear": {
            if(!arguments.effectType) {
                for(const effectType in Effect.list) {
                    Effect.clearFor(playerUid, effectType);
                    client.sendMessage(Native.Color.GREEN + Translation.translate("message.effectlib.successfully_remove").replace("%s", effectType));
                }
                return;
            }
            Effect.clearFor(playerUid, arguments.effectType);
            client.sendMessage(Native.Color.GREEN + Translation.translate("message.effectlib.successfully_remove").replace("%s", arguments.effectType));
            return;
        }
    }
});