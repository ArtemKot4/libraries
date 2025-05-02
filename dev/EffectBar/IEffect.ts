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
    init?(playerUid: number, progressMax?: number, timerMax?: number): void
}