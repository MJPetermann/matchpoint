## MatchPoint [WIP]

**A comprehensive tournament management platform for CS2, powered by Node.js, Vue.js, and [Log2Mod](https://github.com/MJPetermann/log2mod).**

MatchPoint is the central hub for your CS2 tournaments. Designed to simplify the organization, execution, and tracking of competitions, MatchPoint offers an intuitive web interface for players and powerful tools for administrators. Integrated with **Log2Mod**, it enables semi-automated tournament handling directly on your game servers.

-----

### ✨ **Features at a Glance:**

**For Participants (Dashboard):**

  * **Intuitive Map Veto Interface:** A fair and straightforward veto system for all matches.
  * **Dynamic Tournament Bracket:** Track your team's progress and the entire tournament flow in real-time.
  * **Direct Server Connection:** Quickly copy the server IP to join your match.
  * **Match Notifications:** Receive alerts when your match is about to begin.
  * **Season Leaderboard:** Keep an eye on your standing and compete for top spots leading to the Season Finals.
  * **Steam Login:** Fast and secure authentication via your Steam account.

**For Administrators:**

  * **Easy Tournament Creation:** Quickly define new cups with customizable settings.
  * **Flexible Bracket Management:** Create, edit, and manage tournament brackets (single elimination, etc.) with ease.
  * **Semi-Automated Match Execution:** After the map veto, server configurations and match details are automatically sent to the CS2 server.
  * **Match Status Monitoring:** Real-time updates on match progress directly from live matches.
  * **Season Management:** Manage yearly seasons and track team performance across multiple tournaments, leading up to the grand finals.
  * **Call-Admin Function:** Receive instant notifications (e.g., via Discord) for in-match issues.
  * **Match Recovery:** Ability to restore matches to their last known state after server crashes or restarts.
  * **Replay Download:** Provide demo downloads directly after match completion.

-----

### 💻 **Technologies:**

  * **Frontend:** Vue.js
  * **Backend:** Node.js (Express.js)
  * **Database:** PostgreSQL (for structured data)
  * **Real-time Communication:** WebSockets (Socket.IO)
  * **Integration:** HTTP API communication with **Log2Mod**
  * **Authentication:** Steam OpenID / OAuth


-----

### 🤝 **Contributing:**

We welcome contributions\! If you find bugs or have feature suggestions, please open an issue or submit a pull request.

-----

### 📄 **License:**

This project is licensed under the MIT License.
