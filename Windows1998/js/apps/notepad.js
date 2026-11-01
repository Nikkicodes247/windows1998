/* notepad.js — Notepad app (Part 2) */
(function() {
  'use strict';

  if (typeof Apps === 'undefined') return;

  Apps.register('notepad', {
    title: 'Notepad',
    icon: '📝',
    open: function(opts) {
      var fileContent = '';
      var fileName = 'Untitled';
      var isLoveLetter = false;

      if (opts && opts.file) {
        fileContent = opts.file.content || '';
        fileName = opts.file.name || 'Untitled';
        if (fileName.toLowerCase().indexOf('love_letter') !== -1) {
          isLoveLetter = true;
        }
      }

      var winId = 'notepad_' + Date.now();
      var win = WM.open({
        id: winId,
        title: 'Notepad - ' + fileName,
        icon: '📝',
        width: 520,
        height: 380,
        render: function(body) {
          // Menu bar
          var menuBar = document.createElement('div');
          menuBar.style.cssText = 'display:flex;gap:0;border-bottom:1px solid #808080;background:#c0c0c0;padding:1px 4px;';

          var menus = [
            { label: 'File', items: [
              { label: 'Open...', action: function() {
                if (typeof Popup !== 'undefined') Popup.info({ title: 'Open', msg: 'Use Explorer to open files.<br>This is 1999, we keep it simple.' });
              }},
              { label: 'Save', action: function() {
                if (typeof Popup !== 'undefined') Popup.warn({ title: 'Save', msg: 'Sharma-ji will find out.' });
              }},
              { label: 'Exit', action: function() { WM.close(winId); } }
            ]},
            { label: 'Edit', items: [
              { label: 'Undo', action: function() {
                if (typeof Popup !== 'undefined') Popup.info({ title: 'Undo', msg: 'If only life had an Undo button.<br>— Rahul, 1999' });
              }},
              { label: 'Select All', action: function() { var ta = body.querySelector('textarea'); if(ta) ta.select(); } }
            ]}
          ];

          menus.forEach(function(menu) {
            var menuBtn = document.createElement('div');
            menuBtn.style.cssText = 'position:relative;padding:2px 8px;cursor:pointer;font-size:11px;';
            menuBtn.textContent = menu.label;
            var dropdown = document.createElement('div');
            dropdown.className = 'window';
            dropdown.style.cssText = 'position:absolute;top:100%;left:0;display:none;z-index:100;min-width:120px;';
            var ddBody = document.createElement('div');
            ddBody.className = 'window-body';
            ddBody.style.padding = '2px';

            menu.items.forEach(function(item) {
              var itemEl = document.createElement('div');
              itemEl.style.cssText = 'padding:3px 8px;cursor:pointer;font-size:11px;';
              itemEl.textContent = item.label;
              itemEl.onmouseenter = function() { itemEl.style.background = '#000080'; itemEl.style.color = '#fff'; };
              itemEl.onmouseleave = function() { itemEl.style.background = ''; itemEl.style.color = ''; };
              itemEl.onclick = function() { dropdown.style.display = 'none'; item.action(); };
              ddBody.appendChild(itemEl);
            });

            dropdown.appendChild(ddBody);
            menuBtn.appendChild(dropdown);
            menuBtn.onclick = function(e) {
              e.stopPropagation();
              var showing = dropdown.style.display === 'block';
              // Close all dropdowns
              menuBar.querySelectorAll('.window').forEach(function(d) { d.style.display = 'none'; });
              dropdown.style.display = showing ? 'none' : 'block';
            };
            menuBtn.onmouseenter = function() { menuBtn.style.background = '#000080'; menuBtn.style.color = '#fff'; };
            menuBtn.onmouseleave = function() { menuBtn.style.background = ''; menuBtn.style.color = ''; };
            menuBar.appendChild(menuBtn);
          });
          body.appendChild(menuBar);

          // Close dropdown on outside click
          document.addEventListener('click', function() {
            menuBar.querySelectorAll('.window').forEach(function(d) { d.style.display = 'none'; });
          });

          // Textarea
          var textarea = document.createElement('textarea');
          textarea.style.cssText = 'width:100%;height:calc(100% - 24px);border:none;padding:8px;font-family:"Courier New",monospace;font-size:12px;resize:none;outline:none;';
          textarea.value = fileContent;
          body.appendChild(textarea);

          // Love letter trigger
          if (isLoveLetter) {
            setTimeout(function() {
              if (typeof Specs !== 'undefined' && Specs.loveLetter) {
                Specs.loveLetter();
              }
            }, 1500);
          }
        }
      });
    }
  });
})();
