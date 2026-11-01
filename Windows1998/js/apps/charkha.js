/* charkha.js — Charkha-gotchi (Part 2) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('charkha', {
    title: 'Charkha-gotchi',
    icon: '🪡',
    open: function() {
      var winId = 'charkha_' + Date.now();
      WM.open({
        id: winId,
        title: 'Charkha-gotchi',
        icon: '🪡',
        width: 300,
        height: 320,
        render: function(body) {
          body.style.cssText = 'background:#e8dcc8;padding:12px;text-align:center;height:calc(100% - 22px);display:flex;flex-direction:column;align-items:center;justify-content:center;';

          var statusEl = document.createElement('div');
          statusEl.style.cssText = 'font-size:12px;margin-bottom:8px;color:#333;';
          statusEl.textContent = '🧵 Your Charkha-gotchi is waiting...';
          body.appendChild(statusEl);

          // Charkha wheel (CSS drawn)
          var wheelContainer = document.createElement('div');
          wheelContainer.style.cssText = 'width:120px;height:120px;margin:12px auto;position:relative;cursor:pointer;';
          var wheel = document.createElement('div');
          wheel.style.cssText = 'width:100%;height:100%;border:4px solid #8B4513;border-radius:50%;position:relative;transition:transform 0.1s;';

          // Spokes
          for (var i = 0; i < 12; i++) {
            var spoke = document.createElement('div');
            spoke.style.cssText = 'position:absolute;width:2px;height:50%;background:#8B4513;left:50%;top:0;transform-origin:bottom center;transform:rotate(' + (i * 30) + 'deg);';
            wheel.appendChild(spoke);
          }

          // Center
          var center = document.createElement('div');
          center.style.cssText = 'position:absolute;width:16px;height:16px;background:#8B4513;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);';
          wheel.appendChild(center);

          wheelContainer.appendChild(wheel);
          body.appendChild(wheelContainer);

          var spinCount = 0;
          var angle = 0;
          var spinning = false;
          var spinInterval = null;
          var neglectTimer = null;
          var happiness = 100;

          var happinessBar = document.createElement('div');
          happinessBar.style.cssText = 'width:100%;max-width:200px;margin:8px auto;';
          happinessBar.innerHTML = '<div style="font-size:10px;margin-bottom:2px;">Happiness</div><div style="border:1px inset;height:12px;background:#fff;"><div id="charkha-happy-'+winId+'" style="height:100%;background:#0a0;width:100%;transition:width 0.3s;"></div></div>';
          body.appendChild(happinessBar);

          var spinBtn = document.createElement('button');
          spinBtn.textContent = '🔄 Spin the Charkha!';
          spinBtn.style.cssText = 'font-size:12px;padding:6px 16px;margin-top:8px;cursor:pointer;';
          body.appendChild(spinBtn);

          function updateHappiness() {
            var bar = document.getElementById('charkha-happy-' + winId);
            if (bar) {
              bar.style.width = happiness + '%';
              bar.style.background = happiness > 60 ? '#0a0' : happiness > 30 ? '#ff0' : '#f00';
            }
          }

          function startNeglectTimer() {
            if (neglectTimer) clearTimeout(neglectTimer);
            neglectTimer = setTimeout(function() {
              if (!WM.isOpen(winId)) return;
              statusEl.textContent = '😢 Your Charkha-gotchi has quit India.';
              happiness = 0;
              updateHappiness();
              spinBtn.disabled = true;
              spinBtn.textContent = '🕊️ Gone...';
              if (typeof Popup !== 'undefined' && Popup.info) {
                Popup.info({ title: 'Charkha-gotchi', msg: 'Your Charkha-gotchi has quit India.<br>It waited 10 seconds. You couldn\'t even spin a wheel.<br><br>Gandhi would be disappointed.' });
              }
            }, 10000);
          }

          spinBtn.onclick = function() {
            spinCount++;
            happiness = Math.min(100, happiness + 15);
            updateHappiness();

            // Spin animation
            spinning = true;
            if (typeof Sound !== 'undefined') Sound.beep(200 + spinCount * 20, 100);

            var spinSpeed = 10 + spinCount * 2;
            if (spinInterval) clearInterval(spinInterval);
            var ticks = 0;
            spinInterval = setInterval(function() {
              angle += spinSpeed;
              wheel.style.transform = 'rotate(' + angle + 'deg)';
              ticks++;
              if (ticks > 30) {
                clearInterval(spinInterval);
                spinning = false;
              }
            }, 50);

            var messages = [
              '🧵 Spinning! Swaraj is near!',
              '🧵 Swadeshi! Made in India!',
              '🧵 Keep spinning! Freedom awaits!',
              '🧵 ' + spinCount + ' spins! You\'re a natural!',
              '🧵 The British are worried!',
              '🧵 Your thread is strong!',
              '🧵 Spin ' + spinCount + '! Incredible dedication!',
            ];
            statusEl.textContent = messages[spinCount % messages.length];
            startNeglectTimer();
          };

          // Decay happiness
          var decayInt = setInterval(function() {
            if (!WM.isOpen(winId)) { clearInterval(decayInt); if(neglectTimer)clearTimeout(neglectTimer); return; }
            if (happiness > 0) {
              happiness = Math.max(0, happiness - 2);
              updateHappiness();
            }
          }, 2000);

          startNeglectTimer();
        }
      });
    }
  });
})();
