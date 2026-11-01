/* boot.js — Boot sequence and login (Part 1) */
(function() {
  'use strict';

  var loginAttempts = 0;
  var biosKeyListener = null;
  var bsodListener = null;

  function showScreen(id) {
    ['power-off-screen','bios-screen','bios-setup','splash-screen','login-screen','desktop'].forEach(function(s) {
      var el = document.getElementById(s);
      if (el) { if (s === id) el.classList.remove('hidden'); else el.classList.add('hidden'); }
    });
  }

  function biosPost() {
    showScreen('bios-screen');
    var textEl = document.getElementById('bios-text');
    if (!textEl) return;
    textEl.innerHTML = '';
    var lines = [
      { text: 'SHARMA-JI COMPUTERS PVT LTD', cls: 'bios-highlight', delay: 0 },
      { text: 'BIOS Version 4.51 PG — Bhilai Special Edition', cls: '', delay: 200 },
      { text: '', cls: '', delay: 300 },
      { text: 'Pentium(R) II Processor 233 MHz', cls: '', delay: 400 },
      { text: '', cls: '', delay: 450 },
      { text: 'Memory Test: 64 MB', cls: '', delay: 600 },
      { text: '64 MB RAM OK', cls: 'bios-ok', delay: 1000 },
      { text: '', cls: '', delay: 1100 },
      { text: 'IDE Primary Master: QUANTUM FIREBALL 3.2 GB', cls: '', delay: 1300 },
      { text: 'IDE Primary Slave: CD-ROM DRIVE', cls: '', delay: 1500 },
      { text: 'IDE Secondary: None (Papa said no budget)', cls: 'bios-warn', delay: 1700 },
      { text: '', cls: '', delay: 1800 },
      { text: 'Floppy Drive A: 1.44 MB (Rahul lost the disk)', cls: 'bios-warn', delay: 2000 },
      { text: '', cls: '', delay: 2100 },
      { text: 'Press DEL to enter BIOS Setup', cls: 'bios-highlight', delay: 2300 },
      { text: '', cls: '', delay: 2500 }
    ];

    // Beep sounds
    if (typeof Sound !== 'undefined' && Sound.beep) {
      Sound.beep(800, 100);
      setTimeout(function() {
        if (typeof Sound !== 'undefined' && Sound.beep) Sound.beep(800, 100);
      }, 150);
    }

    lines.forEach(function(line) {
      setTimeout(function() {
        var span = document.createElement('div');
        if (line.cls) span.className = line.cls;
        span.textContent = line.text || '\u00A0';
        textEl.appendChild(span);
        textEl.scrollTop = textEl.scrollHeight;
      }, line.delay);
    });

    // Listen for DEL key
    biosKeyListener = function(e) {
      if (e.key === 'Delete' || e.key === 'Del') {
        e.preventDefault();
        document.removeEventListener('keydown', biosKeyListener);
        biosKeyListener = null;
        if (typeof Egg !== 'undefined' && Egg.unlock) {
          Egg.unlock(1, 'BIOS Setup — Boot order: Hope');
        }
        biosSetup();
      }
    };
    document.addEventListener('keydown', biosKeyListener);

    // Auto-continue after 3.5 seconds
    setTimeout(function() {
      if (biosKeyListener) {
        document.removeEventListener('keydown', biosKeyListener);
        biosKeyListener = null;
        splashScreen();
      }
    }, 3500);
  }

  function biosSetup() {
    showScreen('bios-setup');
    var escListener = function(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escListener);
        splashScreen();
      }
    };
    document.addEventListener('keydown', escListener);
  }

  function splashScreen() {
    showScreen('splash-screen');
    if (typeof Sound !== 'undefined' && Sound.chime) Sound.chime();
    var bar = document.querySelector('.splash-bar');
    if (bar) {
      var progress = 0;
      var interval = setInterval(function() {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(function() { loginScreen(); }, 400);
        }
        bar.style.width = progress + '%';
      }, 200);
    }
  }

  function loginScreen() {
    showScreen('login-screen');
    loginAttempts = 0;
    var passEl = document.getElementById('login-pass');
    if (passEl) { passEl.value = ''; if (passEl.focus) passEl.focus(); }
    var hintEl = document.getElementById('login-hint');
    if (hintEl) hintEl.classList.add('hidden');

    // Allow Enter key
    var passInput = document.getElementById('login-pass');
    if (passInput) {
      passInput.onkeydown = function(e) {
        if (e.key === 'Enter') Boot.loginOK();
      };
    }
  }

  function enterDesktop(isGuest) {
    showScreen('desktop');
    if (typeof Desktop !== 'undefined' && Desktop.init) Desktop.init(isGuest);
  }

  window.Boot = {
    start: function() {
      biosPost();
    },

    loginOK: function() {
      var pass = document.getElementById('login-pass');
      var val = pass ? pass.value : '';
      loginAttempts++;

      if (loginAttempts >= 3 && val !== '') {
        // Show hint after 3 wrong attempts
        var hintEl = document.getElementById('login-hint');
        if (hintEl) hintEl.classList.remove('hidden');
        if (typeof Egg !== 'undefined' && Egg.unlock) {
          Egg.unlock(3, 'Three wrong passwords — Hint: ask Papa');
        }
      }

      // Any password (or empty) logs in — this is Windows 98!
      enterDesktop(false);
    },

    loginCancel: function() {
      if (typeof Egg !== 'undefined' && Egg.unlock) {
        Egg.unlock(2, 'Login Cancel — Welcome, Guest');
      }
      if (typeof Popup !== 'undefined' && Popup.info) {
        Popup.info({ title: 'Welcome', msg: 'Welcome, Guest. Papa is not home.' });
      }
      setTimeout(function() { enterDesktop(true); }, 800);
    },

    reboot: function() {
      // Full reboot
      showScreen('power-off-screen');
      // Reset egg count? No, keep them.
    }
  };
})();
