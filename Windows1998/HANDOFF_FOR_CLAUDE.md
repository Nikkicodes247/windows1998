# Technical Handoff Report for Claude
## Sharma-ji's PC — The Abandoned Computer
**Event**: Gandhi Hackathon, OpenLake × Meraz, IIT Bhilai  
**Problem Statement**: *The Abandoned Computer*  
**Auditor**: Senior Software Architect  
**Date**: November 1, 2026  
**Document**: `HANDOFF_FOR_CLAUDE.md`  

---

## 1. Project Inventory

### Workspace File Tree
The project workspace is located at `c:\Users\NIKHIL\Desktop\Windows1998`. All files exist and have been statically verified.

```
c:\Users\NIKHIL\Desktop\Windows1998\
├── index.html                    (14,792 bytes — Root HTML entry point & shell)
├── README.md                     (3,448 bytes — Hackathon documentation & story bible)
├── css/
│   └── os.css                    (10,526 bytes — Complete retro Windows 98 CSS stylesheet)
├── js/
│   ├── boot.js                   (5,619 bytes — Power-on, BIOS, POST, splash, login, reboot)
│   ├── egg.js                    (892 bytes — Easter egg registry and tracker)
│   ├── fs.js                     (13,002 bytes — Virtual hierarchical file system tree)
│   ├── main.js                   (22,396 bytes — Desktop controller, clock, screensaver, tray)
│   ├── popup.js                  (3,814 bytes — Retro modal dialog and notification engine)
│   ├── sound.js                  (4,903 bytes — Synthesized Web Audio API sound system)
│   ├── specs.js                  (3,397 bytes — Specs assistant character bubble & triggers)
│   ├── wm.js                     (6,974 bytes — Window Manager & early Apps registry)
│   └── apps/
│       ├── charkha.js            (5,672 bytes — Charkha-gotchi Tamagotchi wheel app)
│       ├── chat.js               (3,982 bytes — DesiChat 99 ICQ-style chat messenger)
│       ├── datepicker.js         (10,592 bytes — Swaraj Date & Time Properties app)
│       ├── defrag.js             (4,275 bytes — Disk Defragmenter animated cluster grid)
│       ├── dialup.js             (4,275 bytes — Desi Net 33.6 kbps dial-up connector)
│       ├── dos.js                (8,824 bytes — MS-DOS Prompt CLI interpreter)
│       ├── explorer.js           (5,974 bytes — Windows Explorer file manager)
│       ├── ie.js                 (15,052 bytes — Internet Explorer with Cyber Café timer)
│       ├── kbc.js                (9,673 bytes — Kaun Banega Crorepati 7-question quiz)
│       ├── minesweeper.js        (9,404 bytes — Minesweeper 9x9 with salt mines & xyzzy cheat)
│       ├── notepad.js            (4,787 bytes — Notepad text editor & love letter trigger)
│       ├── outlook.js            (10,522 bytes — Outlook Express email client with drafts)
│       └── snake.js              (6,958 bytes — Snake II Nokia-green LCD canvas game)
└── pages/
    ├── geocities.html            (570 bytes — Sharma-ji's GeoCities Home Page)
    ├── results.html              (327 bytes — Board Examination Results 1999)
    └── search.html               (446 bytes — Bhilai Search 1998 engine)
```

### File Categories
* **HTML Files (4)**: `index.html`, `pages/search.html`, `pages/geocities.html`, `pages/results.html`.
* **CSS Files (1)**: `css/os.css`.
* **JavaScript Files (21)**:
  * OS Core (6): `sound.js`, `popup.js`, `egg.js`, `wm.js`, `boot.js`, `main.js`.
  * Virtual FS & Assistant (2): `fs.js`, `specs.js`.
  * Part 2 Applications & Games (8): `notepad.js`, `explorer.js`, `snake.js`, `minesweeper.js`, `kbc.js`, `dos.js`, `defrag.js`, `charkha.js`.
  * Part 3 Applications (5): `ie.js`, `outlook.js`, `chat.js`, `dialup.js`, `datepicker.js`.
* **Documentation (1)**: `README.md`.
* **Git Repository**: Initialized at `.git`, tracked against `https://github.com/Nikkicodes247/windows1998.git`.
* **Temporary Audit Files**: Located strictly in the parent scratch directory (`C:\Users\NIKHIL\.gemini\antigravity\brain\...\scratch\`), not in the workspace root.
* **Missing Files from Specification**: **None**. All 27 required files from `prompt_full.txt` exist in their exact prescribed locations.

---

## 2. Architecture Understanding

All three parts communicate strictly through global APIs attached to `window`. No module bundler, npm, or build step is used.

### Global Contracts Matrix

| Component | Implementing File | Responsibility | Public API Methods | Dependents | Contract Status |
|---|---|---|---|---|:---:|
| **WM** | `js/wm.js` | Window creation, title bar controls, z-order, taskbar button synchronization, drag movement | `open(opts)`, `close(id)`, `focus(id)`, `isOpen(id)`, `getAll()`, `minimize(id)` | All 15 apps, `main.js` | **IMPLEMENTED** |
| **Apps** | `js/wm.js` *(reused in `js/main.js`)* | Central registry of executable applications and dispatcher | `register(name, def)`, `launch(name, opts)`, `get(name)` | All 15 apps, `explorer.js`, `index.html`, `main.js` | **IMPLEMENTED** |
| **FS** | `js/fs.js` | In-memory virtual hierarchical directory tree with metadata and file content | `root`, `get(path)`, `list(path)` | `explorer.js`, `dos.js` | **IMPLEMENTED** |
| **Popup** | `js/popup.js` | Win98 styled modal dialogs, error alerts, info prompts, and staggered error storm | `error(opts)`, `info(opts)`, `warn(opts)`, `confirm(opts)`, `storm(n)` | `boot.js`, `main.js`, `notepad.js`, `snake.js`, `minesweeper.js`, `kbc.js`, `charkha.js`, `datepicker.js`, `ie.js` | **IMPLEMENTED** |
| **Sound** | `js/sound.js` | Pure Web Audio API procedural sound synthesizer (unlocks on first user gesture) | `unlock()`, `isUnlocked()`, `setMuted(m)`, `isMuted()`, `beep(f, ms)`, `modem()`, `chime()`, `uhoh()`, `error()`, `siren()` | `boot.js`, `main.js`, `snake.js`, `minesweeper.js`, `kbc.js`, `charkha.js`, `chat.js`, `dialup.js` | **IMPLEMENTED** |
| **Egg** | `js/egg.js` | Easter egg progression tracking, discovery registry, unlock notifications | `total`, `unlock(id, label)`, `isUnlocked(id)`, `list()`, `count()`, `reset()` | All apps, `boot.js`, `main.js`, `specs.js`, `explorer.js` | **IMPLEMENTED** |
| **Clock** | `js/main.js` | Virtual OS clock starting at 31 Dec 1999, 11:57 PM and ticking forward | `set(y, m, d, h, min)`, `get()`, `start()`, `stop()` | `datepicker.js`, `tray-clock` | **IMPLEMENTED** |
| **Specs** | `js/specs.js` | Original round spectacles assistant character bubble (`🤓`) offering contextual humor | `say(text, choices)`, `hide()`, `loveLetter()`, `ieOpen()`, `minesweeperLost()` | `notepad.js`, `ie.js`, `minesweeper.js`, `main.js` | **IMPLEMENTED** |
| **Boot** | `js/boot.js` | POST sequence, BIOS setup screen, splash animation, password prompt, login, and reboot | `start()`, `loginOK()`, `loginCancel()`, `reboot()` | `main.js`, `index.html` | **IMPLEMENTED** |
| **Desktop** | `js/main.js` | Desktop shell, icon manager, Start menu, Run dialog, BSOD wizard, shutdown orchestration | `init()`, `toggleStart()`, `closeStart()`, `showRun()`, `execRun()`, `shutDown()`, `scannerWizard()`, `properties()`, `aboutWindows()`, `showHelp()`, `volumeSlider()` | `index.html`, `boot.js` | **IMPLEMENTED** |

---

## 3. Part 1: OS Core Status

Static code inspection of `index.html`, `css/os.css`, `js/sound.js`, `js/popup.js`, `js/egg.js`, `js/wm.js`, `js/boot.js`, and `js/main.js`:

| Feature | Status | Supporting Files & Symbols | Description & Verification Evidence |
|---|:---:|---|---|
| **Power-on Screen** | IMPLEMENTED | `index.html:13`, `js/main.js:581` | `#power-off-screen` with `#power-on-btn`. Calls `Sound.unlock()` and `Boot.start()`. |
| **BIOS POST** | IMPLEMENTED | `js/boot.js:16`, `css/os.css:16` | `biosPost()` in `boot.js`. Prints Sharma-ji Computers 64 MB RAM test, drive info, beeps, listens for DEL key, auto-advances in 3500ms. |
| **DEL BIOS Setup** | IMPLEMENTED | `js/boot.js:63`, `index.html:24` | `biosSetup()` in `boot.js`. Shows `#bios-setup` with boot order `1. Floppy (empty), 2. CD, 3. Hope` (Egg #1). ESC key resumes boot. |
| **Win98 Splash** | IMPLEMENTED | `js/boot.js:93`, `index.html:43` | `splashScreen()`. 4-color Win98 logo, progress bar, plays `Sound.chime()`. Advances to login screen. |
| **Login & Password** | IMPLEMENTED | `js/boot.js:112`, `index.html:61` | `loginScreen()`, `Boot.loginOK()`, `Boot.loginCancel()`. Any password logs in. Cancel unlocks Egg #2. 3 wrong inputs reveal `"Hint: ask Papa"` (Egg #3). |
| **Desktop Icons** | IMPLEMENTED | `js/main.js:37`, `js/main.js:296` | 11 icons rendered into `#desktop-icons`. Single click selects; double click launches `Apps.launch()`. |
| **Window Manager** | IMPLEMENTED | `js/wm.js:8`, `css/os.css:122` | `WM.open()`, `WM.close()`, `WM.focus()`, `WM.isOpen()`. Creates `.window.wm-window` in `#windows-layer`. |
| **Window Drag & Focus** | IMPLEMENTED | `js/wm.js:66`, `js/wm.js:155` | Mouse event listeners on title bar update `left`/`top` while clamped to screen; clicks increase `zIndex`. |
| **Minimise & Maximise** | IMPLEMENTED | `js/wm.js:122`, `js/wm.js:136` | Title bar buttons toggle `.minimized` (hides window, dims taskbar btn) and `.maximized` (full viewport). |
| **Taskbar** | IMPLEMENTED | `index.html:107`, `css/os.css:76` | Fixed bottom bar `#taskbar` containing Start button, `#taskbar-windows`, volume icon, and `#tray-clock`. |
| **Start Menu** | IMPLEMENTED | `index.html:124`, `js/main.js:364` | `Desktop.toggleStart()`, `Desktop.closeStart()`. Sidebar with vertical Windows 98 text and cascading menus. |
| **Programs & Accessories**| IMPLEMENTED | `index.html:130-158` | Hover-activated cascading submenus pointing to Notepad, Scanner Wizard, Discoveries, Games, IE, Outlook, DOS. |
| **Control Panel** | IMPLEMENTED | `index.html:165` | Start menu item invoking `Apps.launch('datepicker')`. |
| **Run Dialog** | IMPLEMENTED | `js/main.js:385`, `index.html:180` | `Desktop.showRun()`, `Desktop.execRun()`. Special handlers for `"bapu"` (Egg #4), `"salt"` (Egg #5), `"mummy"` (Egg #6). |
| **Tray Clock** | IMPLEMENTED | `js/main.js:25`, `index.html:119` | `Clock.start()` ticks 1s starting from 31 Dec 1999, 11:57 PM. Clicking opens date picker (Egg #8). |
| **Volume Slider** | IMPLEMENTED | `js/main.js:158`, `index.html:200` | `#tray-volume` toggles popup. `#vol-slider-handle` mouseover jumps randomly (Egg #7). Mute toggles `Sound.setMuted()`. |
| **Screensaver** | IMPLEMENTED | `js/main.js:88`, `index.html:220` | `startScreensaver()` after 45s idle. Canvas draws rotating, drifting Charkhas (Egg #9). Key/mouse stops it. |
| **Scanner Wizard BSOD** | IMPLEMENTED | `js/main.js:451`, `index.html:211` | `Desktop.scannerWizard()`. Full-screen `#bsod-screen` with General Protection Fault (Egg #10). Any key returns. |
| **Y2K_Panic.exe** | IMPLEMENTED | `js/main.js:179`, `index.html:223` | 10-second countdown to 1 Jan 2000, Web Audio siren, screen flash, and safe recovery (Egg #14). |
| **Shut Down** | IMPLEMENTED | `js/main.js:423`, `index.html:229` | `Desktop.shutDown()`. Unlocks Egg #11, runs `Popup.storm(5)`, shows `#shutdown-screen` ("safe to turn off"). Click reboots. |
| **Discoveries.exe** | IMPLEMENTED | `js/main.js:246` | Shows `Egg.count() / Egg.total`, lists all 30 eggs with green checks or locked status. |
| **About Windows** | IMPLEMENTED | `js/main.js:476` | Dialog showing registered user "Sharma-ji", "64 MB RAM (and 1 Mummy)", and 3.2 GB HDD. |
| **Mobile Warning** | IMPLEMENTED | `index.html:238`, `css/os.css:168` | Shows `#mobile-warning` dialog if viewport width is under 700px. |

---

## 4. Part 2: Apps and Games Status

Static inspection of `js/apps/notepad.js`, `explorer.js`, `snake.js`, `minesweeper.js`, `kbc.js`, `dos.js`, `defrag.js`, and `charkha.js`:

### 1. Notepad (`js/apps/notepad.js`)
* **Main Functionality**: Text editor with document title and textarea body.
* **Available Interactions**: File menu (Open, Save, Exit), Edit menu (Undo, Select All), text typing. Save displays warning: *"Sharma-ji will find out."*
* **Relevant Easter Eggs**: Opening `love_letter_DRAFT7.txt` triggers Specs assistant with *"Make it worse / Make it Hinglish / Ask Mummy"* (Egg #25).
* **Integration Dependencies**: `WM.open`, `WM.close`, `Popup.info`, `Popup.warn`, `Specs.loveLetter`.
* **Implemented Features**: Loading files via `opts.file`, custom menu bar dropdowns, textarea resizing, Specs love letter trigger.
* **Partially Implemented**: File -> Open displays an info prompt instructing user to use Explorer (intentional design per spec).
* **Missing Features**: None based on specification.
* **Possible Issues Visible**: None.

### 2. Windows Explorer (`js/apps/explorer.js`)
* **Main Functionality**: Hierarchical directory browser and file launcher over `FS`.
* **Available Interactions**: Address bar entry with Enter key, Back button, View -> "Show hidden files" toggle, double-clicking folders to traverse, double-clicking `..` to go up, double-clicking files to launch.
* **Relevant Easter Eggs**:
  * View -> "Show hidden files" reveals `rahul_never_sent.txt` (Egg #19).
  * Double-clicking `Pinball.exe` unlocks Egg #17 (*"Please insert the Windows 98 CD"*).
  * Double-clicking `titanic_1997.jpg` unlocks Egg #18 (*"Not enough memory"*).
  * Double-clicking `most_wanted_list.jpg` unlocks Egg #16 (*"Wanted: Minesweeper record holder"*).
  * Double-clicking `9-11-attack-planning.pdf` unlocks Egg #15 (*"Operation Samosa"*).
* **Integration Dependencies**: `WM.open`, `WM.close`, `FS.list`, `FS.get`, `Apps.launch`, `Egg.unlock`.
* **Implemented Features**: Complete navigation history, path display, folder and file icons, single-click selection highlight.
* **Partially Implemented**: None.
* **Missing Features**: None.
* **Possible Issues Visible**: None.

### 3. Snake II (`js/apps/snake.js`)
* **Main Functionality**: Nokia 3310 LCD-style Snake game on HTML5 canvas.
* **Available Interactions**: Arrow keys to turn, Spacebar to start/restart, collect salt crystals (🧂).
* **Relevant Easter Eggs**: Reaching length 12 triggers *"Dandi reached: 390 km"* (Egg #21) and an achievement popup.
* **Integration Dependencies**: `WM.open`, `WM.isOpen`, `Sound.beep`, `Egg.unlock`, `Popup.info`.
* **Implemented Features**: 20x20 cell grid, green palette (`#9bbc0f`, `#306230`), speed scaling every 3 crystals, game-over screen, window close cleanup timer.
* **Partially Implemented**: None.
* **Missing Features**: None.
* **Possible Issues Visible**: None.

### 4. Minesweeper (`js/apps/minesweeper.js`)
* **Main Functionality**: Authentic 9x9 beginner Minesweeper grid with 10 hidden salt mines (🧂).
* **Available Interactions**: Left-click to reveal cell, right-click to flag (🚩), smiley face button to reset, live timer and mine count display.
* **Relevant Easter Eggs**: Typing `xyzzy` on the keyboard reveals a 3x3 indicator pixel in the top-left corner that turns black when hovering over a mine and white over safe cells (Egg #20).
* **Integration Dependencies**: `WM.open`, `WM.isOpen`, `Sound.error`, `Sound.chime`, `Popup.error`, `Popup.info`, `Specs.minesweeperLost`, `Egg.unlock`.
* **Implemented Features**: First-click safety guarantee, recursive 0-cell flood fill, win condition detection (*"Swaraj achieved!"*), loss detection (*"Salt tax detected"*).
* **Partially Implemented**: None.
* **Missing Features**: None.
* **Possible Issues Visible**: None.

### 5. KBC Quiz (`js/apps/kbc.js`)
* **Main Functionality**: 7-question Kaun Banega Crorepati trivia game about Sharma-ji's PC, progressing to ₹1 Crore.
* **Available Interactions**: Selecting options A, B, C, D; *"Lock kiya jaye?"* confirmation prompt; 3 lifelines.
* **Relevant Easter Eggs**: Final question (Q7: *"Which button do you click to shut down Windows 98?"*) has all four options reading *"Start"* (Egg #22).
* **Integration Dependencies**: `WM.open`, `WM.close`, `Sound.modem`, `Sound.chime`, `Sound.error`, `Popup.info`, `Popup.error`, `Egg.unlock`.
* **Implemented Features**:
  * Phone-a-Friend: Plays modem audio, reports busy twice, then friend advises *"Press Start"*.
  * 50-50: Disables two wrong options on first use; displays *"Technical glitch"* on second use.
  * Audience Poll: Bars show 100% for C (*"cyber café guy said so"*).
* **Partially Implemented**: None.
* **Missing Features**: None.
* **Possible Issues Visible**: None.

### 6. MS-DOS Prompt (`js/apps/dos.js`)
* **Main Functionality**: Black window CLI prompt with `C:\>` path and command history.
* **Available Interactions**: Keyboard typing, Enter to execute, Up/Down arrow keys for command history.
* **Relevant Easter Eggs**:
  * `date` command responds: *"Invalid date. Referred to the Committee. Next meeting in 17 meetings."* (Egg #23).
  * `format c:` warns user, prompts Y/N, displays fake progress to 100%, then prints *"Just kidding. Papa will find out."* (Egg #24).
* **Integration Dependencies**: `WM.open`, `WM.close`, `FS.list`, `FS.get`, `Egg.unlock`.
* **Implemented Features**: Supports `dir`, `cd`, `type`, `ver` (*"Windows 98 [Sharma-ji Edition]"*), `gandhi` (ASCII spectacles art), `salt` (*"Tax: 2 rupees"*), `win` (*"Did you mean: sleep?"*), `cls`, `help`, and `exit`.
* **Partially Implemented**: None.
* **Missing Features**: None.
* **Possible Issues Visible**: None.

### 7. Disk Defragmenter (`js/apps/defrag.js`)
* **Main Functionality**: Windows 98 Disk Defragmenter simulation showing drive cluster re-arrangement.
* **Available Interactions**: Start button initiates defragmentation.
* **Relevant Easter Eggs**: None assigned directly by number in Bible, but status line displays: *"Defragmenting India... moving 1947 clusters... salt tax errors: 0"*.
* **Integration Dependencies**: `WM.open`, `WM.isOpen`.
* **Implemented Features**: Grid of 384 cluster cells (32x12), animated progress bar, clusters turning solid blue, completion notification.
* **Partially Implemented**: None.
* **Missing Features**: None.
* **Possible Issues Visible**: None.

### 8. Charkha-gotchi (`js/apps/charkha.js`)
* **Main Functionality**: Tamagotchi-inspired virtual spinning wheel with happiness decay.
* **Available Interactions**: Clicking *"Spin the Charkha!"* spins the CSS wheel, plays frequency beeps, and boosts happiness.
* **Relevant Easter Eggs**: If left unspun for 10 seconds, status changes to *"😢 Your Charkha-gotchi has quit India"*, happiness falls to 0, button locks, and a popup appears.
* **Integration Dependencies**: `WM.open`, `WM.isOpen`, `Sound.beep`, `Popup.info`.
* **Implemented Features**: CSS animated wheel with 12 rotating spokes, live happiness progress bar, 10-second neglect timer, background happiness decay interval.
* **Partially Implemented**: None.
* **Missing Features**: None.
* **Possible Issues Visible**: None.

---

## 5. Part 3: Content, Internet and Date Picker

Static inspection of `js/fs.js`, `js/specs.js`, `js/apps/ie.js`, `js/apps/outlook.js`, `js/apps/chat.js`, `js/apps/dialup.js`, `js/apps/datepicker.js`, and `pages/*.html`:

### Virtual File System (`js/fs.js`)
* **Hierarchical Tree**: Complete structure with `FS.root`, `FS.get(path)`, `FS.list(path)`.
* **Standard Files**:
  * `love_letter_DRAFT7.txt`: *"Dear Anjali, my heart is like Windows 98..."*
  * `9-11-attack-planning.pdf`: Operation Samosa canteen infiltration plan.
  * `dandi_march_project_FINAL_FINAL_REAL.doc`: 12-word school project with *"TODO: walk 390 km"*.
  * `y2k_survival_plan.txt`: Sharma-ji's 10-point Y2K checklist.
  * `passwords.txt`: List of passwords (`gandhi123`, `gandhi1234`, `gandhi@123`).
  * `mummy_dont_touch.txt`: Rules from Papa about the computer and mouse ball.
  * `most_wanted_list.jpg`: ASCII poster for the 0:01 Minesweeper record holder.
  * `news_clipping_2001.jpg`: Article regarding ₹3,000 cyber café bill.
  * `titanic_1997.jpg`: Image failure dialog text.
  * `cricket_sharjah_1998.avi`: 4 MB video file estimated to take 3 days to download.
  * `Pinball.exe`: CD prompt text.
  * `Free_100_Hours.exe`: ISP maintenance since 1999 message.
* **Hidden Files**: `C:\Windows\System\rahul_never_sent.txt` with `hidden: true` (*"Anjali, I am writing this on 31 Dec 1999 so you never see it..."*).

### Specs Assistant (`js/specs.js`)
* Fixed bottom-right dialog containing spectacles avatar `🤓` and speech bubble.
* Character click counter triggers dialogue after 5 clicks.
* Exposes `Specs.loveLetter()` (Egg #25), `Specs.ieOpen()`, and `Specs.minesweeperLost()`.

### Desi Net Dial-Up (`js/apps/dialup.js`)
* Procedural Web Audio modem handshake simulation (`Sound.modem()`).
* Connect attempts 1 & 2 disconnect with *"Mummy picked up the phone. Disconnected."* (Egg #28).
* Attempt 3 connects at 33.6 kbps, sets internal `connected = true`, and invokes callback.
* Exposes `isConnected: function() { return connected; }` on `Apps.register` descriptor.

### Internet Explorer (`js/apps/ie.js`)
* Verifies `dialupApp.isConnected()` before opening; launches dial-up dialog if disconnected.
* Cyber café timer starts at 03:00 (₹30/hour); at zero prompts *"Time up. Add ₹10?"* (Egg #29).
* **Pages Rendered**:
  * **Search (`pages/search.html` / inline)**: Bhilai Search with dodging *"I'm Feeling Lucky"* button (Egg #26) and fake search results.
  * **GeoCities (`pages/geocities.html` / inline)**: Under-construction banner, marquee, visitor counter starting at 000007 and incrementing, guestbook, WebRing.
  * **Board Results (`pages/results.html` / inline)**: Displays *"Server busy"* for 3 attempts, then displays Rahul Sharma's mark sheet showing *"PASS (grace marks applied)"* in Mathematics (Egg #27).

### Outlook Express (`js/apps/outlook.js`)
* Inbox contains 5 realistic period emails: Y2K survival forward, Nokia 3310 scam, chain mail curse, ₹3,000 café bill, and MAILER-DAEMON delivery failure (*"Mailbox full: Papa's forwards"*, Egg #30).
* Drafts folder contains Rahul's unsent email to Anjali.

### DesiChat 99 (`js/apps/chat.js`)
* Contact list showing `cool_dude_98` (Online) and `xX_Anjali_Xx` (Offline since 1999).
* Bot script delivers delayed messages (`"a/s/l?"`, `"17/m/bhilai"`, etc.) accompanied by `Sound.uhoh()`.

### Swaraj Date Picker (`js/apps/datepicker.js`)
* Year slider (1857 to 2100) with arrow key support.
* Month spinner (Jan–Dec).
* *"Dandi March (+1 day)"* button.
* Hour/minute inputs.
* Special date banners:
  * 15 Aug 1947: *"Tryst with destiny™ confirmed"*
  * 26 Jan: *"The Constitution accepted your request"*
  * 6 Apr 1930: *"Salt law broken. Tax waived."*
  * 2 Oct: *"Dry day"*
  * 30 Jan: *"Martyrs' Day."* (respectful notice)
  * 31 Apr: *"Even the Raj couldn't invent this day"*
* *"Bapu takes pity"* shortcut appears after 90 seconds to jump straight to 15 August 1947.
* Apply/OK updates `Clock.set(...)`, which live-updates the desktop taskbar clock (Egg #8).

---

## 6. All 30 Easter Eggs

Cross-referenced with the Easter Egg Bible in `prompt_full.txt`:

| # | Trigger | Expected Payoff | Source File & Line | Status in Source | Verification Detail |
|---|---|---|---|:---:|---|
| 1 | DEL at BIOS | Boot order: Floppy, CD, "3. Hope" | `js/boot.js:64` | **PRESENT** | Key listener for 'Delete' calls `biosSetup()` and `Egg.unlock(1)`. |
| 2 | Login: Cancel | "Welcome, Guest. Papa is not home." | `js/boot.js:156` | **PRESENT** | `loginCancel()` calls `Egg.unlock(2)` and shows `Popup.info`. |
| 3 | Login: 3 wrong passwords | "Hint: ask Papa" | `js/boot.js:145` | **PRESENT** | `loginAttempts >= 3` shows `#login-hint` and calls `Egg.unlock(3)`. |
| 4 | Run: bapu | Specs appears with non-violence tip | `js/main.js:401` | **PRESENT** | Input 'bapu' in Run dialog calls `Egg.unlock(4)` and `Specs.say`. |
| 5 | Run: salt | "Salt tax: ₹2" | `js/main.js:410` | **PRESENT** | Input 'salt' in Run dialog calls `Egg.unlock(5)` and `Popup.info`. |
| 6 | Run: mummy | "Mummy is calling. Disconnecting." | `js/main.js:418` | **PRESENT** | Input 'mummy' in Run dialog calls `Egg.unlock(6)` and `Popup.warn`. |
| 7 | Tray volume icon | The world's worst volume slider | `js/main.js:164` | **PRESENT** | Mouseover on `#vol-slider-handle` calls `Egg.unlock(7)` and jumps handle. |
| 8 | Taskbar clock | Date/Time opens the Swaraj date picker | `js/apps/datepicker.js:203` | **PRESENT** | Opening datepicker calls `Egg.unlock(8)`. |
| 9 | Idle 45 seconds | Flying Charkhas screensaver | `js/main.js:90` | **PRESENT** | Idle timeout triggers canvas animation and `Egg.unlock(9)`. |
| 10 | Scanner Wizard | BSOD: "Plug and Play detected a scanner." | `js/main.js:462` | **PRESENT** | `Desktop.scannerWizard()` displays BSOD and calls `Egg.unlock(10)`. |
| 11 | Shut Down | Task failed successfully x5, orange screen | `js/main.js:433` | **PRESENT** | `Desktop.shutDown()` calls `Egg.unlock(11)`, `Popup.storm(5)`. |
| 12 | Tab hidden | Title becomes "Mummy is calling" | `js/main.js:352` | **PRESENT** | `visibilitychange` event handler calls `Egg.unlock(12)`. |
| 13 | Open DevTools | "Sharma-ji says: don't touch the console." | `js/main.js:360` | **PRESENT** | Console log and `Egg.unlock(13)` on `Desktop.init`. |
| 14 | Y2K_Panic.exe | 10-second millennium meltdown | `js/main.js:180` | **PRESENT** | `y2kPanic()` starts countdown, siren, screen flicker, `Egg.unlock(14)`. |
| 15 | 9-11-attack-planning.pdf | Operation Samosa (9 November) | `js/apps/explorer.js:127` | **PRESENT** | Double-clicking file in Explorer calls `Egg.unlock(15)`. |
| 16 | most_wanted_list.jpg | Wanted: 0:01 Minesweeper record holder | `js/apps/explorer.js:124` | **PRESENT** | Double-clicking file in Explorer calls `Egg.unlock(16)`. |
| 17 | Pinball.exe | "Please insert the Windows 98 CD" | `js/apps/explorer.js:118` | **PRESENT** | Double-clicking file in Explorer calls `Egg.unlock(17)`. |
| 18 | titanic_1997.jpg | "Not enough memory. Close Paint." | `js/apps/explorer.js:121` | **PRESENT** | Double-clicking file in Explorer calls `Egg.unlock(18)`. |
| 19 | Explorer: show hidden files | rahul_never_sent.txt appears | `js/apps/explorer.js:48` | **PRESENT** | View -> "Show hidden files" toggle calls `Egg.unlock(19)`. |
| 20 | Minesweeper: type xyzzy | The real cheat pixel | `js/apps/minesweeper.js:198` | **PRESENT** | Key buffer matching 'xyzzy' calls `Egg.unlock(20)`. |
| 21 | Snake length 12 | "Dandi reached: 390 km" | `js/apps/snake.js:112` | **PRESENT** | Snake body reaching length 12 calls `Egg.unlock(21)`. |
| 22 | KBC final question | Every option says "Start" | `js/apps/kbc.js:104` | **PRESENT** | Rendering question index 6 calls `Egg.unlock(22)`. |
| 23 | DOS: date | "Referred to the Committee" | `js/apps/dos.js:120` | **PRESENT** | Executing 'date' command calls `Egg.unlock(23)`. |
| 24 | DOS: format c: | "Just kidding. Papa will find out." | `js/apps/dos.js:129` | **PRESENT** | Executing 'format c:' command calls `Egg.unlock(24)`. |
| 25 | Notepad: love letter | Specs offers "Make it worse" | `js/specs.js:78` | **PRESENT** | Opening love letter in Notepad calls `Specs.loveLetter()` and `Egg.unlock(25)`. |
| 26 | IE: Feeling Lucky | The button dodges the cursor | `js/apps/ie.js:193` | **PRESENT** | Mouseover on `#ie-lucky-btn` calls `Egg.unlock(26)` and offsets position. |
| 27 | IE: board results | "PASS (grace marks applied)" | `js/apps/ie.js:250` | **PRESENT** | 4th load of results page reveals mark sheet and calls `Egg.unlock(27)`. |
| 28 | Dial-up | Mummy picks up the landline | `js/apps/dialup.js:74` | **PRESENT** | Attempts 1 & 2 in `dialup.js` call `Egg.unlock(28)`. |
| 29 | Cyber café timer ends | "Time up. Add ₹10?" | `js/apps/ie.js:107` | **PRESENT** | Timer reaching 0 in `ie.js` calls `Egg.unlock(29)` and prompts popup. |
| 30 | Outlook bounce | Mailbox full: Papa's forwards | `js/apps/outlook.js:223` | **PRESENT** | Selecting delivery failure email calls `Egg.unlock(30)`. |

*All 30 Easter eggs are accounted for in `Discoveries.exe` via `Egg.list()` and `Egg.total = 30`.*

---

## 7. Integration and Dependencies

### Exact Script Loading Order in `index.html`
Lines 267–296 of `index.html`:
```html
1.  <script src="js/sound.js"></script>          <!-- Part 1: Core Sound -->
2.  <script src="js/popup.js"></script>          <!-- Part 1: Core Popups -->
3.  <script src="js/egg.js"></script>            <!-- Part 1: Easter Egg Tracker -->
4.  <script src="js/wm.js"></script>             <!-- Part 1: Window Manager & Apps Registry -->
5.  <script src="js/fs.js"></script>             <!-- Part 3: Virtual File System -->
6.  <script src="js/specs.js"></script>          <!-- Part 3: Specs Assistant -->
7.  <script src="js/apps/notepad.js"></script>   <!-- Part 2: Notepad -->
8.  <script src="js/apps/explorer.js"></script>  <!-- Part 2: Explorer -->
9.  <script src="js/apps/snake.js"></script>     <!-- Part 2: Snake II -->
10. <script src="js/apps/minesweeper.js"></script><!-- Part 2: Minesweeper -->
11. <script src="js/apps/kbc.js"></script>       <!-- Part 2: KBC Quiz -->
12. <script src="js/apps/dos.js"></script>       <!-- Part 2: MS-DOS -->
13. <script src="js/apps/defrag.js"></script>    <!-- Part 2: Defrag -->
14. <script src="js/apps/charkha.js"></script>   <!-- Part 2: Charkha-gotchi -->
15. <script src="js/apps/ie.js"></script>        <!-- Part 3: Internet Explorer -->
16. <script src="js/apps/outlook.js"></script>   <!-- Part 3: Outlook Express -->
17. <script src="js/apps/chat.js"></script>      <!-- Part 3: DesiChat 99 -->
18. <script src="js/apps/dialup.js"></script>    <!-- Part 3: Dial-Up -->
19. <script src="js/apps/datepicker.js"></script><!-- Part 3: Date Picker -->
20. <script src="js/boot.js"></script>           <!-- Part 1: Boot Sequence -->
21. <script src="js/main.js"></script>           <!-- Part 1: Main Desktop Controller -->
```

### Critical Integration Architecture
1. **Apps Registry Initialization**: Initialized in `js/wm.js` (Script #4) before application scripts (Scripts #7–#19). Application files safely register without early returning.
2. **Registry Preservation**: In `js/main.js` (Script #21), `if (!window.Apps)` prevents re-declaring the object. All 13 applications remain registered, and `y2k_panic` and `discoveries` are appended.
3. **Dial-Up & IE Communication**: `dialup.js` exposes `isConnected: function() { return connected; }` on the descriptor passed to `Apps.register`. `ie.js` checks `Apps.get('dialup').isConnected()` before opening.
4. **Date Picker & Clock Communication**: `datepicker.js` calls `Clock.set(year, month, day, hour, min)` which updates `clockDate` in `main.js` and immediately updates the taskbar DOM text via `updateClockDisplay()`.
5. **Explorer & Virtual FS**: `explorer.js` calls `FS.list(path)` to obtain children and `FS.get(path)` for node details, then delegates file opening to `Apps.launch(item.app || 'notepad', { file: item })`.
6. **Cross-Module Safety**: All cross-module calls in `boot.js`, `main.js`, and `apps/*` are wrapped in `if (typeof Global !== 'undefined')` checks.

---

## 8. Technical Debt and Remaining Work

### Prioritized Task List

#### P1 — High Priority Functional Refinements
1. **IE Page Navigation via Iframe vs. Inline DOM**:
   * *Module*: `js/apps/ie.js` & `pages/*.html`.
   * *Problem*: The specification notes: *"ie.js: browser chrome loading pages from /pages in an iframe"*. Currently, `ie.js` renders mock pages directly into innerHTML rather than loading `pages/search.html`, `pages/geocities.html`, and `pages/results.html` in an iframe.
   * *Action*: Evaluate whether embedding `pages/*.html` in an `<iframe>` is preferable or if inline rendering provides better styling isolation and state control.
   * *Reference*: `prompt_full.txt` Stage 2A.
2. **Double-click Speed & Touch Support**:
   * *Module*: `js/main.js` & `js/apps/explorer.js`.
   * *Problem*: Desktop and explorer icons rely on native DOM `dblclick`. On touchscreens or mobile browsers, `dblclick` does not consistently fire.
   * *Action*: Add a simple click-time delta check (e.g., `< 350ms`) to support both touch taps and mouse double clicks.

#### P2 — Easter Egg Polish & Edge Cases
3. **Minesweeper Loss Trigger on Specs**:
   * *Module*: `js/apps/minesweeper.js:147`.
   * *Problem*: In `minesweeper.js`, when a mine is hit, `Specs.minesweeperLost()` is called immediately alongside `Popup.error`. The popup can obscure the Specs speech bubble.
   * *Action*: Add a slight delay (`setTimeout(..., 1000)`) before triggering `Specs.minesweeperLost()`.
4. **Dial-up Direct Launch UI**:
   * *Module*: `js/apps/dialup.js:13`.
   * *Problem*: If dial-up is launched directly from Explorer or Start menu while already connected, it silently returns.
   * *Action*: Show a brief notification (`Popup.info`: *"Already connected to Desi Net at 33.6 kbps"*) if opened while `connected === true`.

#### P3 — Visual Polish & Copywriting
5. **Offline Fallback for 98.css**:
   * *Module*: `index.html:7`.
   * *Problem*: `index.html` loads 98.css from `https://unpkg.com/98.css`. The spec requires: *"The website must remain usable if the CDN fails."*
   * *Action*: Verify that `css/os.css` contains sufficient fallback styles for buttons, borders, and window frames if the CDN fails to load.

---

## 9. Deployment Readiness (Vercel Compatibility)

* **Static Architecture**: Plain static HTML/CSS/JS. No build command, no `package.json`, output directory blank.
* **Entry Point**: `index.html` exists in the repository root.
* **Relative Paths**: All asset paths in `index.html`, `os.css`, and JS files use strictly relative paths (`css/os.css`, `js/...`, `pages/...`). No absolute Windows filesystem paths exist in project source code.
* **Case Sensitivity**: All paths match exact on-disk casing: `css/os.css`, `js/sound.js`, `js/apps/notepad.js`, etc. (Crucial for Linux-based Vercel hosting).
* **Git Remote**: Configured and synchronized with `https://github.com/Nikkicodes247/windows1998.git` on branch `main`.

---

## 10. Claude Handoff Summary

### Quick Reference for Claude

1. **What the project is**: A nostalgic Windows 98 replica web app set in Bhilai in late 1999 belonging to the Sharma family. Built for the Gandhi Hackathon ("The Abandoned Computer").
2. **What architecture exists**: A modular vanilla JS architecture using global objects (`WM`, `Apps`, `FS`, `Popup`, `Sound`, `Egg`, `Clock`, `Specs`, `Boot`, `Desktop`).
3. **What has already been implemented**:
   * All 27 required project files.
   * Complete boot flow (power-on, BIOS POST, DEL setup, splash, password login, desktop).
   * All 8 Part 2 apps (Notepad, Explorer, Snake II, Minesweeper, KBC, MS-DOS, Defrag, Charkha-gotchi).
   * All 5 Part 3 apps (IE, Outlook, Chat, Dial-up, Datepicker).
   * All 30 Easter eggs wired to `Egg.unlock(1..30)` and tracked in `Discoveries.exe`.
4. **Critical bugs fixed**:
   * `window.Apps` was moved to `js/wm.js` so all application scripts register properly upon loading.
   * `js/main.js` was modified to reuse the existing `Apps` object.
   * Dial-up connection state is cleanly exposed via `dialupApp.isConnected()` to `ie.js`.
   * `typeof` guards were added across all cross-module calls in `boot.js`, `main.js`, and `apps/*`.
5. **What should NOT be rebuilt**:
   * **DO NOT** rewrite the Window Manager, the Apps registry, or the Virtual File System.
   * **DO NOT** switch to React, Vue, npm, or build tools.
   * **DO NOT** download external audio files, images, or fonts (strict hackathon rule).
6. **What remains to be refined**:
   * Reviewing whether IE should embed `pages/*.html` in an iframe vs. keeping inline DOM rendering.
   * Ensuring 98.css has graceful local CSS fallbacks in `os.css` if CDN is blocked.
   * Double-click mobile touch friendliness.
7. **Which files to inspect first**:
   * `index.html`: Main shell, element IDs, and script order.
   * `js/wm.js`: Window manager and early `Apps` registry initialization.
   * `js/main.js`: Desktop controller, Clock, tray, and set-pieces.
8. **Which files are safe to modify**:
   * Individual apps in `js/apps/` can be polished independently as they are sandboxed inside their own IIFEs.
   * `pages/*.html` can be enhanced with additional funny 1990s web details.
   * `css/os.css` can be styled further for visual authenticity.
9. **Module dependencies**:
   * Applications depend on `WM.open`, `Popup`, `Sound`, and `Egg`.
   * Explorer depends on `FS`.
   * IE depends on Dial-up.
   * Datepicker depends on `Clock`.
10. **Recommended next steps**:
    * Maintain minimal targeted diffs.
    * Run `node --check` after editing any JS file.
    * Test the complete user journey: Power on → Login → Explorer → Open love letter → Dial-up → IE → KBC → Datepicker → Shut Down.

---
*Report generated and saved to `c:\Users\NIKHIL\Desktop\Windows1998\HANDOFF_FOR_CLAUDE.md`.*
