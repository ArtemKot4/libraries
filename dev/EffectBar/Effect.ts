class Effect implements IEffect {
    public static getEmptyData = (): IEffectData => ({
        lock: false,
        progress: 0,
        progressMax: 100,
        timer: 0
    });
    public static players: Record<number, Record<string, IEffectData>> = {};
    public static list: Record<string, Effect> = {};
    
    public readonly progressMax: number;
    public readonly timerMax?: number;
    public hud: EffectHud;

    public constructor(prototype?: IEffect) {
        this.hud = this.getHud();

        if(!prototype) {
            return;
        }

        const type = prototype.getType();
        if(!type) {
            throw new java.lang.RuntimeException("Prototype of Effect must have a getType() function");
        }

        if("getHud" in prototype) {
            this.getHud = prototype.getHud;
            this.hud = prototype.getHud();
        }

        if("onFull" in prototype) {
            this.onFull = prototype.onFull;
        }

        if("onIncrease" in prototype) {
            this.onIncrease = prototype.onIncrease;
        }

        if("onDecrease" in prototype) {
            this.onDecrease = prototype.onDecrease;
        }

        if("onInit" in prototype) {
            this.onInit = prototype.onInit;
        }
        
        if("onEnd" in prototype) {
            this.onEnd = prototype.onEnd;
        }

        if("init" in prototype) {
            this.init = prototype.init;
        }
    }
    
    public getType(): string {
        return null;
    }

    public getHud(): EffectHud {
        return null;
    }

    public onFull(playerUid: number, data: IEffectData): void {};
    public onIncrease(playerUid: number, data: IEffectData): void {};
    public onDecrease(playerUid: number, data: IEffectData): void {};
    public onInit?(playerUid: number, data: IEffectData): void;
    public onEnd?(playerUid: number, data: IEffectData): void;

    protected initFor(playerUid: number): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client) {
            client.send("packet.effectlib.scale_open", {
                effectType: this.getType()
            });
        }
    }

    public init(playerUid: number, progressMax?: number, timerMax?: number): void {
        timerMax = timerMax || this.timerMax || 5;
        const type = this.getType();

        Effect.setFor(playerUid, type, {
            timer: timerMax
        });

        if(Effect.getFor(playerUid, type).lock == true) {
            return;
        }

        progressMax = progressMax ? Math.ceil(progressMax) : this.progressMax;

        Callback.invokeCallback<Callback.EffectInit>("EffectInit", playerUid, progressMax, timerMax);

        Effect.setFor(playerUid, type, {
            lock: true,
            timerMax: timerMax,
            progress: 0,
            progressMax: progressMax
        });

        this.initFor(playerUid);

        if("onInit" in this) {
            this.onInit(playerUid, Effect.getFor(playerUid, type));
        }

        const self = this;

        Updatable.addUpdatable({
            update() {
                const time = World.getThreadTime();
                const effectData = Effect.getFor(playerUid, type);

                if(time % 20 === 0 && effectData.timer > 0) {
                    effectData.timer -= 1;
                }

                if(effectData.timer > 0 && effectData.progress <= progressMax) {
                    effectData.progress += 1;
                    self.onIncrease(playerUid, effectData);
                }

                if(effectData.timer <= Math.floor(timerMax / 2) && effectData.progress > 0) {
                    self.onDecrease(playerUid, effectData);
                    effectData.progress -= 1;
                }
   
                if(effectData.progress >= progressMax) {
                    self.onFull(playerUid, effectData);
                }

                if(time % 60 === 0 && effectData.timer <= 0 && effectData.progress <= 0) {
                    if("onEnd" in this) {
                        self.onEnd(playerUid, effectData);
                    }

                    effectData.lock = false;
                    this.remove = true;
                }
                Effect.sendFor(playerUid, type, effectData);
            }
        });
        return;
    }

    public static register(effect: IEffect | Effect): Effect {
        const object = effect instanceof Effect ? effect : new Effect(effect);
        return Effect.list[object.getType()] = object;
    }

    public static get<T extends Effect>(type: string): Nullable<T> {
        return Effect.list[type] as T || null;
    }

    /**
     * Server function to get effect object;
     */
    public static getFor(playerUid: number, effectType: string): Nullable<IEffectData> {
        const player = Effect.players[playerUid];

        if(player) {
            return Effect.players[playerUid][effectType] ??= Effect.getEmptyData();
        }
        return null;
    }

    /**
     * Server function to update effect object;
     * @param type of effect;
     * @param data different data of effect; All is optional, e.g. it is assigning new data with previous data
     */

    public static sendFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>) {
        const client = Network.getClientForPlayer(playerUid);

        if(client) {
            client.send("packet.effectlib.data_sync_for_client", {
                effectType: effectType,
                playerUid: playerUid,
                effectData: effectData
            });
        }
        return;
    }

    public static setFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>): void {
        const player = Effect.players[playerUid] ??= {};

        const previousData = player[effectType] || Effect.getEmptyData();
        player[effectType] = Object.assign(previousData, effectData);
    }

    public static clearFor(playerUid: number, effectType: string): void {
        Effect.setFor(playerUid, effectType, Effect.getEmptyData());
        Effect.sendFor(playerUid, effectType, Effect.getEmptyData());
    }
}

Callback.addCallback("EntityDeath", (entity) => {
    if(Entity.getType(entity) === EEntityType.PLAYER) {
        for(const effectType in Effect.list) {
            Effect.clearFor(entity, effectType);
        }
    }
});

Callback.addCallback("ServerPlayerLoaded", (playerUid) => {
    Effect.players = Effect.players || {};
    Effect.players[playerUid] = Effect.players[playerUid] || {};

    for(const effectType in Effect.list) {
        const effectData = Effect.getFor(playerUid, effectType);
        Effect.sendFor(playerUid, effectType, effectData);
        if(effectData.lock === true && effectData.timer > 0 && effectData.progress > 0) {
            effectData.lock = false;
            Network.getClientForPlayer(playerUid).send("packet.effectlib.hud_unlock", { effectType });
            Effect.get(effectType).init(playerUid, effectData.progressMax, effectData.timerMax);
        }
    }
});

Callback.addCallback("LocalLevelLeft", () => {
    Effect.players = {};
});

Saver.addSavesScope("scope.effect", 
    function read(scope: typeof Effect.players) {
        scope = scope || Effect.players;
    }, 
    function save() {
        return Effect.players || {};
    }
);

namespace Callback {
    export declare interface EffectInit {
        (playerUid: number, progressMax?: number, timerMax?: number): void
    }
    export declare function addCallback(name: "EffectInit", func: EffectInit, priority?: number): void;
}