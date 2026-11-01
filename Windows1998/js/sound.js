/* sound.js — Web Audio sound system (Part 1) */
(function() {
  'use strict';
  var ctx = null;
  var unlocked = false;
  var muted = false;

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    ensureCtx();
    // Resume context on user gesture
    if (ctx.state === 'suspended') ctx.resume();
  }

  window.Sound = {
    unlock: unlock,
    isUnlocked: function() { return unlocked; },
    setMuted: function(m) { muted = m; },
    isMuted: function() { return muted; },

    beep: function(freq, ms) {
      if (muted || !unlocked) return;
      var c = ensureCtx();
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = 'square';
      osc.frequency.value = freq || 800;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + (ms || 200) / 1000);
    },

    modem: function() {
      if (muted || !unlocked) return;
      var c = ensureCtx();
      var duration = 4;
      var osc1 = c.createOscillator();
      var osc2 = c.createOscillator();
      var gain = c.createGain();
      gain.gain.value = 0.06;
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(c.destination);

      // Dial tone
      osc1.frequency.setValueAtTime(350, c.currentTime);
      osc2.frequency.setValueAtTime(440, c.currentTime);

      // Handshake noise
      osc1.frequency.setValueAtTime(1200, c.currentTime + 0.8);
      osc2.frequency.setValueAtTime(2400, c.currentTime + 0.8);

      osc1.frequency.setValueAtTime(2100, c.currentTime + 1.5);
      osc2.frequency.setValueAtTime(1800, c.currentTime + 1.5);

      // Static
      osc1.frequency.linearRampToValueAtTime(8000, c.currentTime + 2.5);
      osc2.frequency.linearRampToValueAtTime(4000, c.currentTime + 2.5);

      osc1.frequency.setValueAtTime(1200, c.currentTime + 3.0);
      osc2.frequency.setValueAtTime(2400, c.currentTime + 3.0);

      osc1.start(c.currentTime);
      osc2.start(c.currentTime);
      osc1.stop(c.currentTime + duration);
      osc2.stop(c.currentTime + duration);
    },

    chime: function() {
      if (muted || !unlocked) return;
      var c = ensureCtx();
      var notes = [523, 659, 784, 1047];
      notes.forEach(function(freq, i) {
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, c.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.2 + 0.5);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime + i * 0.2);
        osc.stop(c.currentTime + i * 0.2 + 0.5);
      });
    },

    uhoh: function() {
      if (muted || !unlocked) return;
      var c = ensureCtx();
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, c.currentTime);
      osc.frequency.linearRampToValueAtTime(300, c.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.4);
    },

    error: function() {
      if (muted || !unlocked) return;
      var c = ensureCtx();
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = 'square';
      osc.frequency.value = 400;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.15);
      // Second beep
      setTimeout(function() {
        var osc2 = c.createOscillator();
        var gain2 = c.createGain();
        osc2.type = 'square';
        osc2.frequency.value = 300;
        gain2.gain.value = 0.08;
        osc2.connect(gain2);
        gain2.connect(c.destination);
        osc2.start();
        osc2.stop(c.currentTime + 0.2);
      }, 200);
    },

    siren: function() {
      if (muted || !unlocked) return;
      var c = ensureCtx();
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = 'sawtooth';
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(c.destination);
      // Siren sweep
      for (var i = 0; i < 8; i++) {
        osc.frequency.setValueAtTime(400, c.currentTime + i * 0.5);
        osc.frequency.linearRampToValueAtTime(900, c.currentTime + i * 0.5 + 0.25);
        osc.frequency.linearRampToValueAtTime(400, c.currentTime + i * 0.5 + 0.5);
      }
      osc.start();
      osc.stop(c.currentTime + 4);
    }
  };
})();
