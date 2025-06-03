import { onReady, resetReady } from "./ready.js"
var lastStatus
var repeatingMessage
export function enablePause(spInterface) {
    spInterface.command.on("tech", (player, args) => {
        spInterface.message(`{lightPurple}[MatchPoint] {white}Match is paused by {orange}${spInterface.match.teams.filter((team) => team.players.includes(player.steamid))[0].name}{white}!`)
        repeatingMessage = setInterval(() => spInterface.message(`{lightPurple}[MatchPoint] {white}Match is paused by {orange}${spInterface.match.teams.filter((team) => team.players.includes(player.steamid))[0].name}{white}!`), 15000)
        spInterface.rcon("mp_pause_match 1")
        spInterface.command.off("tech")
        lastStatus = spInterface.match.status
        spInterface.match.status = "paused"
        onReady(spInterface ,() => {
            spInterface.match.status = lastStatus
            clearImmediate(repeatingMessage)
            spInterface.message(`{lightPurple}[MatchPoint] {white}Match is resumed!`)
            spInterface.rcon("mp_unpause_match 1")
            enablePause(spInterface)
        })
        
    })

    
}

export function startPause(spInterface, callback) {
    clearImmediate(repeatingMessage)
    onReady(spInterface, () => {
        spInterface.message(`{lightPurple}[MatchPoint] {white}Match is paused!`)
        callback()
    })
}

export function disablePause(spInterface) {
    spInterface.command.off("tech");
    clearImmediate(repeatingMessage)
    resetReady(spInterface);
}