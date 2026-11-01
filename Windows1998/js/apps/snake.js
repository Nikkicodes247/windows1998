/* snake.js — Snake II game (Part 2) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('snake', {
    title: 'Snake II',
    icon: '🐍',
    open: function() {
      var winId = 'snake_' + Date.now();
      WM.open({
        id: winId,
        title: 'Snake II — Dandi Edition',
        icon: '🐍',
        width: 380,
        height: 420,
        render: function(body) {
          body.style.cssText = 'background:#9bbc0f;display:flex;flex-direction:column;align-items:center;padding:8px;height:calc(100% - 22px);';

          var score = 0, gameOver = false, gameStarted = false, speed = 150;
          var COLS = 20, ROWS = 20, CELL = 14;

          var scoreEl = document.createElement('div');
          scoreEl.style.cssText = 'font-family:monospace;font-size:13px;color:#306230;margin-bottom:4px;font-weight:bold;';
          scoreEl.textContent = 'Salt collected: 0 | Press SPACE to start';
          body.appendChild(scoreEl);

          var canvas = document.createElement('canvas');
          canvas.width = COLS * CELL;
          canvas.height = ROWS * CELL;
          canvas.style.cssText = 'border:2px solid #306230;background:#9bbc0f;';
          body.appendChild(canvas);
          var ctx = canvas.getContext('2d');

          var snake = [{x:10,y:10}];
          var dir = {x:1,y:0};
          var nextDir = {x:1,y:0};
          var food = {x:5,y:5};
          var interval = null;

          function placeFood() {
            do {
              food.x = Math.floor(Math.random()*COLS);
              food.y = Math.floor(Math.random()*ROWS);
            } while(snake.some(function(s){return s.x===food.x&&s.y===food.y;}));
          }

          function draw() {
            ctx.fillStyle = '#9bbc0f';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            // Grid
            ctx.strokeStyle = '#8bac0f';
            ctx.lineWidth = 0.5;
            for(var i=0;i<COLS;i++){ctx.beginPath();ctx.moveTo(i*CELL,0);ctx.lineTo(i*CELL,canvas.height);ctx.stroke();}
            for(var j=0;j<ROWS;j++){ctx.beginPath();ctx.moveTo(0,j*CELL);ctx.lineTo(canvas.width,j*CELL);ctx.stroke();}
            // Food (salt crystal 🧂)
            ctx.font = (CELL-2)+'px serif';
            ctx.fillText('🧂',food.x*CELL+1,food.y*CELL+CELL-2);
            // Snake
            snake.forEach(function(seg,i) {
              ctx.fillStyle = i===0?'#306230':'#4a7a2e';
              ctx.fillRect(seg.x*CELL+1,seg.y*CELL+1,CELL-2,CELL-2);
            });
            if(gameOver) {
              ctx.fillStyle='rgba(0,0,0,0.6)';
              ctx.fillRect(0,0,canvas.width,canvas.height);
              ctx.fillStyle='#9bbc0f';
              ctx.font='bold 16px monospace';
              ctx.textAlign='center';
              ctx.fillText('GAME OVER',canvas.width/2,canvas.height/2-10);
              ctx.font='12px monospace';
              ctx.fillText('Salt tax collected: '+score,canvas.width/2,canvas.height/2+10);
              ctx.fillText('Press SPACE to restart',canvas.width/2,canvas.height/2+30);
              ctx.textAlign='start';
            }
            if(!gameStarted && !gameOver){
              ctx.fillStyle='rgba(0,0,0,0.5)';
              ctx.fillRect(0,0,canvas.width,canvas.height);
              ctx.fillStyle='#9bbc0f';
              ctx.font='bold 14px monospace';
              ctx.textAlign='center';
              ctx.fillText('SNAKE II — Dandi Edition',canvas.width/2,canvas.height/2-20);
              ctx.font='11px monospace';
              ctx.fillText('Collect salt crystals 🧂',canvas.width/2,canvas.height/2);
              ctx.fillText('Arrow keys to move',canvas.width/2,canvas.height/2+16);
              ctx.fillText('Press SPACE to start',canvas.width/2,canvas.height/2+36);
              ctx.textAlign='start';
            }
          }

          function tick() {
            if(gameOver||!gameStarted) return;
            dir = nextDir;
            var head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
            // Walls
            if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS) { endGame(); return; }
            // Self
            if(snake.some(function(s){return s.x===head.x&&s.y===head.y;})) { endGame(); return; }
            snake.unshift(head);
            if(head.x===food.x&&head.y===food.y) {
              score++;
              scoreEl.textContent = 'Salt collected: '+score;
              if(typeof Sound!=='undefined') Sound.beep(600,50);
              // Speed up
              if(score%3===0 && speed>60) {
                speed -= 10;
                clearInterval(interval);
                interval = setInterval(tick, speed);
              }
              // Dandi egg at length 12
              if(snake.length===12) {
                if(typeof Egg!=='undefined') Egg.unlock(21,'Snake length 12 — Dandi reached: 390 km');
                if(typeof Popup!=='undefined') Popup.info({title:'🏆 Achievement',msg:'Dandi reached: 390 km<br>Your snake has marched to the sea!'});
              }
              placeFood();
            } else {
              snake.pop();
            }
            draw();
          }

          function endGame() {
            gameOver=true;
            if(interval){clearInterval(interval);interval=null;}
            draw();
            if(typeof Specs!=='undefined'&&Specs.minesweeperLost) {
              // Don't trigger minesweeper specs on snake
            }
          }

          function startGame() {
            snake=[{x:10,y:10}];dir={x:1,y:0};nextDir={x:1,y:0};
            score=0;gameOver=false;gameStarted=true;speed=150;
            scoreEl.textContent='Salt collected: 0';
            placeFood();
            if(interval)clearInterval(interval);
            interval=setInterval(tick,speed);
            draw();
          }

          function handleKey(e) {
            if(e.key===' ') {
              e.preventDefault();
              if(!gameStarted||gameOver) startGame();
              return;
            }
            if(!gameStarted||gameOver) return;
            switch(e.key) {
              case 'ArrowUp': if(dir.y!==1){nextDir={x:0,y:-1};} break;
              case 'ArrowDown': if(dir.y!==-1){nextDir={x:0,y:1};} break;
              case 'ArrowLeft': if(dir.x!==1){nextDir={x:-1,y:0};} break;
              case 'ArrowRight': if(dir.x!==-1){nextDir={x:1,y:0};} break;
            }
            e.preventDefault();
          }

          document.addEventListener('keydown', handleKey);
          draw();

          // Cleanup on window close
          var origClose = WM.close;
          var closePatched = false;
          var checkInterval = setInterval(function() {
            if(!WM.isOpen(winId)) {
              document.removeEventListener('keydown', handleKey);
              if(interval)clearInterval(interval);
              clearInterval(checkInterval);
            }
          }, 500);
        }
      });
    }
  });
})();
