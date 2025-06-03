import { readFileSync } from "node:fs"

import { onReady, resetReady } from "./matchpoint/ready.js"
import { enablePause, disablePause } from "./matchpoint/pause.js"
import { startKnife } from "./matchpoint/knife.js"
import { startLive, cancelLive, reactivateLive } from "./matchpoint/live.js"


export default class MatchPoint {
    static name = "MatchPoint"
    static description = "This Plugin is a tournament match manager for the server. It contains commands and features to matches."
    static version = "1.0.0"
    static author = "MJPetermann"
    static commands = [
        { command: "ready", permission: "mp.player.ready", description: "Sets the player as ready for the match." },
        { command: "unready", permission: "mp.player.unready", description: "Sets the player as not ready for the match." },    
        { command: "status", permission: "mp.player.status", description: "Shows the status of how many players are ready and how many are not." },
        { command: "forceready", permission: "mp.admin.forceready", description: "Forces all players to be ready for the match." },
        { command: "endmatch", permission: "mp.endmatch.forceready", description: "Ends the current match." },
        { command: "switch", permission: "mp.player.switch", description: "Switch teams after knife round." },
        { command: "swap", permission: "mp.player.swap", description: "Switch teams after knife round." },
        { command: "stay", permission: "mp.player.stay", description: "Stay on the current team after knife round." },
        { command: "t", permission: "mp.player.t", description: "Chooses the T side after knife round." },
        { command: "ct", permission: "mp.player.ct", description: "Chooses the CT side after knife round." },
        { command: "tech", permission: "mp.player.techpause", description: "Pauses the match for technical reasons." },
        { command: "stop", permission: "mp.player.stop", description: "If no damage is done, restets the round and pauses the match." },
        { command: "start", permission: "mp.admin.start", description: "Starts the match." },
    ]
    constructor(ServerPluginInterface) {
        this.spInterface = ServerPluginInterface.interface
        this.spInterface.log(`Plugin ${this.constructor.name} version ${this.constructor.version} loaded`)
        this.spInterface.match = {
            status: "",
            teams: [
                { name: "Team A", players: ["[U:1:395318202]"], side: "CT", score: 0 },
                { name: "Team B", players: [], side: "TERRORIST", score: 0}
            ],
            maps: [
                { name: "de_dust2", startingCT: false, knifeWinner: "" },
            ],
            config: {
                timeToStart: 600,   // 10 minutes to connect
                timeToLive: 30,     // time to live after knife round or all players being ready
                timeToKnife: 5, // time to knife round
            }
        }
        this.init();
    }

    init() {

        this.spInterface.http.get("/match", (req, res) => {
            res({ status: 200, body: JSON.stringify(this.spInterface.match) });
        });
        // onReady(this.spInterface, () => {
        //     this.spInterface.message(`{lightPurple}[MatchPoint]{white} All players are ready!`)
        // })

        this.loadMatch()
    }

    loadMatch = () => {
        this.spInterface.match.status = "warmup"
        this.spInterface.rcon(readFileSync("./plugins/matchpoint/cfg/warmup.cfg", "utf8").split("\n"))
        this.spInterface.rcon([ "mp_warmup_pausetimer 0", "mp_warmuptime "+ this.spInterface.match.config.timeToStart])
        this.spInterface.rcon("mp_teamname_1 \"" + this.spInterface.match.teams[0].name + "\"")
        this.spInterface.rcon("mp_teamname_2 \"" + this.spInterface.match.teams[1].name + "\"")
        this.spInterface.message(`{lightPurple}[MatchPoint] {white}Match is loaded!`)

        setTimeout(() => {this.spInterface.on("matchScoreUpdate", (eventData) => {
            if (eventData.roundPlayed == -1) return
            this.spInterface.log(eventData.roundPlayed)
            this.spInterface.message([`{lightPurple}[MatchPoint] {red}Match is canceled and an admin is notified!`])
            this.spInterface.off("matchScoreUpdate", "tts-ended")
            
            this.spInterface.log(`Match - ${this.spInterface.match.teams[0].name} vs ${this.spInterface.match.teams[1].name} - Map ${this.spInterface.match.teams[0].score+this.spInterface.match.teams[1].score+1}/${this.spInterface.match.maps.length}: ${this.spInterface.match.maps[0].name} - Not all players were ready, match was canceled. Players ready: ${resetReady(this.spInterface).map((id) => this.spInterface.player.list().filter((p) => p.steamid == id)[0].name).join(", ")}`)
            this.spInterface.rcon(["mp_warmup_pausetimer 1", "mp_warmup_start"])
        }, "tts-ended")}, 1000)

        onReady(this.spInterface, () => {
            this.spInterface.off("matchScoreUpdate", "tts-ended")
            this.spInterface.rcon([ "mp_warmup_pausetimer 0", "mp_warmuptime " + this.spInterface.match.config.timeToKnife])
            this.spInterface.message(`{lightPurple}[MatchPoint] {white}Knife round starting in ${this.spInterface.match.config.timeToKnife} secounds!`)
            setTimeout(() => {
                enablePause(this.spInterface)
                startKnife(this.spInterface, (winningTeam, choosenSide) => {
                    disablePause(this.spInterface)
                    this.spInterface.match.maps[this.spInterface.match.teams[0].score+this.spInterface.match.teams[1].score].startingCT = (choosenSide == "CT")? winningTeam.name : this.spInterface.match.teams.filter((team) => team.name != winningTeam.name)[0].name 
                    this.spInterface.log(`Match - ${this.spInterface.match.teams[0].name} vs ${this.spInterface.match.teams[1].name} - Map ${this.spInterface.match.teams[0].score+this.spInterface.match.teams[1].score+1}/${this.spInterface.match.maps.length}: ${this.spInterface.match.maps[0].name} - ${winningTeam.name} won the knife round and chose ${choosenSide} side.`)
                    this.spInterface.message(`{lightPurple}[MatchPoint] {white}${winningTeam.name} won the knife round and chose ${choosenSide} side!`)
                    this.spInterface.message(`{lightPurple}[MatchPoint] {white}Match is starting in ${this.spInterface.match.config.timeToLive} secounds!`)
                    this.spInterface.rcon(["mp_restartgame 1","mp_warmup_pausetimer 0", "mp_warmuptime "+ this.spInterface.match.config.timeToLive, "mp_team_intro_time 6.5", ...readFileSync("./plugins/matchpoint/cfg/live.cfg", "utf8").split("\n")])
                    // setTimeout(() => {
                    //     enablePause(this.spInterface)
                    //     startLive(this.spInterface, () => {})
                    // }, (this.spInterface.match.config.timeToLive * 1000)-1000)
            })
            }, (this.spInterface.match.config.timeToKnife * 1000)-1000)
            
        })
        this.spInterface.on("teamSideUpdate", (team) => {
            this.spInterface.match.teams.filter((t) => t.name == team.teamname)[0].side = team.side
        })

    }

}