/* defrag.js — Disk Defragmenter (Part 2) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('defrag', {
    title: 'Disk Defragmenter',
    icon: '🟦',
    open: function() {
      var winId = 'defrag_' + Date.now();
      WM.open({
        id: winId,
        title: 'Disk Defragmenter',
        icon: '🟦',
        width: 460,
        height: 360,
        render: function(body) {
          body.style.cssText = 'background:#c0c0c0;padding:8px;height:calc(100% - 22px);display:flex;flex-direction:column;';

          var header = document.createElement('div');
          header.style.cssText = 'margin-bottom:8px;';
          header.innerHTML = '<b>Disk Defragmenter — Sharma-ji Edition</b><br><span style="font-size:10px;">Drive C: [SHARMA_PC]</span>';
          body.appendChild(header);

          // Grid
          var gridContainer = document.createElement('div');
          gridContainer.style.cssText = 'border:2px inset;background:#fff;padding:4px;flex:1;overflow:hidden;';
          var COLS = 32, ROWS = 12;
          var grid = document.createElement('div');
          grid.style.cssText = 'display:grid;grid-template-columns:repeat('+COLS+',1fr);gap:1px;height:100%;';

          var cells = [];
          var colors = ['#0000ff', '#ff0000', '#00ff00', '#ffffff', '#ffff00', '#ff00ff', '#00ffff', '#808080'];
          for (var i = 0; i < COLS * ROWS; i++) {
            var cell = document.createElement('div');
            cell.style.cssText = 'background:' + colors[Math.floor(Math.random() * colors.length)] + ';min-height:4px;';
            cells.push(cell);
            grid.appendChild(cell);
          }
          gridContainer.appendChild(grid);
          body.appendChild(gridContainer);

          // Status
          var status = document.createElement('div');
          status.style.cssText = 'margin-top:8px;font-size:11px;padding:4px;border:1px inset;background:#fff;';
          status.textContent = 'Status: Ready. Click Start to defragment India.';
          body.appendChild(status);

          // Progress
          var progress = document.createElement('div');
          progress.style.cssText = 'margin-top:4px;display:flex;align-items:center;gap:8px;';
          var progressBar = document.createElement('div');
          progressBar.style.cssText = 'flex:1;height:16px;border:1px inset;background:#fff;';
          var progressFill = document.createElement('div');
          progressFill.style.cssText = 'height:100%;width:0%;background:#000080;transition:width 0.3s;';
          progressBar.appendChild(progressFill);
          progress.appendChild(progressBar);

          var startBtn = document.createElement('button');
          startBtn.textContent = 'Start';
          startBtn.onclick = function() {
            startBtn.disabled = true;
            var pct = 0;
            var clustersLeft = 1947;
            var saltErrors = 0;

            var defragInterval = setInterval(function() {
              if (!WM.isOpen(winId)) { clearInterval(defragInterval); return; }

              pct += Math.random() * 2;
              if (pct > 100) pct = 100;
              progressFill.style.width = pct + '%';
              clustersLeft = Math.max(0, Math.floor(1947 * (1 - pct / 100)));

              // Animate some cells turning blue
              var idx = Math.floor(Math.random() * cells.length);
              cells[idx].style.background = '#0000ff';

              status.textContent = 'Defragmenting India... moving ' + clustersLeft + ' clusters... salt tax errors: ' + saltErrors;

              if (Math.random() < 0.05) {
                saltErrors++;
              }

              if (pct >= 100) {
                clearInterval(defragInterval);
                status.textContent = 'Defragmentation complete! 1947 clusters reorganised. Salt tax errors: ' + saltErrors + ' (waived)';
                // Turn all cells blue
                cells.forEach(function(c) { c.style.background = '#0000ff'; });
                startBtn.disabled = false;
                startBtn.textContent = 'Defrag Again';
              }
            }, 150);
          };
          progress.appendChild(startBtn);
          body.appendChild(progress);
        }
      });
    }
  });
})();
