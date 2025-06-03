var readyplayers
var repeatingMessage
export function onReady(spInterface, callback, minPlayers) {
    readyplayers = []
    spInterface.message([`{lightPurple}[MatchPoint] {white}Type {orange}!ready{white} to ready yourself.`])
    repeatingMessage = setInterval(() => {
        spInterface.message([`{lightPurple}[MatchPoint] {white}Type {orange}!ready{white} to ready yourself.`])
    }, 15000)

    spInterface.command.on("ready", (player, args) => {
        if (readyplayers.includes(player.steamid)) {
            spInterface.message([`{lightPurple}[MatchPoint] {orange}${player.name} {white}is already ready!`, "{lightPurple}[MatchPoint]{white} type {orange}unready{white} to unready yourself."])
            return
        }
        readyplayers.push(player.steamid)
        spInterface.message([`{lightPurple}[MatchPoint] {orange}${player.name} {white}is now {green}ready{white}!`])
        if (readyplayers.length === (minPlayers || spInterface.player.list().length)) {
            resetReady(spInterface)
            callback()
        }
    })
    spInterface.command.on("unready", (player, args) => {
        if (!readyplayers.includes(player.steamid)) {
            spInterface.message([`{lightPurple}[MatchPoint] {orange}${player.name}{white} is not ready!`, "{lightPurple}[MatchPoint]{white} type {orange}ready{white} to ready yourself."])
            return
        }
        readyplayers = readyplayers.filter(id => id !== player.steamid)
        spInterface.message([`{lightPurple}[MatchPoint] {orange}${player.name}{white} is now {red}unready{white}!`])
    })
    spInterface.command.on("status", (player, args) => {
        spInterface.message([
            `{lightPurple}[MatchPoint] {green}--- Ready Status ---`,
            ...spInterface.player.list().map(p => {
                return `{lightPurple}[MatchPoint] {orange}${p.name}: ${readyplayers.includes(p.steamid) ? "{green}Ready" : "{red}Not Ready"}`
            })
        ])
    })
    spInterface.command.on("forceready", (player, args) => {
        resetReady(spInterface)
        spInterface.message([`{lightPurple}[MatchPoint] {darkRed}forceready: {orange}All players{white} are now {green}ready{white}!`])
        callback()
    })
}

export function resetReady(spInterface) {
    spInterface.command.off("ready");
    spInterface.command.off("unready");
    spInterface.command.off("status");
    spInterface.command.off("forceready");
    clearInterval(repeatingMessage)

    return readyplayers
}