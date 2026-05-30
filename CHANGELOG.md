# Changelog — Yukon (Client)

Human-readable, organized history of the Yukon game **client** (Phaser 3 browser game).
Synthesized from the git history (~1,209 commits, Oct 2020 → Aug 2025). Grouped by release
(version bumps are tagged `x.y.z-beta`). Highlights only — see `git log` for every commit.

Versioning: `MAJOR.MINOR.PATCH-beta`. The project has been in `-beta` its entire life.

---

## [1.11.0-beta] — 2025-08-23 (current)

Theme: **memory management overhaul, audio, and loading polish.** The largest single release,
focused on eliminating texture/VRAM leaks (the long-standing "GPU crash on big servers" problem)
and making asset loading deterministic.

### Memory & performance
- New texture/animation lifecycle system: `MemoryManager` + `TextureTracker`/`AnimTracker`
  unified under a shared `KeySetTracker`.
- Added a `trackSetTexture` patch (new lightweight "patches" system) so textures are tracked at
  use time and unloaded when no longer referenced.
- `collectUsedTextures`-based cleanup; simplified `memory.register` across all loaders.
- Single shared instances for clothing/paperdoll loaders (no more duplicate loaders).
- Removed the global load-queue system; handle anims directly in `PackFileLoader`.
- Unload postcards, paperdolls, room music/audio, and widgets on scene/room/game destroy.
- Lower memory `cleanupDelay`; removed `MetricsManager`.

### Audio (Howler)
- Play item sounds and emote sounds; loading sounds for clothing extras.
- Allow multiple items to share one item-sound config; sounds added to `build-crumbs`.
- Unload audio and room-scene music on teardown; guard `soundManager` before play/stop.

### Scenes & widgets framework
- New base classes: `BaseUnloadableScene`, `BaseLayer`, `BaseWidget`, `BaseDynamicWidget`.
- Migrated `GameScene`/`RoomScene` and all widgets (Map, Buddy, Phone, PlayerCard, Waddle,
  books, ninja widgets, quizzes, Missions, FindFour, Mancala, NinjaProgress) to the new
  unloadable/dynamic-widget system with proper teardown (tweens/timers destroyed on close).
- `WidgetManager` centralizes widget loading/management; widget preload config moved to
  `widgets.json`.
- Base game objects use fixed references instead of getters; scenes added before `Boot`.

### Fixes
- Improved room & game loading, fixed race conditions and made loading messages accurate.
- Fixed sending postcards, penguin consts, `world.setColor` on the login screen, igloo map open,
  catalog coins/closing bugs, Find Four timer event leaks.
- Split the Sensei widget into widget + character prefabs.

---

## [1.10.0-beta] — 2024-10-06

Theme: **Agent (EPF/Missions) HQ, Ruffle integration, scene reorg.**

- Added the **Agent HQ** room, missions interface (mission list, scrolling, info, switch sound),
  Sport Shop, and HQ sports screen.
- **Ruffle** (Flash emulator) controller: open SWF games with custom paths, join-room handling,
  prompt/DOM depth sorting, sleeping, color fetching fixes, buy-inventory handler.
- Reorganized the `scenes/` folder; updated InterfaceController scene management.
- `SimpleButton`/`Zone` work with Phaser Editor hit areas; zones work with moving containers.
- `style-loader` added for critical styles; updated `game.js` scale config; `build-crumbs` update.

---

## [1.9.0-beta] — 2024-03-21

- Updated to the latest Phaser (3.80.x line) and fixed related bugs.
- Pet/puffle client features to match the new server pet system.
- General package updates and bug fixes.

---

## [1.8.0-beta] — 2024-01-06

- Mail/postcard client improvements (system mail, awards postcards) to match server mail system.
- Card-Jitsu client polish.

---

## [1.7.0-beta] — 2023-11-17

- Sled Racer client fixes; Puck (hockey) support.
- Stability fixes paired with the server "server-crash" hardening.

---

## [1.6.0-beta] — 2023-10-25

- Card-Jitsu (and Sensei) client gameplay: cards, power cards, ninja progress UI, deck handling.
- Upgrade to Phaser 3.60 and related bug fixes (community PR #10).

---

## [1.5.0-beta] — 2022-11-07

- Board games: **Mancala** and **Find Four** client scenes and networking.
- Waddle (game lobby) UI and flow.

---

## [1.4.0-beta] — 2022-08-22

- Moved all static game data handling to JSON crumbs; crumbs merged into a single object.
- Igloo editing (furniture placement, flooring, music), open-igloo directory UI.
- Build/packaging cleanup (webpack, obfuscation option).

---

## [1.3-beta] — 2022-03-09  ·  [1.2-beta] — 2022-01-28  ·  [1.1.7-beta] — 2022-01-23

Early content + infrastructure build-out:
- Rooms, penguin movement/pathfinding, clothing/paperdoll rendering, inventory & catalogs.
- Buddy list, ignore list, player cards, chat + safe chat + emotes + snowballs.
- Login/penguin-select/server-select menus; account-creation site (`create/`).
- Webpack build pipeline, `build-crumbs`, font loading, Howler audio foundation.
- Phaser version bumps; misc community fixes (PRs #1, #2, #5).

---

## [Initial] — 2020-10-10

Initial commit. Project bootstrapped on Phaser 3 + Socket.IO client.

---

### Notes for maintainers
- Version is injected at build time from `package.json` via webpack `DefinePlugin` (`VERSION`).
- Tags exist through `1.10.0-beta`; `1.11.0-beta` is set in `package.json` (HEAD) and may be
  untagged locally.
- This fork (`itay1213141/yukon`) tracks upstream `wizguin/yukon` with no extra local commits yet.
