/* explorer.js — Windows Explorer (Part 2) */
(function() {
  'use strict';

  if (typeof Apps === 'undefined') return;

  Apps.register('explorer', {
    title: 'Windows Explorer',
    icon: '📂',
    open: function(opts) {
      var currentPath = (opts && opts.path) || 'C:\\';
      var showHidden = false;
      var history = [currentPath];
      var histIdx = 0;
      var winId = 'explorer_' + Date.now();

      function getPathDisplay(p) {
        return p || 'C:\\';
      }

      function renderFolder(body, path) {
        body.innerHTML = '';
        currentPath = path;

        // Toolbar
        var toolbar = document.createElement('div');
        toolbar.style.cssText = 'display:flex;align-items:center;gap:4px;padding:4px;border-bottom:1px solid #808080;background:#c0c0c0;';

        var backBtn = document.createElement('button');
        backBtn.textContent = '← Back';
        backBtn.style.fontSize = '10px';
        backBtn.onclick = function() {
          if (histIdx > 0) { histIdx--; renderFolder(body, history[histIdx]); }
        };
        toolbar.appendChild(backBtn);

        var addrBar = document.createElement('input');
        addrBar.type = 'text';
        addrBar.value = getPathDisplay(path);
        addrBar.style.cssText = 'flex:1;font-size:11px;padding:2px 4px;';
        addrBar.onkeydown = function(e) {
          if (e.key === 'Enter') {
            navigateTo(body, addrBar.value);
          }
        };
        toolbar.appendChild(addrBar);

        // View menu
        var viewBtn = document.createElement('button');
        viewBtn.textContent = '👁️ View';
        viewBtn.style.fontSize = '10px';
        viewBtn.onclick = function() {
          showHidden = !showHidden;
          if (showHidden && typeof Egg !== 'undefined') {
            Egg.unlock(19, 'Explorer: Show hidden files — rahul_never_sent.txt');
          }
          renderFolder(body, path);
        };
        toolbar.appendChild(viewBtn);

        body.appendChild(toolbar);

        // File list
        var fileList = document.createElement('div');
        fileList.style.cssText = 'padding:8px;display:flex;flex-wrap:wrap;gap:4px;align-content:flex-start;overflow:auto;height:calc(100% - 32px);';

        if (typeof FS === 'undefined') {
          fileList.innerHTML = '<p style="color:#888;padding:20px;">File system not loaded.</p>';
          body.appendChild(fileList);
          return;
        }

        var items = FS.list(path);
        if (!items || !items.length) {
          // Check if it's a file
          var node = FS.get(path);
          if (node && node.type === 'file') {
            Apps.launch(node.app || 'notepad', { file: node });
            WM.close(winId);
            return;
          }
          fileList.innerHTML = '<p style="color:#888;padding:20px;">This folder is empty.</p>';
          body.appendChild(fileList);
          return;
        }

        // Parent folder
        if (path !== 'C:\\' && path !== 'C:') {
          var parentEl = document.createElement('div');
          parentEl.className = 'desktop-icon';
          parentEl.innerHTML = '<div class="icon-img">📁</div><div class="icon-label" style="color:#000;">..</div>';
          parentEl.ondblclick = function() {
            var parts = path.replace(/\\$/, '').split('\\');
            parts.pop();
            var parent = parts.join('\\') || 'C:\\';
            navigateTo(body, parent);
          };
          fileList.appendChild(parentEl);
        }

        items.forEach(function(item) {
          if (item.hidden && !showHidden) return;

          var el = document.createElement('div');
          el.className = 'desktop-icon';
          el.style.opacity = item.hidden ? '0.5' : '1';
          el.innerHTML =
            '<div class="icon-img">' + (item.icon || '📄') + '</div>' +
            '<div class="icon-label" style="color:#000;">' + item.name + '</div>';

          el.ondblclick = function() {
            if (item.type === 'folder') {
              var newPath = (path === 'C:\\' ? 'C:\\' : path + '\\') + item.name;
              navigateTo(body, newPath);
            } else {
              // Open file
              if (item.name === 'Pinball.exe') {
                if (typeof Egg !== 'undefined' && Egg.unlock) Egg.unlock(17, 'Pinball.exe — Please insert the Windows 98 CD');
              }
              if (item.name === 'titanic_1997.jpg') {
                if (typeof Egg !== 'undefined' && Egg.unlock) Egg.unlock(18, 'titanic_1997.jpg — Not enough memory');
              }
              if (item.name === 'most_wanted_list.jpg') {
                if (typeof Egg !== 'undefined' && Egg.unlock) Egg.unlock(16, 'most_wanted_list.jpg — Wanted: Minesweeper record holder');
              }
              if (item.name === '9-11-attack-planning.pdf') {
                if (typeof Egg !== 'undefined' && Egg.unlock) Egg.unlock(15, 'Operation Samosa — 9 November');
              }
              if (typeof Apps !== 'undefined' && Apps.launch) {
                Apps.launch(item.app || 'notepad', { file: item });
              }
            }
          };

          el.onclick = function() {
            fileList.querySelectorAll('.desktop-icon').forEach(function(i) { i.classList.remove('selected'); });
            el.classList.add('selected');
          };

          fileList.appendChild(el);
        });

        body.appendChild(fileList);
      }

      function navigateTo(body, path) {
        currentPath = path;
        if (histIdx < history.length - 1) history = history.slice(0, histIdx + 1);
        history.push(path);
        histIdx = history.length - 1;
        renderFolder(body, path);
      }

      WM.open({
        id: winId,
        title: 'Exploring - ' + getPathDisplay(currentPath),
        icon: '📂',
        width: 560,
        height: 400,
        render: function(body) {
          renderFolder(body, currentPath);
        }
      });
    }
  });
})();
