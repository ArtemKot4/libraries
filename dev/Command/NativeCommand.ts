Callback.addCallback("NativeCommand", (command) => {
    const splited = command.split(" "); 

    for(const i in Command.list) {
        const current = Command.list[i];

        if("/" + current.caller === splited[0]) {
            const args = splited.splice(1);

            if(current.require_count <= 0 || args.length >= current.require_count) {
                Game.prevent();
                const arguments_name = Object.keys(current.arguments);
                const arguments_type = Object.values(current.arguments);

                const arguments = args.slice(0, Math.min(args.length, arguments_name.length))
                .reduce<Record<string, any>>((result, currentValue, currentIndex) => {
                    let res: unknown = currentValue;

                    switch(arguments_type[currentIndex]) {
                        case "boolean": {
                            if(currentValue === "true") {
                                res = true;
                            } else if(currentValue === "false") {
                                res = false;
                            } else {
                                const error = Translation.translate("message.command.invalid_boolean_type")
                                .replace("%s", arguments_name[currentIndex]);
                                
                                Game.message(Native.Color.RED + error);
                                return;
                            };
                            break;
                        };
                        case "string": {
                            res = currentValue;
                            break;
                        };
                        case "number": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                const error = Translation.translate("message.command.invalid_number_type")
                                .replace("%s", arguments_name[currentIndex]);

                                Game.message(Native.Color.RED + error);
                                return;
                            };
                            break;
                        };
                        case "any": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                res = currentValue;
                            };
                            break;
                        };
                    };
                    
                    result[arguments_name[currentIndex]] = res;
                    return result;
                }, {});

                if(current instanceof ServerCommand) {
                    Network.sendToServer("packet.command.server." + current.caller, arguments);
                    return;
                };

                if(current instanceof ClientCommand) {
                    current.onCall(arguments);
                    return;
                };
            } else {
                Game.prevent();

                const message = Translation.translate("message.command.not_enough_arguments")
                .replace("%s", current.require_count.toString())
                .replace("%d", args.length.toString());

                Game.message(Native.Color.RED + message);
            };
        };
    };
});
/*Callback.addCallback("NativeCommand", (command) => {
    const splited = command.split(" "); 
    
    if(command === "/commandlib help") {
        for(const i in Command.list) {
            const current = Command.list[i];
            let index = 0;
            Game.message(index + "." + " " + "/" + current.caller + " " + Object.keys(current.arguments).
            reduce((pv, cv) => {
                pv +=  "<" + cv + ">" + " ";
                return pv;
            }, ""));
            index++
        }
        return;
    }
    
    for(const i in Command.list) {
        const current = Command.list[i];
        if("/" + current.caller === splited[0]) {
            const args = splited.splice(1);

            if(current.require_count <= 0 || args.length >= current.require_count) {
                Game.prevent();
                const arguments_name = Object.keys(current.arguments);
                const arguments_type = Object.values(current.arguments);

                const arguments = args.slice(0, Math.min(args.length, arguments_name.length))
                .reduce<Record<string, any>>((result, currentValue, currentIndex) => {
                    let res: unknown = currentValue;

                    switch(arguments_type[currentIndex]) {
                        case "boolean": {
                            if(currentValue === "true") {
                                res = true;
                            } else if(currentValue === "false") {
                                res = false;
                            } else {
                                const error = Translation.translate("message.command.invalid_boolean_type")
                                .replace("%s", arguments_name[currentIndex]);
                                
                                Game.message(Native.Color.RED + error);
                                return;
                            }
                            break;
                        }
                        case "string": {
                            res = currentValue;
                            break;
                        }
                        case "number": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                const error = Translation.translate("message.command.invalid_number_type")
                                .replace("%s", arguments_name[currentIndex]);

                                Game.message(Native.Color.RED + error);
                                return;
                            }
                            break;
                        }
                        case "any": {
                            const num = Number(currentValue);

                            if(typeof num === "number") {
                                res = num;
                            } else {
                                res = currentValue;
                            }
                            break;
                        }
                    }
                    
                    result[arguments_name[currentIndex]] = res;
                    return result;
                }, {});

                if(current instanceof ServerCommand) {
                    Network.sendToServer("packet.command.server." + current.caller, arguments);
                    return;
                }

                if(current instanceof ClientCommand) {
                    current.onCall(arguments);
                    return;
                }
            } else {
                Game.prevent();

                const message = Translation.translate("message.command.not_enough_arguments")
                .replace("%s", current.require_count.toString())
                .replace("%d", args.length.toString());

                Game.message(Native.Color.RED + message);
            }
        }
    }
});*/