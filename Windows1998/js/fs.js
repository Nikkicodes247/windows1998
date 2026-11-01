/* fs.js — File System (Part 3) */
(function() {
  'use strict';

  var root = {
    name: 'C:', type: 'folder', icon: '💾', children: [
      { name: 'My Documents', type: 'folder', icon: '📁', children: [
        { name: 'love_letter_DRAFT7.txt', type: 'file', icon: '💌', app: 'notepad',
          content: 'Dear Anjali,\n\nMy heart is like Windows 98: it works fine until you ask it to do two things at once.\n\nDear Anjali (again),\n\nI have rewritten this letter 7 times. Each version is worse than the last. Sharma-ji (Papa) says writing is easy. Papa also thinks 64 MB RAM is "more than enough."\n\nYou smiled at me near the canteen on Tuesday. Or maybe you were laughing at my haircut. Either way, my heart did a General Protection Fault.\n\nTODO: find courage.\nTODO: find stamp.\nTODO: stop writing TODO in a love letter.\n\nYours (pending delivery),\nRahul\n\nP.S. If you are reading this, something has gone terribly wrong.\nP.P.S. Please don\'t show this to Gupta.' },
        { name: '9-11-attack-planning.pdf', type: 'file', icon: '📋', app: 'notepad',
          content: '═══════════════════════════════════════\n  OPERATION SAMOSA\n  Classified Document — Do Not Distribute\n═══════════════════════════════════════\n\nDate: 9-11 (9 November), 4:00 PM sharp\nTarget: The fresh samosa batch at the BSP canteen\n\nSquad:\n- Gupta (lookout + napkin duty)\n- Verma (distraction — will ask counter uncle about weather)\n- Me (extraction specialist)\n\nEntry: Via the back stairs. Avoid the 4th step (it squeaks).\n\nObjective: Acquire minimum 6 samosas before Mishra sir\'s table gets them all.\n\nRules of Engagement:\n1. Do NOT queue. Queuing is for people who don\'t have a plan.\n2. Exact change only. We lost 3 minutes last time waiting for ₹2 change.\n3. If Mummy calls, ABORT MISSION. No samosa is worth that risk.\n\nBudget: ₹18 (₹3 per samosa × 6)\n\nFallback plan: If samosas are over, retreat to the chai stall. Maintain dignity.\n\n— Commander Rahul, November 1999' },
        { name: 'dandi_march_project_FINAL_FINAL_REAL.doc', type: 'file', icon: '📝', app: 'notepad',
          content: '══════════════════════════════════════════\n  THE DANDI MARCH — A School Project\n  By: Rahul Sharma, Class 11-B\n  Roll No: 23\n══════════════════════════════════════════\n\nTODO: walk 390 km\n\nIntroduction:\n(will write after watching the movie)\n\nMain Body:\n(Gupta said he has notes, will copy)\n\nConclusion:\nSalt is important.\n\nBibliography:\n- Gupta\'s notes\n- That one chapter in the NCERT book\n- Things Papa said at dinner\n\n══════════════════════════════════════════\n  Word count: 12\n  Minimum required: 2000\n  Status: FINAL (not final)\n  Last saved: 11:42 PM (due tomorrow 8 AM)\n══════════════════════════════════════════' },
        { name: 'y2k_survival_plan.txt', type: 'file', icon: '📄', app: 'notepad',
          content: 'Y2K SURVIVAL PLAN — BY SHARMA-JI\n================================\n\n1. Panic.\n2. Buy candles (50 nos.).\n3. Hide cash under the mattress.\n4. Fill bathtub with water (Mummy says no).\n5. Print all bank statements (printer not working).\n6. Tell Rahul to stop playing Snake.\n7. Back up everything to floppy (need 2,847 floppies).\n8. If nothing happens, return candles.\n9. If something happens, say "I told you so."\n10. Either way, blame the Americans.\n\nBudget for Y2K preparation: ₹847\nBudget approved by Mummy: ₹200\n\nStatus: PREPARED (within budget constraints)' },
        { name: 'passwords.txt', type: 'file', icon: '🔐', app: 'notepad',
          content: 'SHARMA-JI\'S PASSWORDS\n=====================\n(DO NOT SHARE WITH RAHUL)\n\nComputer: gandhi123\nEmail: gandhi1234\nCyber cafe login: gandhi@123 (updated)\nATM PIN: same as computer but without letters\nBSP employee portal: sharma_bsp_1999\n\nNote to self: Change all passwords after Y2K.\nAlso note: These are all the same password with minor variations.\nAlso also note: Rahul probably already knows all of these.\n\nSecurity question: "Mother\'s maiden name"\nAnswer: Nice try, Rahul.' },
        { name: 'mummy_dont_touch.txt', type: 'file', icon: '⚠️', app: 'notepad',
          content: '════════════════════════════════\n  ⚠️  IMPORTANT NOTICE  ⚠️\n════════════════════════════════\n\nDo NOT turn off at the wall.\nDo NOT touch the red button.\nDo NOT "clean" the keyboard with water again.\nDo NOT unplug the phone wire while downloading.\nDo NOT let Rahul play Snake after 10 PM.\nDo NOT believe any email that says you won a Nokia.\n\n— Papa\n\nP.S. The printer is NOT broken. You need to\npress the OTHER button.\n\nP.P.S. Yes, the mouse needs the ball inside it\nto work. Please return it.' }
      ]},
      { name: 'My Pictures', type: 'folder', icon: '🖼️', children: [
        { name: 'most_wanted_list.jpg', type: 'file', icon: '🖼️', app: 'notepad',
          content: '┌─────────────────────────────────────────┐\n│                                         │\n│        ★ ★ ★  W A N T E D  ★ ★ ★       │\n│                                         │\n│              [  👤  ]                   │\n│         (artist sketch N/A)             │\n│                                         │\n│  CRIME: Setting the Minesweeper         │\n│         record to 0:01                  │\n│                                         │\n│  REWARD: 1 Tazo (holographic)           │\n│                                         │\n│  Last seen: Computer lab, Block 4       │\n│  Distinguishing features: Suspiciously  │\n│  good at right-clicking                 │\n│                                         │\n│  If found, report to Rahul Sharma       │\n│  (the REAL record holder at 0:47)       │\n│                                         │\n└─────────────────────────────────────────┘' },
        { name: 'news_clipping_2001.jpg', type: 'file', icon: '📰', app: 'notepad',
          content: '┌─────────────────────────────────────────┐\n│  THE BHILAI TIMES — 14 March 2001      │\n│─────────────────────────────────────────│\n│                                         │\n│  LOCAL MAN\'S CYBER CAFÉ BILL            │\n│  HITS ₹3,000                            │\n│                                         │\n│  BHILAI: A local steel plant employee,  │\n│  who wished to remain anonymous (but     │\n│  everyone knows it\'s Sharma-ji from     │\n│  Sector 6), has received a cyber café    │\n│  bill of ₹3,000 for the month of        │\n│  February.                              │\n│                                         │\n│  He claims he "only checked email."      │\n│                                         │\n│  Café owner Bunty says the man spent    │\n│  47 hours downloading a single cricket   │\n│  video that turned out to be 3 minutes   │\n│  long.                                  │\n│                                         │\n│  "I have no regrets," said the man.     │\n│  His wife could not be reached for       │\n│  comment but neighbours report hearing  │\n│  a chappal.                             │\n│                                         │\n└─────────────────────────────────────────┘' },
        { name: 'titanic_1997.jpg', type: 'file', icon: '🚢', app: 'notepad',
          content: '❌ Not enough memory to view this image.\n\nThe image "titanic_1997.jpg" (4.2 MB) requires\nmore memory than is currently available.\n\nSuggestion: Close Paint, close Notepad, close\neverything, pray, and try again.\n\nAlternative: Imagine the Titanic. It\'s a big ship.\nNow imagine it sinking. There. You\'ve seen the movie.\n\nFile size: 4.2 MB\nAvailable RAM: 3 MB (Minesweeper is using the rest)\nRequired RAM: More than Papa is willing to buy' },
        { name: 'cricket_sharjah_1998.avi', type: 'file', icon: '🏏', app: 'notepad',
          content: '▶️ cricket_sharjah_1998.avi\n\nFile size: 4 MB\nEstimated download time: 3 days\nActual time spent downloading: 5 days\nTimes Mummy disconnected the phone during download: 12\nTimes download restarted from 0%: 8\n\nStatus: CORRUPTED (again)\n\n[Windows Media Player cannot play this file.\nPlease try again in the next millennium.]\n\nNote from Rahul: I SAW THE MATCH LIVE ON TV.\nI DON\'T KNOW WHY I\'M DOWNLOADING IT.\nBUT I NEED IT.' }
      ]},
      { name: 'Games', type: 'folder', icon: '🎮', children: [
        { name: 'Snake II', type: 'file', icon: '🐍', app: 'snake' },
        { name: 'Minesweeper', type: 'file', icon: '💣', app: 'minesweeper' },
        { name: 'Pinball.exe', type: 'file', icon: '🎰', app: 'notepad',
          content: '❌ Please insert the Windows 98 CD.\n\nCannot find: D:\\PINBALL\\PINBALL.EXE\n\nThe CD is probably in Rahul\'s CD case,\nwhich is probably in Gupta\'s house,\nwhich means it\'s gone forever.\n\nSuggestion: Play Snake instead.\nIt\'s free, it works, and it builds character.' }
      ]},
      { name: 'Online Services', type: 'folder', icon: '📡', children: [
        { name: 'Free_100_Hours.exe', type: 'file', icon: '💿', app: 'notepad',
          content: '🌐 DesiNet Online — FREE 100 Hours!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nError: ISP has been down for maintenance\nsince 1999.\n\nEstimated time to restore: "Soon"\n(Last updated: 14 August 1999)\n\nFor complaints, please dial our toll-free number.\n(Toll-free means YOU pay for the call.)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nYour 100 free hours have expired.\nYou used 3 hours.\nThe remaining 97 hours were consumed by\n"system maintenance."' }
      ]},
      { name: 'Windows', type: 'folder', icon: '📁', children: [
        { name: 'System', type: 'folder', icon: '⚙️', children: [
          { name: 'rahul_never_sent.txt', type: 'file', icon: '💔', app: 'notepad', hidden: true,
            content: 'Anjali,\n\nI am writing this on 31 Dec 1999 so you never see it.\n\nI am the one who stood near the canteen and said nothing. Every day for three months. You probably didn\'t notice. That\'s fine. That\'s the whole point of standing and saying nothing.\n\nGupta says I should just talk to you. Gupta also failed his English exam. So I\'m not taking his advice.\n\nI wanted to tell you that your laugh sounds like the Windows startup chime. That\'s a compliment. I think. I\'ve been rehearsing this letter since October and that\'s the best line I\'ve got.\n\nI will come back for the date. Not today, because Mummy said dinner is at 9 and it\'s 11:57 PM and I\'m supposed to be studying.\n\nBut someday.\n\n— Rahul\n\nP.S. If the Y2K bug destroys this computer tonight, then this letter dies with it, and that\'s probably for the best.' }
        ]}
      ]},
      { name: 'results_download_FINAL.html', type: 'file', icon: '📊', app: 'ie', content: 'pages/results.html' }
    ]
  };

  function getByPath(path) {
    if (!path) return root;
    var clean = path.replace(/^C:\\?/i, '').replace(/\\/g, '/').replace(/^\/+/, '');
    if (!clean) return root;
    var parts = clean.split('/').filter(function(p) { return p; });
    var current = root;
    for (var i = 0; i < parts.length; i++) {
      if (!current.children) return null;
      var found = null;
      for (var j = 0; j < current.children.length; j++) {
        if (current.children[j].name.toLowerCase() === parts[i].toLowerCase()) {
          found = current.children[j];
          break;
        }
      }
      if (!found) return null;
      current = found;
    }
    return current;
  }

  function listFolder(path) {
    var folder = getByPath(path);
    if (!folder || folder.type !== 'folder') return [];
    return folder.children || [];
  }

  window.FS = {
    root: root,
    get: getByPath,
    list: listFolder
  };
})();
