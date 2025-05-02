/**
 * Class to create your custom effects.
 */
class Effect implements IEffect {
    /**
     * Method to get empty data for effects. Use if {@link clearFor} method don't satisfies your needs
     */

    public static getEmptyData = (): IEffectData => ({
        lock: false,
        progress: 0,
        progressMax: 100,
        timer: 0
    });

    /**
     * Object of all players with all their effects
     */

    public static players: Record<number, Record<string, IEffectData>> = {};

    /**
     * List of all effects
     */

    public static list: Record<string, Effect> = {};

    /**
     * Progress max value of your effect in default.
     */

    public readonly progressMax: number;

    /**
     * Timer max value of your effect in default.
     */ 
    
    public readonly timerMax?: number;

    /**
     * Your hud from {@link getHud} in field after create instance
     */

    public hud: EffectHud;

    /**
     * @param prototype Prototype of your effect. Use if you don't use your extended {@link Effect} class.
     */

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

    /**
     * Method to get your effect type. Must be defined.
     */
    
    public getType(): string {
        return null;
    }

    /**
     * Method to set field {@link hud} value. Must be defined.
     */

    public getHud(): EffectHud {
        return null;
    }

    /**
     * Method, calls when your scale effect is full.
     * @param playerUid player unique identifier
     * @param effectData effect data of player 
     */

    public onFull(playerUid: number, effectData: IEffectData): void {};

    /**
     * Method, calls when your scale effect is increasing.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onIncrease(playerUid: number, effectData: IEffectData): void {};

    /**
     * Method, calls when your scale effect is decreasing.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onDecrease(playerUid: number, effectData: IEffectData): void {};

    /**
     * Method, calls when you call init method.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onInit?(playerUid: number, effectData: IEffectData): void;

    /**
     * Method, calls when effect go away.
     * @param playerUid player unique identifier
     * @param effectData effect data of player
     */

    public onEnd?(playerUid: number, effectData: IEffectData): void;

    /**
     * Method to init effect for player.
     * @param playerUid player unique identifier
     */

    protected initFor(playerUid: number): void {
        const client = Network.getClientForPlayer(playerUid);
        if(client) {
            client.send("packet.effectbar.scale_open", {
                effectType: this.getType()
            });
        }
    }

    /**
     * Method to init effect for player.
     * @param playerUid player unique identifier
     * @param progressMax progress max
     * @param timerMax timer max
     */

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

    /**
     * Method to register your effect in {@link list}
     * @param effect your effect or prototype
     */

    public static register(effect: IEffect | Effect): Effect {
        const object = effect instanceof Effect ? effect : new Effect(effect);
        return Effect.list[object.getType()] = object;
    }

    /**
     * Method to get your effect by type;
     */

    public static get<T extends Effect>(effectType: string): Nullable<T> {
        return Effect.list[effectType] as T || null;
    }

    /**
     * Method to get effect data for specified player
     * @param playerUid player unique identifier
     * @param effectType type of effect
     */

    public static getFor(playerUid: number, effectType: string): Nullable<IEffectData> {
        const player = Effect.players[playerUid];

        if(player) {
            return Effect.players[playerUid][effectType] ??= Effect.getEmptyData();
        }
        return null;
    }

    /**
     * Method to update effect data about player on client side;
     * @param effectType type of effect;
     * @param effectData effect data of player. All is optional, e.g. it is assigning new data with previous data
     */

    public static sendFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>) {
        const client = Network.getClientForPlayer(playerUid);

        if(client) {
            client.send("packet.effectbar.data_sync_for_client", {
                effectType: effectType,
                playerUid: playerUid,
                effectData: effectData
            });
        }
        return;
    }

    /**
     * Method to set effect data for specified player, if player exists in data.
     * @param playerUid player unique identifier
     * @param effectType type of effect
     * @param effectData effect data of player
     */

    public static setFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>): void {
        const player = Effect.players[playerUid] ??= {};

        const previousData = player[effectType] || Effect.getEmptyData();
        player[effectType] = Object.assign(previousData, effectData);
    }

    /**
     * Method to clear effect data for specified player by server and client side.
     * @param playerUid player unique identifier
     * @param effectType type of effect
     */

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
            Network.getClientForPlayer(playerUid).send("packet.effectbar.hud_unlock", { effectType });
            Effect.get(effectType).init(playerUid, effectData.progressMax, effectData.timerMax);
        }
    }
});

Callback.addCallback("LocalLevelLeft", () => {
    Effect.players = {};
});

Saver.addSavesScope("scope.effectbar", 
    function read(scope: typeof Effect.players) {
        scope = scope || Effect.players;
    }, 
    function save() {
        return Effect.players || {};
    }
);

namespace Callback {
    /**
     * Callback, calls when effect inits.
     * @param playerUid player unique identifier
     * @param progressMax max progress
     * @param timerMax max timer
     */
    
    export declare interface EffectInit {
        (playerUid: number, progressMax?: number, timerMax?: number): void
    }
    export declare function addCallback(name: "EffectInit", func: EffectInit, priority?: number): void;
}