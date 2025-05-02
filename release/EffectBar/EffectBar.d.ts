/**
 * Библиотека открыта для всех желающих создать уникальные эффекты с использованием интерфейсов. Поддерживает анимацию и готова помочь реализовать любые ваши идеи!
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */ 
interface IEffectData {
    timer: number;
    timerMax?: number;
    progress: number;
    progressMax: number;
    lock?: boolean;
}
declare abstract class EffectHud {
    type: string;
    static positions: Set<number>;
    height: number;
    thread: java.lang.Thread;
    index: number;
    lock: boolean;
    UI: UI.Window;
    constructor(type: string);
    getThreadSleepTime(): number;
    getSpacing(): number;
    getLocation(): UI.WindowLocationParams;
    getElements(): UI.ElementSet;
    getBackgroundColor(): number;
    getContent(): UI.WindowContent;
    isOpened(): boolean;
    open(): void;
    close(): void;
    setScale(scale: string, value: number, max: number): void;
    clear(): void;
    preventInit(playerUid: number): boolean;
    onPreventInit(playerUid: number): void;
    onInit?(playerUid: number): void;
    onThread?(playerUid: number, effectData: IEffectData): void;
    onAppear?(playerUid: number, effectData: IEffectData): void;
    onDisappear?(playerUid: number, effectData: IEffectData): void;
    onClose(playerUid: number, effectData: IEffectData): void;
    onFull(playerUid: number, effectData: IEffectData): void;
    init(playerUid: number): void;
    setHeight(height: number): void;
    isValidHeightFor(index: number): boolean;
    animate(playerUid: number): void;
    run(playerUid: number): void;
    static increaseCount(): void;
    static decreaseCountBy(index: number): void;
}
interface IEffect {
    readonly timerMax?: number;
    readonly progressMax: number;
    getType(): string;
    getHud(): EffectHud;
    onFull?(playerUid: number, data: IEffectData): void;
    onIncrease?(playerUid: number, data: IEffectData): void;
    onDecrease?(playerUid: number, data: IEffectData): void;
    onInit?(playerUid: number, data: IEffectData): void;
    onEnd?(playerUid: number, data: IEffectData): void;
    init?(playerUid: number, progressMax?: number, timerMax?: number): void;
}
declare class Effect implements IEffect {
    static getEmptyData: () => IEffectData;
    static players: Record<number, Record<string, IEffectData>>;
    static list: Record<string, Effect>;
    readonly progressMax: number;
    readonly timerMax?: number;
    hud: EffectHud;
    constructor(prototype?: IEffect);
    getType(): string;
    getHud(): EffectHud;
    onFull(playerUid: number, data: IEffectData): void;
    onIncrease(playerUid: number, data: IEffectData): void;
    onDecrease(playerUid: number, data: IEffectData): void;
    onInit?(playerUid: number, data: IEffectData): void;
    onEnd?(playerUid: number, data: IEffectData): void;
    protected initFor(playerUid: number): void;
    init(playerUid: number, progressMax?: number, timerMax?: number): void;
    static register(effect: IEffect | Effect): Effect;
    static get<T extends Effect>(type: string): Nullable<T>;
    /**
     * Server function to get effect object;
     */
    static getFor(playerUid: number, effectType: string): Nullable<IEffectData>;
    /**
     * Server function to update effect object;
     * @param type of effect;
     * @param data different data of effect; All is optional, e.g. it is assigning new data with previous data
     */
    static sendFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>): void;
    static setFor(playerUid: number, effectType: string, effectData: Partial<IEffectData>): void;
    static clearFor(playerUid: number, effectType: string): void;
}
declare namespace Callback {
    interface EffectInit {
        (playerUid: number, progressMax?: number, timerMax?: number): void;
    }
    function addCallback(name: "EffectInit", func: EffectInit, priority?: number): void;
}
