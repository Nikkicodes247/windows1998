/* popup.js — Modal dialog system (Part 1) */
(function() {
  'use strict';

  function createDialog(opts) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9950;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.15);';

    var win = document.createElement('div');
    win.className = 'window';
    win.style.cssText = 'min-width:260px;max-width:400px;';

    var titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    var titleText = document.createElement('div');
    titleText.className = 'title-bar-text';
    titleText.textContent = opts.title || 'Windows';
    titleBar.appendChild(titleText);
    win.appendChild(titleBar);

    var body = document.createElement('div');
    body.className = 'window-body';
    body.style.cssText = 'padding:12px;';

    var msgArea = document.createElement('div');
    msgArea.style.cssText = 'display:flex;gap:10px;align-items:flex-start;';

    if (opts.icon) {
      var iconEl = document.createElement('span');
      iconEl.style.fontSize = '32px';
      iconEl.textContent = opts.icon;
      msgArea.appendChild(iconEl);
    }

    var textEl = document.createElement('p');
    textEl.style.cssText = 'font-size:11px;line-height:1.5;flex:1;';
    textEl.innerHTML = opts.msg || '';
    msgArea.appendChild(textEl);
    body.appendChild(msgArea);

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;justify-content:center;gap:6px;margin-top:12px;';

    var buttons = opts.buttons || ['OK'];
    buttons.forEach(function(label) {
      var btn = document.createElement('button');
      btn.textContent = label;
      btn.style.minWidth = '72px';
      btn.onclick = function() {
        overlay.remove();
        if (opts.onButton) opts.onButton(label);
      };
      btnRow.appendChild(btn);
    });

    body.appendChild(btnRow);
    win.appendChild(body);
    overlay.appendChild(win);
    document.body.appendChild(overlay);
    return overlay;
  }

  window.Popup = {
    error: function(opts) {
      if (typeof Sound !== 'undefined') Sound.error();
      return createDialog({
        title: opts.title || 'Error',
        icon: '❌',
        msg: opts.msg,
        buttons: opts.buttons || ['OK'],
        onButton: opts.onButton
      });
    },

    info: function(opts) {
      return createDialog({
        title: opts.title || 'Information',
        icon: 'ℹ️',
        msg: opts.msg,
        buttons: opts.buttons || ['OK'],
        onButton: opts.onButton
      });
    },

    warn: function(opts) {
      return createDialog({
        title: opts.title || 'Warning',
        icon: '⚠️',
        msg: opts.msg,
        buttons: opts.buttons || ['OK'],
        onButton: opts.onButton
      });
    },

    confirm: function(opts) {
      return createDialog({
        title: opts.title || 'Confirm',
        icon: '❓',
        msg: opts.msg,
        buttons: opts.buttons || ['OK', 'Cancel'],
        onButton: opts.onButton
      });
    },

    storm: function(n) {
      // Show n staggered "Task failed successfully" popups
      for (var i = 0; i < (n || 5); i++) {
        (function(idx) {
          setTimeout(function() {
            var overlay = createDialog({
              title: 'Windows',
              icon: '⚠️',
              msg: 'Task failed successfully.',
              buttons: ['OK']
            });
            // Offset each popup
            var w = overlay.querySelector('.window');
            if (w) {
              w.style.position = 'relative';
              w.style.left = (idx * 15) + 'px';
              w.style.top = (idx * 15) + 'px';
            }
          }, idx * 300);
        })(i);
      }
    }
  };
})();
