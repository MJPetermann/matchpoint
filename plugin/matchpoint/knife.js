import { readFileSync } from "node:fs"
export function startKnife(spInterface, callback) {
    spInterface.rcon(readFileSync("./plugins/matchpoint/cfg/knife.cfg", "utf8").split("\n"))
    spInterface.on("freezeTimeStart", () => {
        spInterface.match.status = "knife"
        spInterface.message([
            `{lightPurple}[MatchPoint] {red}Knife round!`,
            `{lightPurple}[MatchPoint] {red}Knife round!`,
            `{lightPurple}[MatchPoint] {red}Knife round!`
        ])
        spInterface.off("freezeTimeStart","knife")
        spInterface.on("teamScored", (scoreTeam) => {
            if (scoreTeam.score == 1) {
                spInterface.message(`{lightPurple}[MatchPoint] {orange}${spInterface.match.teams.filter((team) => team.side == scoreTeam.side)[0].name}{white} won the knife round!`)
                spInterface.on("freezeTimeStart",()=> {chooseSide(spInterface, scoreTeam.side, callback)},"afterknife")
                spInterface.off("teamScored", "knife")
                spInterface.match.maps[spInterface.match.teams[0].score+spInterface.match.teams[1].score].knifeWinner = spInterface.match.teams.filter((t) => scoreTeam.side == t.side)[0].name
            }
            
        },"knife")
    }, "knife")

}

function chooseSide(spInterface, side, callback) {
    spInterface.off("freezeTimeStart","afterknife")
    spInterface.rcon(["mp_warmup_pausetimer 1", "mp_warmuptime 9999", ...readFileSync("./plugins/matchpoint/cfg/warmup.cfg", "utf8").split("\n")])
    spInterface.message([
        `{lightPurple}[MatchPoint] {white}Choose your side!`,
        `{lightPurple}[MatchPoint] {white}Type {orange}.switch{white} or {orange}.stay{white}`
    ])
    spInterface.command.on("switch", (player, args) => {
        if (!spInterface.match.teams.filter((team) => team.side == side)[0].players.includes(player.steamid)) return
        switchTeams(spInterface)
        callback(spInterface.match.teams.filter((team) => team.side == side)[0], (spInterface.match.teams.filter((team) => team.side == side)[0].side == "CT")? "TERRORIST" : "CT")
    })
    spInterface.command.on("swap", (player, args) => {
        if (!spInterface.match.teams.filter((team) => team.side == side)[0].players.includes(player.steamid)) return
        switchTeams(spInterface)
        callback(spInterface.match.teams.filter((team) => team.side == side)[0], (spInterface.match.teams.filter((team) => team.side == side)[0].side == "CT")? "TERRORIST" : "CT")
    })
    spInterface.command.on("stay", (player, args) => {
        if (!spInterface.match.teams.filter((team) => team.side == side)[0].players.includes(player.steamid)) return
        stayTeams(spInterface)
        callback(spInterface.match.teams.filter((team) => team.side == side)[0], spInterface.match.teams.filter((team) => team.side == side)[0].side)
    })
    spInterface.command.on("t", (player, args) => {
        if (!spInterface.match.teams.filter((team) => team.side == side)[0].players.includes(player.steamid)) return
        if (side === "TERRORIST") stayTeams(spInterface)
        if (side === "CT") switchTeams(spInterface)
        callback(spInterface.match.teams.filter((team) => team.side == side)[0], "TERRORIST")
    })
    spInterface.command.on("ct", (player, args) => {
        if (!spInterface.match.teams.filter((team) => team.side == side)[0].players.includes(player.steamid)) return
        if (side === "CT") stayTeams(spInterface)
        if (side === "TERRORIST") switchTeams(spInterface)
        callback(spInterface.match.teams.filter((team) => team.side == side)[0], "CT")
    })
}

function switchTeams(spInterface) {
    spInterface.rcon("mp_swapteams")
    spInterface.command.off("switch");
    spInterface.command.off("swap");
    spInterface.command.off("stay");
    spInterface.command.off("t");
    spInterface.command.off("ct");
}

function stayTeams(spInterface) {
    spInterface.command.off("switch");
    spInterface.command.off("swap");
    spInterface.command.off("stay");
    spInterface.command.off("t");
    spInterface.command.off("ct");
}