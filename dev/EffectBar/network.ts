Network.addClientPacket("packet.effectbar.data_sync_for_client", (data: { effectType: string, playerUid: number, effectData: IEffectData }) => {
    Effect.players = Effect.players || {};
    Effect.players[data.playerUid] = Effect.players[data.playerUid] || {};

    return Effect.setFor(data.playerUid, data.effectType, data.effectData);
});

Network.addClientPacket("packet.effectbar.scale_open", (data: { effectType: string }) => {
    return Effect.get(data.effectType).hud.init(Player.getLocal());
});

Network.addClientPacket("packet.effectbar.hud_unlock", (data: { effectType: string }) => {
    Effect.get(data.effectType).hud.lock = false;
});