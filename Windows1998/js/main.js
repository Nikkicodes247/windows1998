/* main.js — Desktop, Clock, Apps registry, screensaver, Y2K, and OS chrome (Part 1) */
(function() {
  'use strict';

  /* ===== Apps Registry ===== */
  if (!window.Apps) {
    var registry = {};
    window.Apps = {
      register: function(name, def) {
        if (registry[name]) return;
        registry[name] = def;
      },
      launch: function(name, opts) {
        var app = registry[name];
        if (app && app.open) {
          app.open(opts || {});
        } else {
          if (typeof Popup !== 'undefined' && Popup.error) {
            Popup.error({ title: 'Error', msg: 'Cannot find the program "' + name + '".<br>Make sure the path is correct.' });
          }
        }
      },
      get: function(name) { return registry[name]; }
    };
  }

  /* ===== Clock ===== */
  var clockDate = new Date(1999, 11, 31, 23, 57, 0); // 31 Dec 1999, 11:57 PM
  var clockInterval = null;

  window.Clock = {
    set: function(y, m, d, h, min) {
      clockDate = new Date(y, m - 1, d, h || 0, min || 0, 0);
      updateClockDisplay();
    },
    get: function() {
      return new Date(clockDate.getTime());
    },
    start: function() {
      if (clockInterval) return;
      clockInterval = setInterval(function() {
        clockDate = new Date(clockDate.getTime() + 1000);
        updateClockDisplay();
      }, 1000);
    },
    stop: function() {
      if (clockInterval) { clearInterval(clockInterval); clockInterval = null; }
    }
  };

  function updateClockDisplay() {
    var el = document.getElementById('tray-clock');
    if (!el) return;
    var h = clockDate.getHours();
    var m = clockDate.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 || 12;
    el.textContent = h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  /* ===== Desktop Icons ===== */
  var desktopIcons = [
    { name: 'My Computer', icon: '🖥️', app: 'explorer', opts: { path: 'C:\\' } },
    { name: 'My Documents', icon: '📁', app: 'explorer', opts: { path: 'C:\\My Documents' } },
    { name: 'Recycle Bin', icon: '🗑️', app: null, msg: 'The Recycle Bin is empty.\nSharma-ji never deletes anything.' },
    { name: 'Internet Explorer', icon: '🌐', app: 'ie' },
    { name: 'Outlook Express', icon: '📧', app: 'outlook' },
    { name: 'MS-DOS Prompt', icon: '⬛', app: 'dos' },
    { name: 'Snake II', icon: '🐍', app: 'snake' },
    { name: 'Minesweeper', icon: '💣', app: 'minesweeper' },
    { name: 'KBC', icon: '🎯', app: 'kbc' },
    { name: 'Y2K_Panic.exe', icon: '☢️', app: 'y2k_panic' },
    { name: 'Online Services', icon: '📡', app: null, msg: 'Free 100 Hours Online!\n(ISP has been down for maintenance since 1999)' }
  ];

  /* ===== Idle / Screensaver ===== */
  var idleTimer = null;
  var screensaverActive = false;
  var IDLE_TIMEOUT = 45000; // 45 seconds
  var charkhaAnim = null;

  function resetIdle() {
    if (screensaverActive) stopScreensaver();
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(startScreensaver, IDLE_TIMEOUT);
  }

  function startScreensaver() {
    screensaverActive = true;
    if (typeof Egg !== 'undefined' && Egg.unlock) {
      Egg.unlock(9, 'Flying Charkhas screensaver');
    }
    var canvas = document.getElementById('screensaver-canvas');
    if (!canvas) return;
    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    var charkhas = [];
    for (var i = 0; i < 8; i++) {
      charkhas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 3,
        dy: (Math.random() - 0.5) * 3,
        angle: 0,
        size: 20 + Math.random() * 20,
        color: ['#ff9933','#fff','#138808','#000080'][Math.floor(Math.random()*4)]
      });
    }

    function drawCharkha(c, ch) {
      c.save();
      c.translate(ch.x, ch.y);
      c.rotate(ch.angle);
      c.strokeStyle = ch.color;
      c.lineWidth = 2;
      // Draw spinning wheel
      c.beginPath();
      c.arc(0, 0, ch.size, 0, Math.PI * 2);
      c.stroke();
      // Spokes
      for (var s = 0; s < 24; s++) {
        var a = (s / 24) * Math.PI * 2;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(Math.cos(a) * ch.size, Math.sin(a) * ch.size);
        c.stroke();
      }
      c.restore();
    }

    function animate() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      charkhas.forEach(function(ch) {
        ch.x += ch.dx;
        ch.y += ch.dy;
        ch.angle += 0.05;
        if (ch.x < 0 || ch.x > canvas.width) ch.dx *= -1;
        if (ch.y < 0 || ch.y > canvas.height) ch.dy *= -1;
        drawCharkha(ctx, ch);
      });
      if (screensaverActive) charkhaAnim = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopScreensaver() {
    screensaverActive = false;
    if (charkhaAnim) cancelAnimationFrame(charkhaAnim);
    var canvas = document.getElementById('screensaver-canvas');
    if (canvas) canvas.classList.add('hidden');
  }

  /* ===== Volume Slider (the world's worst) ===== */
  var volPopupVisible = false;

  function initVolumeSlider() {
    var handle = document.getElementById('vol-slider-handle');
    if (!handle) return;
    handle.addEventListener('mouseover', function() {
      // The handle jumps away!
      if (typeof Egg !== 'undefined' && Egg.unlock) {
        Egg.unlock(7, "The world's worst volume slider");
      }
      var track = document.getElementById('vol-slider-track');
      if (track) {
        var max = track.offsetHeight - 15;
        handle.style.top = Math.floor(Math.random() * max) + 'px';
      }
    });
    var muteBox = document.getElementById('vol-mute');
    if (muteBox) {
      muteBox.addEventListener('change', function() {
        if (typeof Sound !== 'undefined' && Sound.setMuted) {
          Sound.setMuted(muteBox.checked);
        }
      });
    }
  }

  /* ===== Y2K Panic ===== */
  function y2kPanic() {
    if (typeof Egg !== 'undefined' && Egg.unlock) {
      Egg.unlock(14, 'Y2K Millennium Bug panic');
    }
    var overlay = document.getElementById('y2k-overlay');
    var content = document.getElementById('y2k-content');
    if (!overlay || !content) return;

    overlay.classList.remove('hidden');
    content.innerHTML = '';

    var steps = [
      { text: '⏰ 11:59:58 PM — December 31, 1999', delay: 0 },
      { text: '⏰ 11:59:59 PM...', delay: 1500 },
      { text: '💥 12:00:00 AM — JANUARY 1, 2000', delay: 3000, color: '#f00' },
      { text: '', delay: 3500, action: 'flicker' },
      { text: '🚨 MILLENNIUM BUG DETECTED 🚨', delay: 4500, color: '#ff0' },
      { text: '⚠️ Checking all systems...', delay: 5500 },
      { text: '✅ Floppy Drive: OK (still empty)', delay: 6500, color: '#0f0' },
      { text: '✅ RAM: 64 MB (no change, sadly)', delay: 7000, color: '#0f0' },
      { text: '✅ Mummy\'s recipes: SAFE', delay: 7500, color: '#0f0' },
      { text: '', delay: 8500 },
      { text: '🤷 Nothing happened. Resume normal life.', delay: 9000, color: '#0f0' }
    ];

    if (typeof Sound !== 'undefined' && Sound.siren) Sound.siren();

    steps.forEach(function(step) {
      setTimeout(function() {
        if (step.action === 'flicker') {
          overlay.style.background = '#fff';
          setTimeout(function() { overlay.style.background = '#000'; }, 100);
          setTimeout(function() { overlay.style.background = '#fff'; }, 200);
          setTimeout(function() { overlay.style.background = '#000'; }, 300);
          return;
        }
        var line = document.createElement('p');
        line.textContent = step.text;
        if (step.color) line.style.color = step.color;
        line.style.margin = '6px 0';
        content.appendChild(line);
      }, step.delay);
    });

    setTimeout(function() {
      overlay.style.cursor = 'pointer';
      overlay.onclick = function() {
        overlay.classList.add('hidden');
        overlay.onclick = null;
        overlay.style.cursor = '';
      };
      var clickMsg = document.createElement('p');
      clickMsg.textContent = '( click to return )';
      clickMsg.style.cssText = 'margin-top:20px;font-size:14px;opacity:0.5;';
      content.appendChild(clickMsg);
    }, 10000);
  }

  // Register Y2K_Panic as an app
  Apps.register('y2k_panic', {
    title: 'Y2K_Panic.exe',
    icon: '☢️',
    open: function() { y2kPanic(); }
  });

  /* ===== Discoveries.exe ===== */
  Apps.register('discoveries', {
    title: 'Discoveries.exe',
    icon: '🔍',
    open: function() {
      if (typeof WM === 'undefined' || !WM.open) return;
      WM.open({
        id: 'discoveries',
        title: 'Discoveries.exe',
        icon: '🔍',
        width: 360,
        height: 420,
        render: function(body) {
          var eggs = (typeof Egg !== 'undefined' && Egg.list) ? Egg.list() : [];
          var count = (typeof Egg !== 'undefined' && Egg.count) ? Egg.count() : 0;
          var totalEggs = (typeof Egg !== 'undefined' && Egg.total) ? Egg.total : 30;

          var counter = document.createElement('div');
          counter.className = 'egg-counter';
          counter.textContent = '🥚 ' + count + ' / ' + totalEggs + ' Easter Eggs Found';
          body.appendChild(counter);

          var list = document.createElement('div');
          list.style.padding = '4px';
          eggs.forEach(function(egg) {
            var item = document.createElement('div');
            item.className = 'egg-item ' + (egg.unlocked ? 'unlocked' : 'locked');
            item.textContent = (egg.unlocked ? '✅' : '🔒') + ' #' + egg.id + ': ' + (egg.unlocked ? egg.label : '???');
            list.appendChild(item);
          });
          body.appendChild(list);
        }
      });
    }
  });

  /* ===== Desktop Controller ===== */
  window.Desktop = {
    init: function(isGuest) {
      Clock.start();
      resetIdle();

      // Create desktop icons
      var iconsEl = document.getElementById('desktop-icons');
      if (iconsEl) {
        iconsEl.innerHTML = '';
        desktopIcons.forEach(function(icon) {
          var el = document.createElement('div');
          el.className = 'desktop-icon';
          el.innerHTML = '<div class="icon-img">' + icon.icon + '</div><div class="icon-label">' + icon.name + '</div>';
          el.addEventListener('dblclick', function() {
            if (icon.app) {
              Apps.launch(icon.app, icon.opts || {});
            } else if (icon.msg) {
              Popup.info({ title: icon.name, msg: icon.msg.replace(/\n/g, '<br>') });
            }
          });
          el.addEventListener('click', function() {
            document.querySelectorAll('.desktop-icon').forEach(function(i) { i.classList.remove('selected'); });
            el.classList.add('selected');
          });
          iconsEl.appendChild(el);
        });
      }

      // Click desktop to deselect icons
      var desktop = document.getElementById('desktop');
      if (desktop) {
        desktop.addEventListener('click', function(e) {
          if (e.target === desktop || e.target.id === 'desktop-icons') {
            document.querySelectorAll('.desktop-icon').forEach(function(i) { i.classList.remove('selected'); });
          }
        });
      }

      // Right-click context menu
      document.getElementById('desktop').addEventListener('contextmenu', function(e) {
        e.preventDefault();
        var ctx = document.getElementById('context-menu');
        if (ctx) {
          ctx.classList.remove('hidden');
          ctx.style.left = e.clientX + 'px';
          ctx.style.top = e.clientY + 'px';
        }
      });
      document.addEventListener('click', function() {
        var ctx = document.getElementById('context-menu');
        if (ctx) ctx.classList.add('hidden');
      });

      // Idle reset on activity
      ['mousemove','mousedown','keydown','touchstart'].forEach(function(evt) {
        document.addEventListener(evt, resetIdle);
      });

      // Tab visibility
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          document.title = 'Mummy is calling';
          if (typeof Egg !== 'undefined' && Egg.unlock) {
            Egg.unlock(12, 'Tab hidden — Mummy is calling');
          }
        } else {
          document.title = "Sharma-ji's PC — Windows 98";
        }
      });

      // Console easter egg
      if (typeof Egg !== 'undefined' && Egg.unlock) {
        Egg.unlock(13, "Sharma-ji says: don't touch the console");
      }
      console.log('%cSharma-ji says: don\'t touch the console.', 'font-size:16px;color:#ff6600;font-weight:bold;background:#ffffcc;padding:4px 8px;');

      initVolumeSlider();

      // Welcome message for guest
      if (isGuest) {
        setTimeout(function() {
          if (typeof Specs !== 'undefined' && Specs.say) {
            Specs.say('Welcome, Guest! Papa is not home. Feel free to look around... but don\'t open anything suspicious.');
          }
        }, 1000);
      }
    },

    toggleStart: function() {
      var menu = document.getElementById('start-menu');
      if (menu) menu.classList.toggle('hidden');
    },

    closeStart: function() {
      var menu = document.getElementById('start-menu');
      if (menu) menu.classList.add('hidden');
    },

    showRun: function() {
      var dlg = document.getElementById('run-dialog');
      if (dlg) {
        dlg.classList.remove('hidden');
        var input = document.getElementById('run-input');
        if (input) { input.value = ''; input.focus(); }
      }
    },

    execRun: function() {
      var input = document.getElementById('run-input');
      var val = input ? input.value.trim().toLowerCase() : '';
      var dlg = document.getElementById('run-dialog');
      if (dlg) dlg.classList.add('hidden');

      if (val === 'bapu') {
        if (typeof Egg !== 'undefined' && Egg.unlock) {
          Egg.unlock(4, 'Run: bapu — Specs appears');
        }
        if (typeof Specs !== 'undefined' && Specs.say) {
          Specs.say('Ahimsa tip: Before clicking "Format C:", ask yourself — would Bapu approve?', ['He would not', 'Format anyway']);
        } else if (typeof Popup !== 'undefined' && Popup.info) {
          Popup.info({ title: 'Bapu', msg: '🤓 Ahimsa tip: Before clicking "Format C:", ask yourself — would Bapu approve?' });
        }
      } else if (val === 'salt') {
        if (typeof Egg !== 'undefined' && Egg.unlock) {
          Egg.unlock(5, 'Run: salt — Salt tax ₹2');
        }
        if (typeof Popup !== 'undefined' && Popup.info) {
          Popup.info({ title: 'Salt Tax', msg: 'Salt tax: ₹2<br>Please pay at the nearest British office.<br>(Office closed since 1947)' });
        }
      } else if (val === 'mummy') {
        if (typeof Egg !== 'undefined' && Egg.unlock) {
          Egg.unlock(6, 'Run: mummy — Mummy is calling');
        }
        if (typeof Popup !== 'undefined' && Popup.warn) {
          Popup.warn({ title: 'Alert', msg: 'Mummy is calling. Disconnecting internet...<br>Saving all unsaved work...<br>Hiding browser history...' });
        }
      } else if (val !== '') {
        if (typeof Popup !== 'undefined' && Popup.error) {
          Popup.error({ title: 'Error', msg: 'Cannot find the file "' + val + '".<br>Make sure the path is correct.' });
        }
      }
    },

    shutDown: function() {
      if (typeof Egg !== 'undefined' && Egg.unlock) {
        Egg.unlock(11, 'Shut Down — Task failed successfully');
      }
      if (typeof Popup !== 'undefined' && Popup.storm) {
        Popup.storm(5);
      }

      setTimeout(function() {
        var screen = document.getElementById('shutdown-screen');
        if (screen) {
          screen.classList.remove('hidden');
          if (typeof Clock !== 'undefined' && Clock.stop) Clock.stop();
          screen.onclick = function() {
            screen.classList.add('hidden');
            if (typeof Boot !== 'undefined' && Boot.reboot) Boot.reboot();
            // Re-trigger power on flow
            setTimeout(function() {
              var pwrBtn = document.getElementById('power-on-btn');
              if (pwrBtn) {
                pwrBtn.onclick = function() {
                  if (typeof Sound !== 'undefined' && Sound.unlock) Sound.unlock();
                  if (typeof Boot !== 'undefined' && Boot.start) Boot.start();
                };
              }
            }, 100);
          };
        }
      }, 2500);
    },

    scannerWizard: function() {
      if (typeof Egg !== 'undefined' && Egg.unlock) {
        Egg.unlock(10, 'Scanner Wizard — BSOD: Plug and Play detected a scanner');
      }
      if (typeof Sound !== 'undefined' && Sound.error) Sound.error();
      var bsod = document.getElementById('bsod-screen');
      if (bsod) {
        bsod.classList.remove('hidden');
        var handler = function() {
          bsod.classList.add('hidden');
          document.removeEventListener('keydown', handler);
        };
        document.addEventListener('keydown', handler);
      }
    },

    properties: function() {
      if (typeof Popup !== 'undefined' && Popup.info) {
        Popup.info({
          title: 'Display Properties',
          msg: 'Current Display Settings:<br><br>' +
               '🖥️ Resolution: 640 × 480<br>' +
               '🎨 Colors: 16<br>' +
               '📺 Refresh rate: "Enough"<br>' +
               '💾 Video memory: 2 MB<br><br>' +
               'Sharma-ji says: "This is the best monitor in Bhilai."'
        });
      }
    },

    aboutWindows: function() {
      if (typeof WM === 'undefined' || !WM.open) return;
      WM.open({
        id: 'about-windows',
        title: 'About Windows',
        icon: 'ℹ️',
        width: 380,
        height: 250,
        render: function(body) {
          body.innerHTML =
            '<div class="about-body">' +
              '<div class="about-flag">' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;width:48px;height:48px;">' +
                  '<div style="background:#f00;"></div><div style="background:#0a0;"></div>' +
                  '<div style="background:#00f;"></div><div style="background:#ff0;"></div>' +
                '</div>' +
              '</div>' +
              '<div class="about-info">' +
                '<p><b>Microsoft® Windows 98</b></p>' +
                '<p>Sharma-ji Edition (Build 4.10.2222 A)</p>' +
                '<p style="margin-top:8px;">Registered to: <b>Sharma-ji</b></p>' +
                '<p>Location: Bhilai, Chhattisgarh</p>' +
                '<p style="margin-top:8px;">RAM: 64 MB (and 1 Mummy)</p>' +
                '<p>Hard Disk: 3.2 GB (2.8 GB free*)</p>' +
                '<p style="font-size:9px;color:#888;margin-top:4px;">*Papa\'s PowerPoint presentations take 400 MB</p>' +
              '</div>' +
            '</div>';
        }
      });
    },

    arrangeIcons: function() {
      // Just a visual "refresh"
      var icons = document.querySelectorAll('.desktop-icon');
      icons.forEach(function(i) { i.style.opacity = '0.5'; });
      setTimeout(function() { icons.forEach(function(i) { i.style.opacity = '1'; }); }, 200);
    },

    refresh: function() {
      Desktop.arrangeIcons();
    },

    showHelp: function() {
      if (typeof WM === 'undefined' || !WM.open) return;
      WM.open({
        id: 'help',
        title: 'Windows Help',
        icon: '❓',
        width: 380,
        height: 300,
        render: function(body) {
          body.innerHTML =
            '<div style="padding:12px;">' +
              '<h3 style="margin-bottom:8px;">Welcome to Windows 98 Help</h3>' +
              '<p style="margin:4px 0;">❓ <b>Where are the Easter eggs?</b></p>' +
              '<p style="margin:4px 0;font-size:11px;">This computer has 30 hidden Easter eggs. Open <b>Discoveries.exe</b> from Start → Programs → Accessories to track your progress.</p>' +
              '<hr style="margin:8px 0;">' +
              '<p style="margin:4px 0;">🖥️ Try double-clicking desktop icons</p>' +
              '<p style="margin:4px 0;">⌨️ Try the Run dialog (Start → Run)</p>' +
              '<p style="margin:4px 0;">🔍 Try showing hidden files in Explorer</p>' +
              '<p style="margin:4px 0;">🎮 Try all the games</p>' +
              '<p style="margin:4px 0;">📧 Check Outlook for old emails</p>' +
              '<p style="margin:4px 0;">🖨️ Try the Scanner Wizard</p>' +
              '<p style="margin:4px 0;">☢️ Run Y2K_Panic.exe</p>' +
              '<hr style="margin:8px 0;">' +
              '<p style="font-size:10px;color:#888;">Sharma-ji says: "Help? I built this PC myself. What help do you need?"</p>' +
            '</div>';
        }
      });
    },

    volumeSlider: function() {
      var popup = document.getElementById('volume-popup');
      if (popup) {
        volPopupVisible = !volPopupVisible;
        if (volPopupVisible) popup.classList.remove('hidden');
        else popup.classList.add('hidden');
      }
    }
  };

  /* ===== Page Load ===== */
  document.addEventListener('DOMContentLoaded', function() {
    // Mobile check
    if (window.innerWidth < 700) {
      document.getElementById('mobile-warning').classList.remove('hidden');
    }

    // Power-on button
    var pwrBtn = document.getElementById('power-on-btn');
    if (pwrBtn) {
      pwrBtn.onclick = function() {
        if (typeof Sound !== 'undefined' && Sound.unlock) Sound.unlock();
        if (typeof Boot !== 'undefined' && Boot.start) Boot.start();
      };
    }

    // Close start menu on outside click
    document.addEventListener('click', function(e) {
      var startMenu = document.getElementById('start-menu');
      var startBtn = document.getElementById('start-button');
      if (startMenu && !startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');
      }
      // Close volume popup
      var volPopup = document.getElementById('volume-popup');
      var volIcon = document.getElementById('tray-volume');
      if (volPopup && !volPopup.contains(e.target) && e.target !== volIcon) {
        volPopup.classList.add('hidden');
        volPopupVisible = false;
      }
    });
  });
})();
