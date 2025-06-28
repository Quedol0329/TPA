import { system, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, world, } from "@minecraft/server";
var is_moving;
system.run(() => {
    is_moving = world.scoreboard.getObjective("is_moving") || world.scoreboard.addObjective("is_moving", "dummy");
});
var requestList = {};
function tpa(origin, players) {
    if (!players)
        return { status: CustomCommandStatus.Failure, message: "대상을 정해주세요." };
    const sender = origin.sourceEntity;
    var second = 5;
    var count = system.runInterval(() => {
        sender.runCommand(`title @s title ${second}`);
        sender.playSound("note.pling");
        let speed = is_moving.getScore(sender);
        if (speed >= 1) {
            sender.sendMessage("§c움직임 감지.");
            sender.playSound("note.didgeridoo");
            system.clearRun(count);
        }
        if (second <= 0) {
            for (let player of players) {
                requestList[player.name].push(sender);
                player.sendMessage(`§b${sender.name} 님이 당신에게 TP 요청하셨습니다.`);
            }
            sender.sendMessage("§a성공적으로 TP 요청하셨습니다.");
            system.clearRun(count);
        }
        second -= 1;
    }, 20);
    return {
        status: CustomCommandStatus.Success,
    };
}
function tpacancel(origin, players) {
    if (!players)
        return { status: CustomCommandStatus.Failure, message: "대상을 정해주세요." };
    const sender = origin.sourceEntity;
    for (let player of players) {
        if (!requestList[player.name].includes(sender))
            continue;
        requestList[player.name].splice(requestList[player.name].findIndex((value) => value === sender), 1);
    }
    return {
        status: CustomCommandStatus.Success,
        message: "§a성공적으로 요청 취소하셨습니다.",
    };
}
function tpaaccept(origin, players) {
    if (!players)
        return { status: CustomCommandStatus.Failure, message: "대상을 정해주세요." };
    const sender = origin.sourceEntity;
    for (let player of players) {
        if (!requestList[sender.name].includes(player))
            continue;
        system.run(() => {
            player.teleport(sender.location);
        });
        player.sendMessage(`§a${sender.name} 님이 당신의 TP 요청을 수락하셨습니다.`);
        requestList[sender.name].splice(requestList[sender.name].findIndex((value) => value === player), 1);
    }
    return {
        status: CustomCommandStatus.Success,
    };
}
function tpadeny(origin, players) {
    if (!players)
        return { status: CustomCommandStatus.Failure, message: "대상을 정해주세요." };
    const sender = origin.sourceEntity;
    for (let player of players) {
        if (!requestList[sender.name].includes(player))
            continue;
        player.sendMessage(`§c${sender.name} 님이 당신의 TP 요청을 거절하셨습니다.`);
        requestList[sender.name].splice(requestList[sender.name].findIndex((value) => value === player), 1);
    }
    return {
        status: CustomCommandStatus.Success,
        message: "§a성공적으로 요청 거절하셨습니다.",
    };
}
system.beforeEvents.startup.subscribe((init) => {
    const tpaCommand = {
        name: "q:tpa",
        description: "TP 요청.",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            {
                type: CustomCommandParamType.PlayerSelector,
                name: "players",
            },
        ],
    };
    init.customCommandRegistry.registerCommand(tpaCommand, tpa);
    const tpacancelCommand = {
        name: "q:tpacancel",
        description: "TP 요청 취소.",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            {
                type: CustomCommandParamType.PlayerSelector,
                name: "players",
            },
        ],
    };
    init.customCommandRegistry.registerCommand(tpacancelCommand, tpacancel);
    const tpaacceptCommand = {
        name: "q:tpaaccept",
        description: "TP 수락.",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            {
                type: CustomCommandParamType.PlayerSelector,
                name: "players",
            },
        ],
    };
    init.customCommandRegistry.registerCommand(tpaacceptCommand, tpaaccept);
    const tpadenyCommand = {
        name: "q:tpadeny",
        description: "TP 거절.",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            {
                type: CustomCommandParamType.PlayerSelector,
                name: "players",
            },
        ],
    };
    init.customCommandRegistry.registerCommand(tpadenyCommand, tpadeny);
});
world.afterEvents.playerJoin.subscribe((data) => {
    requestList[data.playerName] = [];
});
//# sourceMappingURL=main.js.map