/* wm.js — Window Manager (Part 1) */
(function() {
  'use strict';
  var windows = {};
  var zIndex = 100;
  var dragState = null;

  function createWindow(opts) {
    var id = opts.id || ('win_' + Date.now());
    if (windows[id]) {
      WM.focus(id);
      return windows[id];
    }

    var el = document.createElement('div');
    el.className = 'window wm-window';
    el.dataset.wmId = id;
    el.style.width = (opts.width || 500) + 'px';
    el.style.height = (opts.height || 350) + 'px';
    el.style.zIndex = ++zIndex;

    // Position: center or custom
    var deskW = window.innerWidth;
    var deskH = window.innerHeight - 30;
    var x = opts.x != null ? opts.x : Math.max(20, (deskW - (opts.width || 500)) / 2 + Math.random() * 40 - 20);
    var y = opts.y != null ? opts.y : Math.max(10, (deskH - (opts.height || 350)) / 2 + Math.random() * 40 - 20);
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    // Title bar
    var titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    var titleText = document.createElement('div');
    titleText.className = 'title-bar-text';
    titleText.textContent = (opts.icon ? opts.icon + ' ' : '') + (opts.title || 'Window');
    titleBar.appendChild(titleText);

    var controls = document.createElement('div');
    controls.className = 'title-bar-controls';

    var minBtn = document.createElement('button');
    minBtn.setAttribute('aria-label', 'Minimize');
    minBtn.onclick = function(e) { e.stopPropagation(); toggleMinimize(id); };
    controls.appendChild(minBtn);

    var maxBtn = document.createElement('button');
    maxBtn.setAttribute('aria-label', 'Maximize');
    maxBtn.onclick = function(e) { e.stopPropagation(); toggleMaximize(id); };
    controls.appendChild(maxBtn);

    var closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.onclick = function(e) { e.stopPropagation(); WM.close(id); };
    controls.appendChild(closeBtn);

    titleBar.appendChild(controls);
    el.appendChild(titleBar);

    // Body
    var body = document.createElement('div');
    body.className = 'window-body';
    body.style.cssText = 'height:calc(100% - 22px);overflow:auto;';
    el.appendChild(body);

    // Drag handlers
    titleBar.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') return;
      WM.focus(id);
      var rect = el.getBoundingClientRect();
      dragState = { id: id, offX: e.clientX - rect.left, offY: e.clientY - rect.top };
      e.preventDefault();
    });

    el.addEventListener('mousedown', function() { WM.focus(id); });

    // Add to DOM
    var layer = document.getElementById('windows-layer');
    if (layer) layer.appendChild(el);

    // Render content
    if (opts.render) {
      try { opts.render(body); } catch(err) { body.textContent = 'Error: ' + err.message; }
    }

    // Create taskbar button
    var taskBtn = document.createElement('button');
    taskBtn.className = 'taskbar-btn active';
    taskBtn.textContent = (opts.icon ? opts.icon + ' ' : '') + (opts.title || 'Window');
    taskBtn.dataset.wmId = id;
    taskBtn.onclick = function() {
      if (windows[id] && windows[id].minimized) {
        toggleMinimize(id);
      } else {
        WM.focus(id);
      }
    };
    var taskbarWins = document.getElementById('taskbar-windows');
    if (taskbarWins) taskbarWins.appendChild(taskBtn);

    var winObj = {
      id: id,
      el: el,
      body: body,
      titleBar: titleBar,
      titleText: titleText,
      taskBtn: taskBtn,
      minimized: false,
      maximized: false,
      prevRect: null,
      close: function() { WM.close(id); },
      setTitle: function(t) {
        titleText.textContent = (opts.icon ? opts.icon + ' ' : '') + t;
        taskBtn.textContent = (opts.icon ? opts.icon + ' ' : '') + t;
      }
    };

    windows[id] = winObj;
    WM.focus(id);
    return winObj;
  }

  function toggleMinimize(id) {
    var w = windows[id];
    if (!w) return;
    w.minimized = !w.minimized;
    if (w.minimized) {
      w.el.classList.add('minimized');
      w.taskBtn.classList.remove('active');
    } else {
      w.el.classList.remove('minimized');
      w.taskBtn.classList.add('active');
      WM.focus(id);
    }
  }

  function toggleMaximize(id) {
    var w = windows[id];
    if (!w) return;
    w.maximized = !w.maximized;
    if (w.maximized) {
      w.prevRect = { left: w.el.style.left, top: w.el.style.top, width: w.el.style.width, height: w.el.style.height };
      w.el.classList.add('maximized');
    } else {
      w.el.classList.remove('maximized');
      if (w.prevRect) {
        w.el.style.left = w.prevRect.left;
        w.el.style.top = w.prevRect.top;
        w.el.style.width = w.prevRect.width;
        w.el.style.height = w.prevRect.height;
      }
    }
  }

  // Global mouse move/up for dragging
  document.addEventListener('mousemove', function(e) {
    if (!dragState) return;
    var w = windows[dragState.id];
    if (!w || w.maximized) return;
    w.el.style.left = Math.max(0, e.clientX - dragState.offX) + 'px';
    w.el.style.top = Math.max(0, e.clientY - dragState.offY) + 'px';
  });
  document.addEventListener('mouseup', function() { dragState = null; });

  window.WM = {
    open: function(opts) {
      return createWindow(opts);
    },

    close: function(id) {
      var w = windows[id];
      if (!w) return;
      if (w.el.parentNode) w.el.parentNode.removeChild(w.el);
      if (w.taskBtn && w.taskBtn.parentNode) w.taskBtn.parentNode.removeChild(w.taskBtn);
      delete windows[id];
    },

    focus: function(id) {
      var w = windows[id];
      if (!w) return;
      w.el.style.zIndex = ++zIndex;
      // Update taskbar
      var btns = document.querySelectorAll('.taskbar-btn');
      btns.forEach(function(b) { b.classList.remove('active'); });
      if (w.taskBtn) w.taskBtn.classList.add('active');
      // Visual focus
      Object.keys(windows).forEach(function(k) {
        var win = windows[k];
        if (win.titleBar) win.titleBar.classList.remove('title-bar-focused');
      });
    },

    isOpen: function(id) {
      return !!windows[id];
    },

    getAll: function() {
      return windows;
    },

    minimize: function(id) {
      toggleMinimize(id);
    }
  };

  /* ===== Apps Registry (initialized early for application scripts) ===== */
  var appRegistry = {};
  window.Apps = window.Apps || {
    register: function(name, def) {
      if (appRegistry[name]) return;
      appRegistry[name] = def;
    },
    launch: function(name, opts) {
      var app = appRegistry[name];
      if (app && app.open) {
        app.open(opts || {});
      } else {
        if (typeof Popup !== 'undefined' && Popup.error) {
          Popup.error({ title: 'Error', msg: 'Cannot find the program "' + name + '".<br>Make sure the path is correct.' });
        }
      }
    },
    get: function(name) { return appRegistry[name]; }
  };
})();
