// scripts/main.ts
import {
  system,
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  world
} from "@minecraft/server";
var is_moving;
system.run(() => {
  is_moving = world.scoreboard.getObjective("is_moving") || world.scoreboard.addObjective("is_moving", "dummy");
});
var requestList = {};
function tpa(origin, players) {
  if (!players)
    return { status: CustomCommandStatus.Failure, message: "\uB300\uC0C1\uC744 \uC815\uD574\uC8FC\uC138\uC694." };
  const sender = origin.sourceEntity;
  var second = 5;
  var count = system.runInterval(() => {
    sender.runCommand(`title @s title ${second}`);
    sender.playSound("note.pling");
    let speed = is_moving.getScore(sender);
    if (speed >= 1) {
      sender.sendMessage("\xA7c\uC6C0\uC9C1\uC784 \uAC10\uC9C0.");
      sender.playSound("note.didgeridoo");
      system.clearRun(count);
    }
    if (second <= 0) {
      for (let player of players) {
        requestList[player.name].push(sender);
        player.sendMessage(`\xA7b${sender.name} \uB2D8\uC774 \uB2F9\uC2E0\uC5D0\uAC8C TP \uC694\uCCAD\uD558\uC168\uC2B5\uB2C8\uB2E4.`);
      }
      sender.sendMessage("\xA7a\uC131\uACF5\uC801\uC73C\uB85C TP \uC694\uCCAD\uD558\uC168\uC2B5\uB2C8\uB2E4.");
      system.clearRun(count);
    }
    second -= 1;
  }, 20);
  return {
    status: CustomCommandStatus.Success
  };
}
function tpacancel(origin, players) {
  if (!players)
    return { status: CustomCommandStatus.Failure, message: "\uB300\uC0C1\uC744 \uC815\uD574\uC8FC\uC138\uC694." };
  const sender = origin.sourceEntity;
  for (let player of players) {
    if (!requestList[player.name].includes(sender))
      continue;
    requestList[player.name].splice(
      requestList[player.name].findIndex((value) => value === sender),
      1
    );
  }
  return {
    status: CustomCommandStatus.Success,
    message: "\xA7a\uC131\uACF5\uC801\uC73C\uB85C \uC694\uCCAD \uCDE8\uC18C\uD558\uC168\uC2B5\uB2C8\uB2E4."
  };
}
function tpaaccept(origin, players) {
  if (!players)
    return { status: CustomCommandStatus.Failure, message: "\uB300\uC0C1\uC744 \uC815\uD574\uC8FC\uC138\uC694." };
  const sender = origin.sourceEntity;
  for (let player of players) {
    if (!requestList[sender.name].includes(player))
      continue;
    system.run(() => {
      player.teleport(sender.location);
    });
    player.sendMessage(`\xA7a${sender.name} \uB2D8\uC774 \uB2F9\uC2E0\uC758 TP \uC694\uCCAD\uC744 \uC218\uB77D\uD558\uC168\uC2B5\uB2C8\uB2E4.`);
    requestList[sender.name].splice(
      requestList[sender.name].findIndex((value) => value === player),
      1
    );
  }
  return {
    status: CustomCommandStatus.Success
  };
}
function tpadeny(origin, players) {
  if (!players)
    return { status: CustomCommandStatus.Failure, message: "\uB300\uC0C1\uC744 \uC815\uD574\uC8FC\uC138\uC694." };
  const sender = origin.sourceEntity;
  for (let player of players) {
    if (!requestList[sender.name].includes(player))
      continue;
    player.sendMessage(`\xA7c${sender.name} \uB2D8\uC774 \uB2F9\uC2E0\uC758 TP \uC694\uCCAD\uC744 \uAC70\uC808\uD558\uC168\uC2B5\uB2C8\uB2E4.`);
    requestList[sender.name].splice(
      requestList[sender.name].findIndex((value) => value === player),
      1
    );
  }
  return {
    status: CustomCommandStatus.Success,
    message: "\xA7a\uC131\uACF5\uC801\uC73C\uB85C \uC694\uCCAD \uAC70\uC808\uD558\uC168\uC2B5\uB2C8\uB2E4."
  };
}
system.beforeEvents.startup.subscribe((init) => {
  const tpaCommand = {
    name: "q:tpa",
    description: "TP \uC694\uCCAD.",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      {
        type: CustomCommandParamType.PlayerSelector,
        name: "players"
      }
    ]
  };
  init.customCommandRegistry.registerCommand(tpaCommand, tpa);
  const tpacancelCommand = {
    name: "q:tpacancel",
    description: "TP \uC694\uCCAD \uCDE8\uC18C.",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      {
        type: CustomCommandParamType.PlayerSelector,
        name: "players"
      }
    ]
  };
  init.customCommandRegistry.registerCommand(tpacancelCommand, tpacancel);
  const tpaacceptCommand = {
    name: "q:tpaaccept",
    description: "TP \uC218\uB77D.",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      {
        type: CustomCommandParamType.PlayerSelector,
        name: "players"
      }
    ]
  };
  init.customCommandRegistry.registerCommand(tpaacceptCommand, tpaaccept);
  const tpadenyCommand = {
    name: "q:tpadeny",
    description: "TP \uAC70\uC808.",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      {
        type: CustomCommandParamType.PlayerSelector,
        name: "players"
      }
    ]
  };
  init.customCommandRegistry.registerCommand(tpadenyCommand, tpadeny);
});
world.afterEvents.playerJoin.subscribe((data) => {
  requestList[data.playerName] = [];
});

//# sourceMappingURL=../debug/main.js.map
