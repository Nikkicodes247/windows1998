/* minesweeper.js — Minesweeper (Part 2) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('minesweeper', {
    title: 'Minesweeper',
    icon: '💣',
    open: function() {
      var winId = 'minesweeper_' + Date.now();
      WM.open({
        id: winId,
        title: 'Minesweeper — Swaraj Edition',
        icon: '💣',
        width: 300,
        height: 370,
        render: function(body) {
          body.style.cssText = 'background:#c0c0c0;padding:6px;height:calc(100% - 22px);';
          var ROWS=9,COLS=9,MINES=10;
          var grid=[],revealed=[],flagged=[],gameOver=false,won=false,firstClick=true;
          var mineCount=MINES;
          var xyzzyActive=false, xyzzyBuf='';
          var timerVal=0, timerInt=null;

          // Header
          var header = document.createElement('div');
          header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:4px;border:2px inset;margin-bottom:4px;background:#c0c0c0;';
          var mineDisplay = document.createElement('div');
          mineDisplay.style.cssText='background:#000;color:#f00;font-family:monospace;font-size:18px;padding:2px 6px;min-width:40px;text-align:center;';
          mineDisplay.textContent = String(mineCount).padStart(3,'0');
          var faceBtn = document.createElement('button');
          faceBtn.textContent='😊';
          faceBtn.style.fontSize='18px';
          faceBtn.onclick=function(){resetGame();};
          var timerDisplay = document.createElement('div');
          timerDisplay.style.cssText='background:#000;color:#f00;font-family:monospace;font-size:18px;padding:2px 6px;min-width:40px;text-align:center;';
          timerDisplay.textContent='000';
          header.appendChild(mineDisplay);
          header.appendChild(faceBtn);
          header.appendChild(timerDisplay);
          body.appendChild(header);

          // Grid
          var gridEl = document.createElement('div');
          gridEl.style.cssText = 'display:grid;grid-template-columns:repeat('+COLS+',28px);grid-template-rows:repeat('+ROWS+',28px);gap:0;border:2px inset;';
          body.appendChild(gridEl);

          // xyzzy pixel indicator
          var pixelEl = document.createElement('div');
          pixelEl.style.cssText = 'width:3px;height:3px;position:absolute;top:2px;left:2px;';
          body.style.position = 'relative';
          body.appendChild(pixelEl);

          function initGrid() {
            grid=[];revealed=[];flagged=[];
            for(var r=0;r<ROWS;r++){
              grid[r]=[];revealed[r]=[];flagged[r]=[];
              for(var c=0;c<COLS;c++){grid[r][c]=0;revealed[r][c]=false;flagged[r][c]=false;}
            }
          }

          function placeMines(safeR,safeC) {
            var placed=0;
            while(placed<MINES) {
              var r=Math.floor(Math.random()*ROWS);
              var c=Math.floor(Math.random()*COLS);
              if(grid[r][c]!==-1 && !(r===safeR&&c===safeC)) {
                grid[r][c]=-1;placed++;
              }
            }
            // Count neighbors
            for(var r=0;r<ROWS;r++){
              for(var c=0;c<COLS;c++){
                if(grid[r][c]===-1) continue;
                var count=0;
                for(var dr=-1;dr<=1;dr++){for(var dc=-1;dc<=1;dc++){
                  var nr=r+dr,nc=c+dc;
                  if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&grid[nr][nc]===-1) count++;
                }}
                grid[r][c]=count;
              }
            }
          }

          function renderGrid() {
            gridEl.innerHTML='';
            for(var r=0;r<ROWS;r++){
              for(var c=0;c<COLS;c++){
                var cell=document.createElement('button');
                cell.style.cssText='width:28px;height:28px;font-size:12px;padding:0;text-align:center;line-height:28px;font-weight:bold;';
                cell.dataset.r=r;cell.dataset.c=c;
                if(revealed[r][c]) {
                  cell.disabled=true;
                  cell.style.background='#d0d0d0';
                  cell.style.border='1px solid #808080';
                  if(grid[r][c]===-1) {
                    cell.textContent='🧂';
                    cell.style.background='#fcc';
                  } else if(grid[r][c]>0) {
                    var colors=['','#0000ff','#008000','#ff0000','#000080','#800000','#008080','#000','#808080'];
                    cell.textContent=grid[r][c];
                    cell.style.color=colors[grid[r][c]]||'#000';
                  }
                } else if(flagged[r][c]) {
                  cell.textContent='🚩';
                } else {
                  cell.onclick=(function(rr,cc){return function(){reveal(rr,cc);};})(r,c);
                  cell.oncontextmenu=(function(rr,cc){return function(e){e.preventDefault();toggleFlag(rr,cc);};})(r,c);
                }
                // xyzzy indicator
                if(xyzzyActive && !revealed[r][c] && !flagged[r][c]) {
                  // Show subtle hint based on mouse position later
                }
                gridEl.appendChild(cell);
              }
            }
            // xyzzy pixel
            if(xyzzyActive) {
              updateXyzzyPixel(-1,-1);
            }
          }

          function reveal(r,c) {
            if(gameOver||revealed[r][c]||flagged[r][c]) return;
            if(firstClick) {
              firstClick=false;
              placeMines(r,c);
              timerInt=setInterval(function(){
                timerVal++;timerDisplay.textContent=String(timerVal).padStart(3,'0');
              },1000);
            }
            revealed[r][c]=true;
            if(grid[r][c]===-1) {
              // Mine hit
              gameOver=true;faceBtn.textContent='😵';
              if(timerInt){clearInterval(timerInt);timerInt=null;}
              // Reveal all mines
              for(var rr=0;rr<ROWS;rr++) for(var cc=0;cc<COLS;cc++) {
                if(grid[rr][cc]===-1) revealed[rr][cc]=true;
              }
              renderGrid();
              if(typeof Sound!=='undefined') Sound.error();
              if(typeof Popup!=='undefined') Popup.error({title:'💥 Game Over',msg:'Salt tax detected.<br>You stepped on a salt crystal!'});
              if(typeof Specs!=='undefined'&&Specs.minesweeperLost) Specs.minesweeperLost();
              return;
            }
            // Flood fill for 0s
            if(grid[r][c]===0) {
              for(var dr=-1;dr<=1;dr++) for(var dc=-1;dc<=1;dc++) {
                var nr=r+dr,nc=c+dc;
                if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) reveal(nr,nc);
              }
            }
            // Check win
            var unrevealed=0;
            for(var rr=0;rr<ROWS;rr++) for(var cc=0;cc<COLS;cc++) {
              if(!revealed[rr][cc]) unrevealed++;
            }
            if(unrevealed===MINES) {
              gameOver=true;won=true;faceBtn.textContent='😎';
              if(timerInt){clearInterval(timerInt);timerInt=null;}
              if(typeof Sound!=='undefined') Sound.chime();
              if(typeof Popup!=='undefined') Popup.info({title:'🏆 Swaraj Achieved!',msg:'You cleared all the mines!<br>India is free from salt tax.'});
            }
            renderGrid();
          }

          function toggleFlag(r,c) {
            if(gameOver||revealed[r][c]) return;
            flagged[r][c]=!flagged[r][c];
            mineCount+=(flagged[r][c]?-1:1);
            mineDisplay.textContent=String(mineCount).padStart(3,'0');
            renderGrid();
          }

          function updateXyzzyPixel(r,c) {
            if(!xyzzyActive) {pixelEl.style.background='';return;}
            if(r<0||r>=ROWS||c<0||c>=COLS) {pixelEl.style.background='#808080';return;}
            pixelEl.style.background = grid[r][c]===-1 ? '#000' : '#fff';
          }

          function resetGame() {
            gameOver=false;won=false;firstClick=true;mineCount=MINES;timerVal=0;
            if(timerInt){clearInterval(timerInt);timerInt=null;}
            mineDisplay.textContent=String(mineCount).padStart(3,'0');
            timerDisplay.textContent='000';
            faceBtn.textContent='😊';
            initGrid();renderGrid();
          }

          // xyzzy listener
          function keyHandler(e) {
            if(!WM.isOpen(winId)) {document.removeEventListener('keydown',keyHandler);return;}
            xyzzyBuf += e.key.toLowerCase();
            if(xyzzyBuf.length>5) xyzzyBuf=xyzzyBuf.slice(-5);
            if(xyzzyBuf==='xyzzy') {
              xyzzyActive=true;
              if(typeof Egg!=='undefined') Egg.unlock(20,'Minesweeper: xyzzy cheat pixel');
              // Track mouse over cells
              gridEl.onmouseover=function(ev){
                var cell=ev.target;
                if(cell.dataset.r!==undefined) {
                  updateXyzzyPixel(parseInt(cell.dataset.r),parseInt(cell.dataset.c));
                }
              };
            }
          }
          document.addEventListener('keydown',keyHandler);

          initGrid();renderGrid();

          // Cleanup
          var checkInt=setInterval(function(){
            if(!WM.isOpen(winId)){
              document.removeEventListener('keydown',keyHandler);
              if(timerInt)clearInterval(timerInt);
              clearInterval(checkInt);
            }
          },500);
        }
      });
    }
  });
})();
